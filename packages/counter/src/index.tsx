import React from 'react'
import { createRoot } from 'react-dom/client'

import './index.css'

const App: React.FC = () => {
  const [counter, setCounter] = React.useState(0)

  return (
    <div className="App">
      <div>
        <h2>Счетчик:</h2>
        <h1>{counter}</h1>
        <button className="minus" onClick={() => setCounter((prev) => --prev)}>
          - Минус
        </button>
        <button className="plus" onClick={() => setCounter((prev) => ++prev)}>
          Плюс +
        </button>
      </div>
    </div>
  )
}

const rootElement = document.getElementById('root')
const root = createRoot(rootElement!)

root.render(<App />)
