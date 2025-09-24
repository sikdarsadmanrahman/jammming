const { expect } = require('chai');

// Mock the browser APIs since we're in Node.js
global.window = {
    location: { href: 'http://localhost:3000' },
    history: { pushState: () => {} },
    setTimeout: setTimeout
};
global.fetch = () => Promise.resolve({ 
    ok: true, 
    json: () => ({id: "user123"}) 
});

// Import Spotify with ES6 import converted to CommonJS
const SpotifyModule = require('./Spotify');
const Spotify = SpotifyModule.default;

describe('Spotify savePlaylist', () => {
    
    it('should create a new playlist', async () => {
        // Test data - example playlist and tracks
        const playlistName = "My Test Playlist";
        const exampleTracks = [
            {
                id: "1",
                name: "Test Song 1", 
                artist: "Test Artist 1",
                album: "Test Album 1",
                uri: "spotify:track:1"
            },
            {
                id: "2",
                name: "Test Song 2",
                artist: "Test Artist 2", 
                album: "Test Album 2",
                uri: "spotify:track:2"
            }
        ];

        // Call the function (this will fail since we haven't written it yet!)
        const result = await Spotify.savePlaylist(playlistName, exampleTracks);
        
        // What we expect to happen
        expect(result).equal("Playlist saved successfully");
    });

    // TODO: You write the next tests yourself!
    // - What happens with empty playlist name?
    it('should handle empty playlist name', async () => {
        const playlistName = "";
        const exampleTracks = [
            {
                id: "1",
                name: "Test Song 1", 
                artist: "Test Artist 1",
                album: "Test Album 1",
                uri: "spotify:track:1"
            },
            {
                id: "2",
                name: "Test Song 2",
                artist: "Test Artist 2",
                album: "Test Album 2",
                uri: "spotify:track:2"
            }
        ];
        const result = await Spotify.savePlaylist(playlistName, exampleTracks);
        expect(result).equal("Playlist name cannot be empty");
    });

    // - What happens with empty tracks array?
    it('Should handle with empty track array', async () => {
        const playlistName = "null track testing";
        const exampleTracks = [];
        const result = await Spotify.savePlaylist(playlistName, exampleTracks);
        expect(result).equal("It's an empty playlist");

    });

    it('Should create playlist and add tracks via api', async () => {
        // Set up the mock window object with access token
        global.window = {
            location: { href: 'http://localhost:3000#access_token=BQC4YXlvbmU&expires_in=3600' },
            history: { pushState: () => {} },
            setTimeout: setTimeout
        };

        // Example test for creating playlist and adding tracks via API
        const playlistName = "My Test Playlist";
        const exampleTracks = [
            {
                id: "1",
                name: "Test Song 1", 
                artist: "Test Artist 1",
                album: "Test Album 1",
                uri: "spotify:track:1"
            }
        ];

        global.fetch = (url) => {
            if(url.includes('/me')) {
                return Promise.resolve({
                    ok: true,
                    json: () => ({id: "user123"})
                });
            }
            if(url.includes('/playlists') && !url.includes('/tracks')) {
                return Promise.resolve({
                    ok: true,
                    json: () => ({id: "playlist123"})
                });
            }
            if(url.includes('/tracks')) {
                return Promise.resolve({
                    ok: true,
                    json: () => ({snapshot_id: "snapshot123"})
                });
            }

            return Promise.resolve({ok: true, json: () => ({}) });
        };
        const result = await Spotify.savePlaylist(playlistName, exampleTracks);
        expect(result).equal("Playlist saved successfully");
    });
});