import React, { useEffect, useState } from "react"
import './App.css'

function App() {
  const [auth, setAuth] = useState(null)

  useEffect(() => {
    fetch("http://localhost/api")
      .then(res => {
        console.log(res)
        return res.json()
      })
      .then(data => {
        console.log(data)
        setAuth(data.message)
      })
      .catch(err => console.log(err))
  }, [])

  return (
    <div className="App">
      <p>{!auth ? "Loading..." : auth}</p>
    </div>
  )
}

export default App
