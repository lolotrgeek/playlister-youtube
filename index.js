
let api_key = "AIzaSyCB3p3A2mcCaI1lVvB0H9HRzY529sH9lzI"
let base = "https://developers.google.com/apis-explorer/#p/youtube/v3/youtube.playlistItems.update?part=snippet"
// let list_id = 'PLGZwtzUnUPvi49duFUJApamEUzz2HnSg7'

let token

const express = require('express')
const app = express()
const port = process.env.PORT || 80
const path = require('path')
const bodyParser = require('body-parser')
const { authorize, getChannel, storeToken, getNewToken, getCredentials } = require("./auth")

let credentials
let client

app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', async (req, res) => {
    console.log('new get: ', req.query)
    if (req.query.code) {
        // successful OAuth2 post
        console.log('new token:', req.query.code)
        if (client && client.auth) {
            let updating = client
            updating.auth.credentials = req.query.code
            client.auth = await getNewToken(updating.auth)
        }
    }

    res.sendFile(path.join(__dirname, '/index.html'))
})

app.post('/', async (req, res) => {
    try {
        if (req.body.auth) {
            console.log(req.body.auth)
            credentials = await getCredentials()
            client = await authorize(credentials)
            if (typeof client.url === "string") res.redirect(client.url)
        }



        if (req.body.playlist) {
            console.log(req.body.playlist)
            if (client.auth && client.auth.credentials) {
                let channel_info = await getChannel(client.auth)
                res.send(JSON.stringify(channel_info))
            }
        }
        else {
            console.log('Unparsed submission post: ', req.body)
        }
    } catch (err) {
        console.error(err)
    }

})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
