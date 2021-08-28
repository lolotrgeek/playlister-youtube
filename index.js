const { addVideoToPlaylist, authorize } = require('./src/api')
const fs = require('fs')
const videoIds = require('./videos.json')

let playlist = 'PLGZwtzUnUPvi49duFUJApamEUzz2HnSg7'
const delay = retryCount => new Promise(resolve => setTimeout(resolve, 10 ** retryCount))


fs.readFile('client_secret.json', function processClientSecrets(err, content) {
    if (err) {
        console.log('Error loading client secret file: ' + err)
        return
    }
    authorize(JSON.parse(content), async auth => {
        return new Promise((resolve, reject) => {
            let results = []
            videoIds.forEach(videoId => {
                const getResource = async (retryCount = 0, lastError = null) => {
                    let reason
                    if (retryCount > 5) {
                        results.push({ id: videoId, status: "rejected", reason})
                        throw new Error(lastError)
                    }
                    try {
                        let result = await addVideoToPlaylist(auth, videoId, playlist)
                        results.push({ id: videoId, status: "fulfilled", result })
                    } catch (e) {
                        reason = e
                        await delay(retryCount)
                        return getResource(retryCount + 1, e)
                    }
                }
            })
            resolve(results)
        })
    })
})