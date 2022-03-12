// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
// 🐨 you'll want the following additional things from '../pokemon':
// fetchPokemon: the function we call to get the pokemon info
// PokemonInfoFallback: the thing we show while we're loading the pokemon info
// PokemonDataView: the stuff we use to display the pokemon info
import {
  PokemonForm,
  fetchPokemon,
  PokemonInfoFallback,
  PokemonDataView,
  PokemonErrorBoundary
} from '../pokemon'

// https://github.com/bvaughn/react-error-boundary
// https://javascript.info/optional-chaining
// import ErrorBoundary from '../ErrorBoundary'

const PokemonInfo = ({ pokemonName }) => {

  const [state, setState] = React.useState({
    status: 'idle',
    err: false,
    pokemon: ''
  })
  const { status, pokemon, err } = state

  React.useEffect(() => {
    if (!pokemonName) {
      return
    }
    setState({...state, status: 'pending'})
    fetchPokemon(pokemonName)
      .then((res) => {
        console.log("RES", res)
        setState({
          pokemon: res,
          status: 'resolved',
          err: false
        })
      })
      .catch(err => {
        console.log('err', err)
        setState({
          pokemon: '',
          status: 'rejected',
          err: err
        })
      })
  }, [pokemonName])

  return (
    <div>
      {
        status === 'idle' && 'Submit a pokemon'
      }
      {
        status === 'rejected' &&
          <div role="alert">
            There was an error: <pre style={{whiteSpace: 'normal'}}>{err.message}</pre>
          </div>
      }
      {
        status === 'pending' &&
          <PokemonInfoFallback
            name={ pokemonName }
          />
      }
      {
        status === 'resolved' &&
          <PokemonDataView
            pokemon={ pokemon }
          />
      }
    </div>


  )
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm
        pokemonName={pokemonName}
        onSubmit={handleSubmit}
      />
      <hr />
      <div className="pokemon-info">

        <PokemonErrorBoundary
          onReset={ () => setPokemonName('') }
          resetKeys={ [pokemonName] }
        >
          <PokemonInfo
            pokemonName={pokemonName}
          />
        </PokemonErrorBoundary>
 
      </div>
    </div>
  )
}

export default App
