let clients = []

/**
 * 
 * @param {function} callback - do something with incoming message, 
 * returning a string from the callback will send that string as a reply to sender
 */
function listen(server, callback) {
    // send...
    server.on("connection", (ws, req) => {
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
                // console.log('Sending:',  data)
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

module.exports = {listen, send, reply}