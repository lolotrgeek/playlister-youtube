const WS_URL = location.origin.replace(/^http/, 'ws')
options = {
    connectionTimeout: 1000,
    // maxRetries: 10,
}
let ws = new ReconnectingWebSocket(WS_URL, [], options)

ws.onopen = () => {
    console.log(`Connected to ${WS_URL}`)
    send({name: "CLIENT"})
}

function send(message) {
    ws.send(JSON.stringify(message))
}

function listen(callback) {
    ws.onmessage = async (message) => {
        console.log(decode(message.data))
        if (typeof message.data === 'string') {
            callback(decode(message.data))
        }
    }
    ws.onerror = () => {
        console.log(`Error ${WS_URL}`)
        callback("CLOSED")
    }
    
    ws.onclose = () => {
        console.log(`Disconnected from ${WS_URL}`)
        callback("CLOSED")
    }    
}

function decode(data) {
    try {
        return JSON.parse(data)
    } catch (error) {
        return data
    }
}