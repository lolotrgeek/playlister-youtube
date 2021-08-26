const { addVideoToPlaylist } = require("./api")

const parseVideoIds = videos => videos.trim().replace(/(\r\n|\n|\r)/gm, "").split(',').filter(videoId => typeof videoId === 'string' && videoId.length > 0)

function addVideos(client, playlist, videoIds, interval) {
    return new Promise(async (resolve, reject) => {
        console.log('[PLAYLIST] Adding: ', videoIds)

        interval = interval ? interval : 1000
        let max_retries = 10
        let count = 0
        let videosToAdd = videoIds.map(videoId => {
            addVideoToPlaylist(client.auth, playlist, videoId, interval)
        })

        try {
            let results = await Promise.allSettled(videosToAdd)
            let succeeded = results.filter(result => result.status === "fulfilled")
            let failed = results.filter(result => result.status === "rejected")
            console.log(`[PLAYLIST] added: ${succeeded.length}/${videosToAdd.length}`, { videos: videoIds, errors: failed.map(failure => failure.reason) })

            if (failed.length === 0 && succeeded.length === videosToAdd.length) {
                resolve(results)
                return
            }
            if (count >= max_retries) {
                resolve(results)
                return
            }
            if (failed.length > 0) {
                try {
                    console.log('[PLAYLIST] failed: ', failed)
                    let retryVideos = failed.map(failure => failure.reason.videoId)
                    console.log('[PLAYLIST] retrying: ', retryVideos)
                    interval = interval * 2
                    count++
                    await addVideos(client.auth, playlist, retryVideos, interval)
                    resolve(results)

                } catch (error) {
                    reject(error)
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}


module.exports = { addVideos, parseVideoIds }