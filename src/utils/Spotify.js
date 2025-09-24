const clientId = 'c216499016654bc892ff26a00715a49b'; // Replace this with your real Client ID
const redirectUri = 'http://127.0.0.1:3000/';

// spotify api base url
const spotifyApiUrl = 'https://api.spotify.com/v1';
let accessToken;

//We'll add function here

const Spotify = {
    search(term) {
        if(!term) {
            return Promise.resolve([]);
        }

        // Get access token first
        const accessToken = Spotify.getAccessToken();

        // Make the API request to Spotify
        return fetch(`${spotifyApiUrl}/search?q=${term}&type=track&limit=20`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }).then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        }).then(jsonResponse => {
            //Check if the response has the expected data
            if(!jsonResponse.tracks) {
                console.warn("No tracks found in the response");
                return [];
            }

            // We'll parse the response here

            return jsonResponse.tracks.items.map(track => ({
                id: track.id,
                name: track.name,
                artist: track.artists[0].name,
                album: track.album.name,
                uri: track.uri
            }));
        }).catch(error => {
            console.error("Error fetching data from Spotify API: ", error);
            return [];
        });
    },
    getAccessToken() {
        console.log("getAccessToken called");
        console.log("Current URL:", window.location.href);
        console.log("Current accessToken:", accessToken);
        
        // Check if we already have an access token
        if (accessToken) {
            console.log("Using existing access token");
            return accessToken;
        }

        // Check for access token match in the URL
        const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
        const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

        if (accessTokenMatch && expiresInMatch) {
            console.log("Found access token in URL");
            accessToken = accessTokenMatch[1];
            const expiresIn = Number(expiresInMatch[1]);

            // Clear the access token after it expires
            window.setTimeout(() => accessToken = '', expiresIn * 1000);
            window.history.pushState('Access Token', null, '/'); // Clear the parameters from the URL
            return accessToken;
        } else {
            console.log("No access token found, redirecting to Spotify...");
            // For now, let's try the implicit grant flow with different parameters
            const scope = 'playlist-modify-public';
            const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&show_dialog=true`;
            console.log("Redirecting to:", accessUrl);
            window.location = accessUrl;
        }
    },

    async savePlaylist(playlistName, playlistTracks) {
        if(!playlistName) {
            return('Playlist name cannot be empty');
        }

        if(!playlistTracks || playlistTracks.length === 0) {
            return("It's an empty playlist");
        }

        // If we reach this point, it means we have valid inputs
        // Here you would typically make a call to the Spotify API to save the playlist
        const accessToken = Spotify.getAccessToken();

        return fetch(`${spotifyApiUrl}/me`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }).then(response => {
            if(!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
                
            }
            return response.json();
        }).then(jsonResponse => {
            if(!jsonResponse.id) {
                throw new Error('Unable to get user information from Spotify');
            }
            
            // At this point we have the user ID, now we need to create a playlist
            const userId = jsonResponse.id;
            
            return fetch(`${spotifyApiUrl}/users/${userId}/playlists`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: playlistName,
                    description: 'Created via Jammming',
                    public: false
                })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(playlistResponse => {
                if(!playlistResponse.id) {
                    throw new Error('Unable to create playlist on Spotify');
                }
                const playlistId = playlistResponse.id;
                const trackUris = playlistTracks.map(track => track.uri);
                return fetch(`${spotifyApiUrl}/playlists/${playlistId}/tracks`, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ uris: trackUris })
                }).then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                }).then(finalResponse => {
                    return "Playlist saved successfully"; 
                });
            });
        }).catch(error => {
            console.error('Error in savePlaylist:', error);
            throw error;
        });
    }

};
//Export the Spotify object
export default Spotify;