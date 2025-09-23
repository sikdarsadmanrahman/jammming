import React, {useState} from "react";

function Track({track, onAdd, onRemove, isRemoval}) {
    const name = track.name;
    const artist = track.artist;
    const album = track.album;

    const addTrack = () => {
        if(onAdd) {
            onAdd(track);
        } 
    };

    const removeTrack = () => {
        if(onRemove) {
            onRemove(track);
        }
    };

    const renderAction = () => {
        if (isRemoval) {
            return <button onClick={removeTrack}>-</button>;
        } else {
            return <button onClick={addTrack}>+</button>;
        }
    };
    return(
        <>
            <div>
                {name}
                <div>
                    {artist} | {album}
                </div>
                <div>
                    {renderAction()}
                    {/* If isRemoval is true, show '-' button, else show '+' button */}
                    {/* {isRemoval ? <button onClick={removeTrack}>-</button> : <button onClick={addTrack}>+</button>} */}
                    {/* For testing without functionality */}
                    {/* <button>+</button> */}
                    {/*<button>-</button> */}
                </div>
            </div>
        </>
    )
}
export default Track;