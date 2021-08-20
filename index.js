
let api_key = "AIzaSyCB3p3A2mcCaI1lVvB0H9HRzY529sH9lzI"
let base = "https://developers.google.com/apis-explorer/#p/youtube/v3/youtube.playlistItems.update?part=snippet"
let playlist = 'PLGZwtzUnUPvi49duFUJApamEUzz2HnSg7'

const express = require('express')
const app = express()
const port = process.env.PORT || 80
const path = require('path')
const bodyParser = require('body-parser')
const { authorize, getToken, getNewToken, getCredentials, addVideoToPlaylist } = require("./auth")

let max_retries = 3

let credentials
let token
let client

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', async (req, res) => {
    let error
    let status = false
    console.log('new get: ', req.query)
    if (req.query.code) {
        // successful OAuth2 post
        console.log('new token:', req.query.code)
        if (client && client.auth) {
            try {
                let updating = client.auth
                client.auth = await getNewToken(req.query.code, updating)
            } catch (error) {
                console.log(error)
            }
        }
    }
    // attempt getting stored token
    try {
        if (!credentials) credentials = await getCredentials()
        token = await getToken()
    } catch (err) {
        error = err
    }
    if (token) {
        client = await authorize(credentials, token)
        if(client && client.auth) status = true
    }
    res.render('pages/index', { client, status, error })
})

app.get('/about', (req, res) => {
    res.render('pages/about')
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
            let videoIds = req.body.videos.trim().replace(/(\r\n|\n|\r)/gm, "").split(',').filter(videoId => typeof videoId === 'string' && videoId.length > 0)
            console.log(videoIds)
            if (client.auth && client.auth.credentials) {
                let videosToAdd = videoIds.map(videoId => addVideoToPlaylist(client.auth, playlist, videoId))
                Promise.allSettled(videosToAdd).then(results => {
                    let succeeded = results.filter(result => result.status === "fulfilled")
                    let failed = results.filter(result => result.status === "rejected")

                    const Retrier = () => new Promise((resolve, reject) => {
                        let count = 0
                        let interval = 1000
                        let retries = failed.map(fail => addVideoToPlaylist(client.auth, playlist, fail.reason.videoId, interval))
                        let retrying = setInterval(() => {
                            if (count === max_retries) { clearInterval(retrying); resolve({ succeeded, failed, count }) }
                            if (failed.length === 0) { clearInterval(retrying); resolve({ succeeded, failed, count }) }
                            if (retries.length === 0) { clearInterval(retrying); resolve({ succeeded, failed, count }) }
                            console.log(`Retry ${count}, video count: ${retries.length}, interval: ${interval} `)
                            Promise.allSettled(retries).then(retried => {
                                console.log('retried: ', retried)
                                retried.forEach((result, i) => {
                                    if (result.status === "fulfilled") {
                                        succeeded.push(result)
                                        retries.splice(i, 1)
                                    }
                                })
                                failed = retried.filter(result => result.status === "rejected")
                            })
                            count++
                            interval = interval * 2
                        }, 500)
                    })

                    Retrier().then(result => {
                        // todo: show each video request working
                        let output = `added ${succeeded.length}/${videoIds.length} <br /> videos: ${videoIds} <br /> errors: ${JSON.stringify(failed)}`
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
