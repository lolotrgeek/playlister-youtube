
let api_key = "AIzaSyCB3p3A2mcCaI1lVvB0H9HRzY529sH9lzI"
let base = "https://developers.google.com/apis-explorer/#p/youtube/v3/youtube.playlistItems.update?part=snippet"
let playlist = 'PLGZwtzUnUPvi49duFUJApamEUzz2HnSg7'

let token

const express = require('express')
const app = express()
const port = process.env.PORT || 80
const path = require('path')
const bodyParser = require('body-parser')
const { authorize, getNewToken, getCredentials, addVideoToPlaylist } = require("./auth")
const { json } = require('express')

let credentials
let client

app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', async (req, res) => {
    console.log('new get: ', req.query)
    if (req.query.code) {
        // successful OAuth2 post
        console.log('new token:', req.query.code)
        if (client && client.auth) {
            let updating = client.auth
            client.auth = await getNewToken(req.query.code, updating)
        }
    }

    if(client.auth) {
        res.sendFile(path.join(__dirname, '/add.html'))
    } else {
        res.sendFile(path.join(__dirname, '/index.html'))
    }
    
})

app.post('/', async (req, res) => {
    try {
        if (req.body.auth) {
            console.log(req.body.auth)
            credentials = await getCredentials()
            client = await authorize(credentials)
            if (typeof client.url === "string") res.redirect(client.url)
        }

        if (req.body.playlist && req.body.videos) {
            console.log('playlist:', req.body.playlist)
            let videoIds = req.body.videos.split(',')
            if (client.auth && client.auth.credentials) {
                let videosToAdd = videoIds.map(videoId => addVideoToPlaylist(client.auth, playlist, videoId))
                Promise.allSettled(videosToAdd).then(results => {
                    let filteredresults = results.filter(result => result.status === "fulfilled")
                    let output = `added ${results.length}/${videoIds.length} | errors: ${JSON.stringify(filteredresults)}`
                    res.send(output)
                })
            }
        }

        else {
            console.log('Unparsed post: ', req.body)
            res.sendFile(path.join(__dirname, '/add.html'))
        }
    } catch (err) {
        console.error(err)
        res.send(err)
    }

})

app.listen(port, () => {
    console.log(`Playlister app listening at http://localhost:${port}`)
})
