import React, { useState, useEffect } from 'react'
import { gapi, loadAuth2 } from 'gapi-script'

import { UserCard } from './UserCard'
import './GoogleLogin.css'

// FIX: https://github.com/partnerhero/gapi-script/issues/14

let discoveryUrl = 'https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest'
let SCOPE = 'https://www.googleapis.com/auth/youtube'

const clientConfig = {
    apiKey: 'AIzaSyCB3p3A2mcCaI1lVvB0H9HRzY529sH9lzI',
    clientId: '638260735569-crj2nbi8t3uimh1g7lcaefrc597gqg2u.apps.googleusercontent.com',
    discoveryDocs: [discoveryUrl],
    scope: SCOPE
}

export const GoogleLogin = () => {
    const [user, setUser] = useState(null)

    useEffect(() => {
        const setAuth2 = async () => {
            const auth2 = await loadAuth2(gapi, clientConfig.clientId, SCOPE)
            if (auth2.isSignedIn.get()) {
                updateUser(auth2.currentUser.get())
            } else {
                attachSignin(document.getElementById('customBtn'), auth2)
            }
            console.log(auth2)
            loadClient()
        }
        setAuth2()
    }, [])

    useEffect(() => {
        if (!user) {
            const setAuth2 = async () => {
                const auth2 = await loadAuth2(gapi, clientConfig.clientId, SCOPE)
                attachSignin(document.getElementById('customBtn'), auth2)
                console.log(auth2)
                loadClient()
            }
            setAuth2()
        }
    }, [user])

    const updateUser = (currentUser) => {
        const name = currentUser.getBasicProfile().getName()
        const profileImg = currentUser.getBasicProfile().getImageUrl()
        setUser({
            name: name,
            profileImg: profileImg,
        })
    }

    const attachSignin = (element, auth2) => {
        auth2.attachClickHandler(element, { },
            (googleUser) => {
                updateUser(googleUser)
            }, (error) => {
                console.log(JSON.stringify(error))
            })
    }
    const loadClient = () => {
        return gapi.load('client:auth2', async () => {
            await gapi.client.init(clientConfig)
            console.log(gapi)
        })
    }

    const signOut = () => {
        const auth2 = gapi.auth2.getAuthInstance()
        auth2.signOut().then(() => {
            setUser(null)
            console.log('User signed out.')
        })
    }

    if (user) {
        console.log(gapi)
        return (
            <div className="container">
                <UserCard user={user} />
                <div id="" className="btn logout" onClick={signOut}>
                    Logout
                </div>
            </div>
        )
    }

    return (
        <div className="container">
            <div id="customBtn" className="btn login">
                Login
            </div>
        </div>
    )
}