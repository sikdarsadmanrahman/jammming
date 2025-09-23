import React from "react";
import Tracklist from "../Tracklist/Tracklist";

function SearchResults({searchResults}) {

    return (
        <>
            <div>
                <h1>Your Results</h1>
                <Tracklist tracks={searchResults} />
            </div>
        </>
    )
}

export default SearchResults;