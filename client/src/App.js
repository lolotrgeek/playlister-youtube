import React, { useEffect, useState } from "react"
import './App.css'

function App() {
  const [data, setData] = useState(null)

  useEffect(() => {
    fetch("http://localhost/api")
      .then(res => {
        console.log(res)
        return res.json()
      })
      .then(data => {
        console.log(data)
        setData(data.message)
      })
      .catch(err => console.log(err))
  }, [])
  return (
    <div className="App">
      <p>{!data ? "Loading..." : data}</p>
    </div>
  )
}

export default App
