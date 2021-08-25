const { addVideoToPlaylist } = require("./auth")

const parseVideoIds = videos => videos.trim().replace(/(\r\n|\n|\r)/gm, "").split(',').filter(videoId => typeof videoId === 'string' && videoId.length > 0)


function addVideosToPlaylist(client, playlist, videoIds, interval) {
    return new Promise(async (resolve, reject) => {
        console.log('Adding:', videoIds, "to", playlist)

        interval = interval ? interval: 1000
        let max_retries = 10
        let count = 0
        let videosToAdd = videoIds.map(videoId => addVideoToPlaylist(client.auth, playlist, videoId, interval))

        try {
            let results = await Promise.allSettled(videosToAdd)
            let succeeded = results.filter(result => result.status === "fulfilled")
            let failed = results.filter(result => result.status === "rejected")        
            console.log({ added: `${succeeded.length}/${videosToAdd.length}`, videos: videoIds, errors: failed })
            // send("CLIENT", { added: `${succeeded.length}/${videosToAdd.length}`, videos: videoIds, errors: JSON.stringify(failed) })

            if(failed.length === 0 && succeeded.length === videosToAdd.length) {
                resolve(results) 
                return
            }
            if(count >= max_retries) {
                resolve(results)
                return
            }
            if(failed.length > 0) {
                let retryVideos = failed.map(failure => failure.reason.videoId)
                interval = interval * 2
                count++
                await addVideoToPlaylist(client.auth, playlist, retryVideos, interval)
                resolve(results)
            }
        } catch (error) {
            reject(error)
        }
    })
}


module.exports = {addVideosToPlaylist, parseVideoIds}