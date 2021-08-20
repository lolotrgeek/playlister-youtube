const WebSocket = require("ws")

const WS_PORT = 8888
const HTTP_PORT = 8000

const wsServer = new WebSocket.Server({ port: WS_PORT }, () => console.log(`WS is listening at ${WS_PORT}`))

let clients = []

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
function addClient(ws, data) {
    if (!ws.name) {
        let obj = getObject(data)
        ws.name = obj && obj.name ? obj.name : data
        clients.push(ws)
        console.log(` CLIENT "${ws.name}" CONNECTED`)
    }
}

function parseMessage(ws, data, callback) {
    let message = data.toString()
    if (typeof message === 'string') {
        addClient(ws, message)
        let msg = callback(message)
        reply(ws, msg)
    }
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
                ws.send(typeof data === 'object' ? JSON.stringify(data) : data )
            }
        } else {
            console.log(` CLIENT ${i} DISCONNECTED`)
            clients.splice(i, 1)
        }
    })
}

function getObject(string) {
    try {
      return JSON.parse(string)
    } catch (error) {
      return false
    }
  }


module.exports = { listen, reply, broadcast, send }