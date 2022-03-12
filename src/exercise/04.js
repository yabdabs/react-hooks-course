// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import * as React from 'react'
import { useLocalStorageState } from '../utils'


function Board({ selectSquare, currentSquares, status, restart }) {
  
  // I added this for ex1 local storage
  // const squaresLS = () => {
  //   const squares = window.localStorage.getItem('squares')
  //   console.log(111, squares)
  //   if (!squares) {
  //     return Array(9).fill(null)
  //   }
  //   return JSON.parse(squares)
  // }

  // 🐨 squares is the state for this component. Add useState for squares
  // const [squares, setSquares] = React.useState(squaresLS)
  
  // I added this for ex1 local storage
  // React.useEffect(() => {
  //   window.localStorage.setItem('squares', JSON.stringify(squares))
  // }, [squares])
  // console.log(2, squares)

  // exercise 2 - useLocalStorageState custom hook. Comment code from exercise 1
  // const [squares, setSquares] = useLocalStorageState('squares', Array(9).fill(null))

  const renderSquare = (i) => {
    return (
      <button
        className="square"
        onClick={() => selectSquare(i)}
      >
        { currentSquares[i] }
      </button>
    )
  }

  return (
    <div>
      <div className="status">{status}</div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
      <button className="restart" onClick={restart}>
        restart
      </button>
    </div>
  )
}

const HistoryButtons = ({ squares, step, setStep }) => {

  const handleHistoryClick = (squareArray, step) => {
    setStep(step)
  }

  return (
    <ol>
      {
        squares.map((item, key) => {
          const text = key === 0 ? 'Go to game start' : `Go to move #${key}`
          const disabled = key === step
          return (
            <li key={ key }>
              <button
                onClick={() => handleHistoryClick(item, key) }
                disabled={ disabled }
              >
                { text }
              </button>
            </li>
          )
        })
      }
    </ol>
  )

}

const Game = () => {

  // exercise 3 - history
  const [step, setStep] = useLocalStorageState('step', 0)
  const [squares, setSquares] = useLocalStorageState('squares', [Array(9).fill(null)])
  const currentSquares = squares[step]

  // eslint-disable-next-line no-unused-vars
  /** Filter boolean trick - tacit(implied) or point free style
  * Same as squares.filter((square) => Boolean(square)) we are implying that the filter item is being passed to Boolean
  */
  const calculateNextValue = (squares) => squares.filter(Boolean).length % 2 === 0 ? 'X' : 'O'
  // eslint-disable-next-line no-unused-vars
  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ]
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i]
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a]
      }
    }
    return null
  }
  
  // eslint-disable-next-line no-unused-vars
  const calculateStatus = (winner, squares, nextValue) => {
    return winner
      ? `Winner: ${winner}`
      : squares.every(Boolean)
      ? `Scratch: Cat's game`
      : `Next player: ${nextValue}`
  }

  const selectSquare = (square) => {
    if (winner || currentSquares[square]) return

    const newHistory = squares.slice(0, step + 1)
    const squaresCopy = [...currentSquares]

    squaresCopy[square] = nextValue
    setSquares([...newHistory, squaresCopy])
    setStep(newHistory.length)
  }


  const restart = () => {
    setSquares([Array(9).fill(null)])
    setStep(0)
  }

  const nextValue = calculateNextValue(currentSquares)
  const winner = calculateWinner(currentSquares)
  const status = calculateStatus(winner, currentSquares, nextValue)

  return (
    <div className="game">
      <div className="game-board">
        <Board
          selectSquare={ selectSquare }
          currentSquares= { currentSquares }
          status={ status }
          restart={ restart }
        />
      </div>

      <div>
        <HistoryButtons
          squares={ squares }
          step={ step }
          setStep={ setStep }
        />
      </div>
    </div>
  )
}


function App() {
  return <Game />
}

export default App
