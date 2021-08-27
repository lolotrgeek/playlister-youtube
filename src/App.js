import React, { useEffect, useState } from "react"
import { GApiProvider } from 'react-gapi-auth2'
import SignIn from "./components/Signin"
import Add from "./components/Add"
import './App.css'

let discoveryUrl = 'https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest'
let SCOPE = 'https://www.googleapis.com/auth/youtube'

const clientConfig = {
  'apiKey': 'AIzaSyCB3p3A2mcCaI1lVvB0H9HRzY529sH9lzI',
  'clientId': '638260735569-crj2nbi8t3uimh1g7lcaefrc597gqg2u.apps.googleusercontent.com',
  'discoveryDocs': [discoveryUrl],
  'scope': SCOPE
}

function App() {

  useEffect(() => {


  }, [])

  return (
    <GApiProvider clientConfig={clientConfig}>
      <div className="App">
        <div id="auth-status">
          <SignIn />

        </div>
        <hr></hr>
        <Add />
      </div>
    </GApiProvider>

  )
}

export default App
