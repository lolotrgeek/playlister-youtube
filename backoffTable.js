function createBackOffTable(videoIds) {
    const ramp = 3 // amount by which to ramp timeout when threshold is reached
    let threshold = 3 // index at which to begin ramp
    let timeout = 100
    let max = 6400 // amount at which to cap ramp, set to -1 for infinite ramp

    return videoIds.map((videoId, i) => {
        if (max > 0 && timeout === max) return timeout
        if (i === threshold) {
            threshold += ramp
            timeout = timeout * 2
        }
        return timeout
    })
}


let test = ['foo', 'foo', 'foo', 'foo', 'foo', 'foo', 'foo', 'foo', 'foo', 'foo', 'foo', 'foo', 'foo', 'foo', 'foo', 'foo', 'foo', 'foo', 'foo', 'foo', 'foo', 'foo', 'foo', 'foo', 'foo']
let table = createBackOffTable(test)
console.log(table)