import { useState } from 'react'

import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1>Weather Aware To-Do</h1>
      <p>Manage your tasks based on the weather conditions.</p>
      <ul>
        <li>Check the weather forecast.</li>
        <li>Plan your tasks accordingly.</li>
        <li>Stay productive regardless of the weather.</li>
      </ul>
      <p>Happy planning!</p>

      
    </>
  )
}

export default App
