// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'

const useLocalStorageState = (
    key,
    initialName,
    {serialize = JSON.stringify, deserialize = JSON.parse} = {},
) => {
    /**
     * If you pass a function over a value to useState(), then it will only call that function to get that value when the component is rendered the first time.
     * React.useState(someExpensiveComputation()) ---> React.useState(someExpensiveComputation())
     * https://kentcdodds.com/blog/use-state-lazy-initialization-and-function-updates
     */

    // lazy initialization
    const getInitialLS = () => {
        const lsValue = window.localStorage.getItem(key)
        if (lsValue) {
            return deserialize(lsValue)
        } else {
            return typeof initialName === 'function' ? initialName() : initialName
        }
    }

    const [state, setState] = React.useState(getInitialLS)
    const prevKeyRef = React.useRef(key)

    React.useEffect(() => {
    if (prevKeyRef.current !== key) {
        window.localStorage.removeItem(prevKeyRef.current)
        prevKeyRef.current = key
    }
    window.localStorage.setItem(key, serialize(state))
    }, [key, state, serialize])

    return [state, setState]
}

function Greeting({initialName = ''}) {
    const [state, setState] = useLocalStorageState('name', initialName)

    function handleChange(event) {
        setState(event.target.value)
    }

  return (
    <div>
        <form>
            <label htmlFor="name">Name: </label>
            <input value={state} onChange={handleChange} id="name" />
        </form>
        {state ? <strong>Hello {state}</strong> : 'Please type your name'}
    </div>
  )
}

function App() {
    return <Greeting />
}

export default App
