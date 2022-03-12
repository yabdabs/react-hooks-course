// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'

const useLocalStorageState = (
    key,
    initialName,
    {serialize = JSON.stringify, deserialize = JSON.parse} = {},
) => {
    /**
     * Lazy initialization
     * If you pass a function over a value to useState(), then it will only call that function to get that value when the component is rendered the first time.
     * React.useState(someExpensiveComputation()) ---> React.useState(someExpensiveComputation())
     * https://kentcdodds.com/blog/use-state-lazy-initialization-and-function-updates
     * 
     * Reason we'd only want it to run once is what if the initial state computation is expensive? It would run on every re-render (ex - IO operation - localStorage)
     * Summary- Lazy initializers are useful to improve performance issues in some scenarios, the dispatch function updates help you avoid issues with stale values.
     */

    // lazy initialization
    const getInitialLS = () => {
        const lsValue = window.localStorage.getItem(key)
        if (lsValue) {
            return deserialize(lsValue)
        } else {
            /**
             * The reason we allow for a function is incase there is some expensive calculation needed for the value.
             * If it's expensive, we don't want it to be calculated every time setState happens/ every time the comp re renders.
             * So we add it here in lazy initialization so that it's only called when the component is rendered the first time.
             */
            return typeof initialName === 'function' ? initialName() : initialName
        }
    }

    const [state, setState] = React.useState(getInitialLS)
    /** UseRef won't trigger a re render */
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
    // Custom Hook useLocalStorageState
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
