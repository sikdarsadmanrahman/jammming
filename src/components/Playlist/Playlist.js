import React from "react";
import Tracklist from "../Tracklist/Tracklist";

function Playlist({playlistName, playlistTracks, onNameChange, onRemove, onSave}) {
    const handlePlaylistChange = (event) => {
        onNameChange(event.target.value);
    }
    return (
        <>
            <div>
                <input 
                type="text"
                onChange={handlePlaylistChange}
                value={playlistName}
                placeholder="Enter playlist name"
                />
            </div>
            <div>
                <Tracklist
                tracks={playlistTracks}
                onRemove={onRemove}
                isRemoval={true}
                ></Tracklist>
            </div>
            <div>
                <button onClick={onSave}>SAVE TO SPOTIFY</button>
            </div>
        </>
    )
}

export default Playlist;