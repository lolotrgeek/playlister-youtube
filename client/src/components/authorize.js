import React from "react";

function Authorize() {
    return (
        <form method="POST">
            <input hidden type="text" name="auth" value="true" />
            <button type="submit">Authorize</button>
        </form>
    )
}

export default Authorize