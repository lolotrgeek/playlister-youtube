const express = require('express')
const app = express()
const path = require('path')
const bodyParser = require('body-parser')
const { Server } = require('ws')

const { Authorize, getToken, getNewToken, getCredentials, newClient, getAuthUrl } = require("./server/api")
const { addVideos, parseVideoIds } = require('./server/app')
const { listen, send } = require('./server/sockets')

const port = process.env.PORT || 80

let credentials
let client
let status = false // false = not authenticated, true = authenticated
let error

let playlist = 'PLGZwtzUnUPvi49duFUJApamEUzz2HnSg7'

function Authorize(code) {
    try {
        credentials = await getCredentials()
        client = await newClient(credentials)
        let token = code ? getNewToken(code, client) : await getToken(client)
        if (token) {
            client.credentials = token
            res.json(client)
        } else {
            let authURL = getAuthUrl()
            res.redirect(authURL)
        }
    } catch (err) {
        console.log(err)
    }
}

app.use(bodyParser.urlencoded({ extended: true }))
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "client/build", "index.html"))
    if (req.query.code)  Authorize(req.query.code)
    else console.log("Unknown Request: ", req.query)
})

app.get("/api", (req, res) => res.json({ message: "Hello from server!" }))
app.post("/", async (req, res) => {
    if(req.body.auth) Authorize()
    else if(req.body.playlist && req.body.videos) addVideos(client, req.body.playlist, parseVideoIds(req.body.videos))
})

const server = app.listen(port, () => console.log(`Playlister app listening at http://localhost:${port}`))

const wsServer = new Server({ server })
listen(wsServer, message => {
    console.log(message)
    if (message && message.name === "CLIENT") send("CLIENT", { status })
})
// TESTING WS
// setInterval(() => {
//     send("CLIENT", {test: "test!"})
// }, 1000)
