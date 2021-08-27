import React, { useState } from "react";
import { loadGapiInsideDOM } from '../functions/api'
import { gapi, loadAuth2 } from 'gapi-script'

let playlistId = 'PLGZwtzUnUPvi49duFUJApamEUzz2HnSg7'
let videoId = 'jhUHlpksKoc'

function Add() {
    const [playlist, setPlaylist] = useState('')
    const [videos, setVideos] = useState('')

    function insertVideoToPlaylist(videoId, playlistId) {
        
        // gapi.client.youtube.playlistItems.insert(
        //     {
        //         "part": [
        //             "snippet"
        //         ],
        //         "resource": {
        //             "snippet": {
        //                 "playlistId": playlistId,
        //                 "resourceId": {
        //                     "kind": "youtube#video",
        //                     "videoId": videoId
        //                 }
        //             }
        //         }
        //     }
        // )
        return { result: null }
    }

    const handleSubmit = async event => {
        event.preventDefault()
        // alert(`Submitting ${videos}`)
        
        // const gapi = await loadGapiInsideDOM()
        console.log(gapi)
        // insertVideoToPlaylist(videoId, playlistId)
    }

    return (
        <form onSubmit={handleSubmit} >
            <label>playlist id:</label>
            <input type="text" id="playlist" name="playlist" onChange={event => setPlaylist(event.target.value)} />
            <br />
            <textarea name="videos" rows="10" cols="100" onChange={event => setVideos(event.target.value)}></textarea>
            <br />
            <button type="submit">Submit</button>
        </form>
    )
}

export default Add