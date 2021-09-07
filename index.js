const { addVideoToPlaylist, authorize } = require('./src/api')
const fs = require('fs')
// const videoIds = require('./videos.json')
const videoIds = require('./test.json')
const { resolve } = require('path')
const REMAINING_PATH = './remaining'
const debug = true

const retrySchedule = [0,1,10,100,1000,10000]

// TODO: dashboard timer until complete

let playlist = 'PLGZwtzUnUPvgEjgnJNadwXveFqgz6IQl3'
const delay = retryCount => new Promise(resolve => setTimeout(resolve, 10 ** retryCount))

/**
 * Add videos using authorized client with exponential backoff
 * @param {*} client 
 * @source https://www.bayanbennett.com/posts/retrying-and-exponential-backoff-with-promises/  
 */
function AddVideos(client) {
    if (debug) console.debug(videoIds)
    let videosToAdd = videoIds.map(videoId => {
        return new Promise((resolve, reject) => {
            const getResource = async (retryCount = 0, lastError = null) => {
                let status = { videoId, retryCount, code: lastError ? lastError.code : null, errors: lastError ? lastError.errors : null }
                if (debug) console.debug('status: ', status)
                if (retryCount > 5) reject({ videoId, code: lastError.code, errors: lastError.errors })
                try {
                    let result = await addVideoToPlaylist(client, playlist, videoId)
                    resolve({ videoId })
                } catch (e) {
                    await delay(retryCount)
                    return getResource(retryCount + 1, e)
                }
            }
            getResource()
        })
    })
    return Promise.allSettled(videosToAdd)
}

function AddTest(client) {
    return new Promise(async (resolve, reject) => {
        let results = []
        let videoId = videoIds[0]
        try {
            let result = await addVideoToPlaylist(client, playlist, videoId)
            results[0] = { id: videoId, status: "fulfilled" }
            resolve(results)
        } catch (error) {
            results[0] = { id: videoId, status: "rejected", reason: error }
            reject(results)
        }

    })
}

function storeRemaining(results) {
    let remaining = results.filter(result => result.status === "rejected")
    if (remaining.length > 0) {
        fs.writeFile(REMAINING_PATH + '_' + Date.now() + '.json', JSON.stringify(remaining), (err) => {
            if (err) throw err
            console.log('Remaining stored to ' + REMAINING_PATH)
        })
    }
}


function run() {
    return new Promise((resolve, reject) => {
        fs.readFile('client_secret.json', function processClientSecrets(err, content) {
            if (err) {
                console.log('Error loading client secret file: ' + err)
                reject(err)
            }
            authorize(JSON.parse(content), async client => {
                try {
                    // let results = await AddVideos(client)
                    let results = await AddVideos(client)
                    resolve(results)
                } catch (error) {
                    reject(error)
                }
            })
        })
    })
}

run().then(results => {
    console.log(results)
    storeRemaining(results)
}).catch(err => console.log(err))