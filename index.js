
let api_key = "AIzaSyCB3p3A2mcCaI1lVvB0H9HRzY529sH9lzI"
let base = "https://developers.google.com/apis-explorer/#p/youtube/v3/youtube.playlistItems.update?part=snippet"
let playlist = 'PLGZwtzUnUPvi49duFUJApamEUzz2HnSg7'

const express = require('express')
const app = express()
const port = process.env.PORT || 80
const path = require('path')
const bodyParser = require('body-parser')
const { authorize, getToken, getNewToken, getCredentials, addVideoToPlaylist } = require("./auth")
const { json } = require('express')

let credentials
let token
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
    // attempt getting stored token
    try {
        if (!credentials) credentials = await getCredentials()
        token = await getToken()
    } catch (error) {
        res.sendFile(path.join(__dirname, '/index.html'))
    }
    if (token) {
        client = await authorize(credentials, token)
        if (client && client.auth) res.sendFile(path.join(__dirname, '/add.html'))
    }
    else {
        res.sendFile(path.join(__dirname, '/index.html'))
    }

})

app.post('/', async (req, res) => {
    try {
        if (req.body.auth) {
            console.log(req.body.auth)
            credentials = await getCredentials()
            client = await authorize(credentials, null)
            if (typeof client.url === "string") res.redirect(client.url)
        }

        if (req.body.playlist && req.body.videos) {
            console.log('playlist:', req.body.playlist)
            let videoIds = req.body.videos.trim().replace(/(\r\n|\n|\r)/gm, "").split(',')
            console.log(videoIds)
            if (client.auth && client.auth.credentials) {
                let videosToAdd = videoIds.filter(videoId => typeof videoId === 'string' && videoId.length > 0).map(videoId => addVideoToPlaylist(client.auth, playlist, videoId))
                Promise.allSettled(videosToAdd).then(results => {
                    let succeeded = results.filter(result => result.status === "fulfilled")
                    let failed = results.filter(result => result.status === "rejected")
                    let retries = failed.filter(fail => fail.reason.code === 500).map(fail =>  addVideoToPlaylist(client.auth, playlist, fail.reason.videoId))
                    Promise.allSettled(retries).then(retried => {
                        succeeded = [...succeeded, retried.filter(result => result.status === "fulfilled")]
                        failed = retried.filter(result => result.status === "rejected")
                        let output = `added ${succeeded.length}/${videoIds.length} <br /> videos: ${videoIds} <br /> errors: ${failed}`
                        res.send(output)
                    })

                })
            }
        }

        else {
            console.log('Unparsed post: ', req.body)
            if (token && client && client.auth) res.sendFile(path.join(__dirname, '/add.html'))
            else res.sendFile(path.join(__dirname, '/index.html'))

        }
    } catch (err) {
        console.error(err)
        res.send(err)
    }

})

app.listen(port, () => {
    console.log(`Playlister app listening at http://localhost:${port}`)
})
