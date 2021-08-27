// SignIn.jsx
import React from 'react';
import { useGoogleAuth, useGoogleUser } from 'react-gapi-auth2';

const SignIn = ({ children }) => {
  const { googleAuth } = useGoogleAuth()
  const { currentUser } = useGoogleUser()

  if (googleAuth && googleAuth.isSignedIn && currentUser) {
    return (
      <>
        <p>Welcome user {currentUser.getBasicProfile().getName()}</p>
        <button onClick={() => googleAuth.signOut()}>Sign Out</button>
        <button onClick={() => googleAuth.disconnect()}>Revoke Access</button>
      </>
    )
  }
  
  return (
    <>
      <p>Click here to sign in:</p>
      <button onClick={() => googleAuth.signIn()}>Sign In</button>
    </>
  )
};

export default SignIn