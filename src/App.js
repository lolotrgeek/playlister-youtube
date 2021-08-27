import React from "react"
import { GoogleLogin } from './components/GoogleLogin';
import Add from "./components/Add"
import './App.css'


function App() {
  return (

      <div className="App">
        <div id="auth-status">
          <GoogleLogin />

        </div>
        <hr></hr>
        <Add />
      </div>
  )
}

export default App
