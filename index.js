const express = require('express')
const app = express()
const path = require('path')
const bodyParser = require('body-parser')
const { Server } = require('ws')

const { authorize, getToken, getNewToken, getCredentials } = require("./server/auth")
const { addVideos, parseVideoIds } = require('./server/app')
const {listen, send} = require('./server/sockets')

const port = process.env.PORT || 80

let credentials
let token
let client
let status = false // false = not authenticated, true = authenticated
let error

let playlist = 'PLGZwtzUnUPvi49duFUJApamEUzz2HnSg7'

app.use(bodyParser.urlencoded({ extended: true }))

app.get("/", (req, res) => res.sendFile(path.join(__dirname, "public", "index.html")))
app.get("/api", (req, res) => res.json({ message: "Hello from server!" }))

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
