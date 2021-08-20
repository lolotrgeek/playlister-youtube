const WS_URL = 'ws:///localhost:8888'
options = {
    connectionTimeout: 1000,
    // maxRetries: 10,
}
let ws = new ReconnectingWebSocket(WS_URL, [], options)

ws.onopen = () => {
    console.log(`Connected to ${WS_URL}`)
    ws.send("CLIENT")
}

function listen(callback) {
    ws.onmessage = async (message) => {
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