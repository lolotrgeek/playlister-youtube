import React, {useState} from "react";

function Add() {
    const [playlist, setPlaylist] = useState('')
    const [videos, setVideos] = useState('')

    function insertVideoToPlaylist(videoId, playlistId) {
        // return gapi.client.youtube.playlistItems.insert(
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

    const handleSubmit = (evt) => {
        evt.preventDefault();
        alert(`Submitting ${videos}`)
    }

    return (
        <form onSubmit={handleSubmit} >
            <label for="playlist">playlist id:</label>
            <input type="text" id="playlist" name="playlist" onChange={event => setPlaylist(event.target.value)} />
            <br />
            <textarea name="videos" rows="10" cols="100" onChange={event => setVideos(event.target.value)}></textarea>
            <br />
            <button type="submit">Submit</button>
        </form>
    )
}

export default Add