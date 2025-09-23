import React, { useState } from "react";
import Playlist from "./components/Playlist/Playlist";
import mockData from "../src/data/mockData";
import SearchBar from "./components/SearchBar/SearchBar";
import SearchResults from "./components/SearchResults/SearchResults";

function App() {
  const [searchResults, setSearchResults] = useState([]);
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [playlistName, setPlaylistName] = useState("My Playlist");

  const handleSearch = (term) => {
    // Filter mockData based on search term
    const filteredTracks = mockData.filter(track =>
        track.name.toLowerCase().includes(term.toLowerCase()) ||
        track.artist.toLowerCase().includes(term.toLowerCase()) ||
        track.album.toLowerCase().includes(term.toLowerCase())
    );
    setSearchResults(filteredTracks);
  };

  const handleNameChange = (name) => {
    setPlaylistName(name);
    console.log("Playlist name changed to: ", name);
  }
  const handleAdd = (track) => {
    if (!playlistTracks.find(savedTrack => savedTrack.id === track.id)) {
        setPlaylistTracks([...playlistTracks, track]);
    }
  };

  const handleRemove = (track) => {
    setPlaylistTracks(playlistTracks.filter(savedTrack => savedTrack.id !== track.id));
  }

  const handleSave = () => {
    console.log("Save playlist clicked");
  }

  return (
    <div>
      <h1>Jammming</h1>
      <SearchBar onSearch={handleSearch} />
      <div style={{display: 'flex'}}>
        <SearchResults searchResults={searchResults} onAdd={handleAdd} />
      <Playlist
        playlistName= {playlistName}
        playlistTracks={playlistTracks}
        onNameChange={handleNameChange}
        onRemove={handleRemove}
        onSave={handleSave}
      />
      </div>
    </div>
  );
}

export default App;