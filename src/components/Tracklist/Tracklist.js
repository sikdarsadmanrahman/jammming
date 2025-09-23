import React from "react";
import Track from "../Track/Track";

function Tracklist({tracks, onAdd, onRemove, isRemoval}) {
    const trackComponents = tracks.map(track => {
        return <Track key={track.id} track={track} onAdd={onAdd} onRemove={onRemove} isRemoval={isRemoval} />
    })

    return (
        <>
            <div>
                {trackComponents}
            </div>
        </>
    )
}

export default Tracklist;