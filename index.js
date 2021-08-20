
let api_key = "AIzaSyCB3p3A2mcCaI1lVvB0H9HRzY529sH9lzI"
let base = "https://developers.google.com/apis-explorer/#p/youtube/v3/youtube.playlistItems.update?part=snippet"
let playlist = 'PLGZwtzUnUPvi49duFUJApamEUzz2HnSg7'

const express = require('express')
const ejs = require('ejs')
const app = express()
const port = process.env.PORT || 80
const path = require('path')
const bodyParser = require('body-parser')
// const { send } = require('./src/router')
const { authorize, getToken, getNewToken, getCredentials, addVideoToPlaylist } = require("./src/auth")
const { Server } = require('ws')

let max_retries = 3

let clients = []

let credentials
let token
let client
let status = false // false = not authenticated, true = authenticated
let error

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', async (req, res) => {
    console.log('new get: ', req.query)
    if (req.query.code) {
        // successful OAuth2 post
        console.log('new token:', req.query.code)
        if (client && client.auth) {
            try {
                let updating = client.auth
                client.auth = await getNewToken(req.query.code, updating)
            } catch (err) {
                console.log(error)
                let error = err
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
        if (client && client.auth) status = true
    }
    res.render('pages/index', { client, status, error })
})

app.get('/about', (req, res) => {
    res.render('pages/about')
})

app.get("/reconnecting-websocket.js", (req, res) => res.sendFile(path.resolve(__dirname, "node_modules/reconnecting-websocket/dist/reconnecting-websocket-iife.js")))
app.get("/sockets.js", (req, res) => res.sendFile(path.resolve(__dirname, "src/sockets.js")))

app.post('/', async (req, res) => {
    try {
        if (req.body.auth) {
            console.log(req.body.auth)
            credentials = await getCredentials()
            client = await authorize(credentials, null)
            if (typeof client.url === "string") res.redirect(client.url)
        }

        if (req.body.playlist && req.body.videos) {
            res.render('pages/index', { client, status, error })
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
                        let output = {added: `${succeeded.length}/${videoIds.length}`,  videos: videoIds, errors: JSON.stringify(failed)}
                        console.log(output)
                        send("CLIENT", output)
                    })
                })
            }
        }

        else {
            console.log('Unparsed post: ', req.body)
            if (token && client && client.auth) status = true
            else status = false
            res.render('pages/index', { client, status, error })
        }
    } catch (err) {
        console.error(err)
        error = err
        res.render('pages/index', { client, status, error })

    }
})

const server = app.listen(port, () => {
    console.log(`Playlister app listening at http://localhost:${port}`)
})

const wsServer = new Server({ server })
listen(message => {
    console.log(message)
})
/**
 * 
 * @param {function} callback - do something with incoming message, 
 * returning a string from the callback will send that string as a reply to sender
 */
 function listen(callback) {
    // send...
    wsServer.on("connection", (ws, req) => {
        ws.on("message", data => parseMessage(ws, data, callback))
        ws.on("error", error => console.log(` WebSocket error observed: ${error}`))
        // TODO: implement closed retries?
        ws.on("close", reason => console.log(` WebSocket Closed ${reason}`))
    })
}

/**
 * Give ws client a name then add to client list
 * @param {*} ws 
 */
function addClient(ws, message) {
    if (!ws.name) {
        ws.name = message && message.name ? message.name : message
        clients.push(ws)
        console.log(` CLIENT "${ws.name}" CONNECTED`)
    }
}

function parseMessage(ws, data, callback) {
    let message
    if (Buffer.isBuffer(data)) message = decode(data)
    // console.log(message)
    addClient(ws, message)
    let msg = callback(message)
    reply(ws, "Welcome")

}

wsServer.broadcast = function broadcast(msg) {
    wsServer.clients.forEach(function each(client) {
        client.send(msg)
    })
}

function broadcast(msg) {
    wsServer.broadcast(msg)
}

function reply(ws, data) {
    if (typeof data === 'string') {
        ws.send(data)
    }
}

/**
 * 
 * @param {string} client name of client to send to
 * @param {*} data 
 */
function send(client, data) {
    clients.forEach((ws, i) => {
        if (clients[i] == ws && ws.readyState === 1) {
            if (ws.name === client) {
                console.log(` Sending: ${data}`)
                ws.send(typeof data === 'object' ? JSON.stringify(data) : data)
            }
        } else {
            console.log(` CLIENT ${i} DISCONNECTED`)
            clients.splice(i, 1)
        }
    })
}

function decode(data) {
    try {
        return JSON.parse(data.toString('utf-8'))
    } catch (error) {
        return data.toString('utf-8')
    }
}

