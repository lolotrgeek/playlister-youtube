import React from "react";

function Authorize() {
    return (
        <form method="POST">
            <label for="playlist">playlist id:</label>
            <input type="text" id="playlist" name="playlist" />
            <br />
            <textarea name="videos" rows="10" cols="100"></textarea>
            <br />
            <button type="submit">Submit</button>
        </form>
    )
}

export default Authorize