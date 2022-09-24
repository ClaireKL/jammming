let accessToken;
const clientID = 'c910dbf572a54a168890911ca86284c8';
const redirectURI = "http://localhost:3000/"
const Spotify = {
    
    getAccessToken() {
        if(accessToken) {
            return accessToken;
        } else {
            //check the URL to see if access token is obtained
            const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
            const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

            if(accessTokenMatch && expiresInMatch){
                accessToken = accessTokenMatch[1];
                let expiresIn = Number(expiresInMatch[1]);
                // clears access token when expired
                window.setTimeout(() => accessToken = '', expiresIn * 1000);
                window.history.pushState('Access Token', null, '/');
                return accessToken; 
            } else {
                const accessURL = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
                window.location = accessURL;
            }
        }
    },

    search(term) {
        const token = this.getAccessToken();
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`,
                     { headers: { Authorization: `Bearer ${token}` } } )
                     .then(response => response.json())
                     .then(jsonResponse => {
                        if(!jsonResponse.tracks) {
                            return [];
                        } else {
                            return jsonResponse.tracks.items.map(track => (
                                                        { id : track.id,
                                                          name : track.name,
                                                          artist : track.artists[0].name,
                                                          album : track.album.name,
                                                          uri : track.uri }));
                        }
                     });
    },

    savePlaylist(playlistName, trackURIs) {
        if(!playlistName || !trackURIs.length){
            return;
        }
        const token = this.getAccessToken();
        const headers = { Authorization: `Bearer ${token}` };
        let userID;
        let playlistID;
        return fetch("https://api.spotify.com/v1/me", { headers : headers }
                    ).then(response => response.json()
                    ).then(jsonResponse => {
                            userID = jsonResponse.id;
                            return fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, 
                                { headers : headers,
                                  method : 'POST',
                                  body : JSON.stringify({ name : playlistName })
                                });
                    }).then(response => response.json()
                    ).then(data => { playlistID = data.id
                            return fetch(`https://api.spotify.com/v1/playlists/${playlistID}/tracks`,
                                { headers : headers,
                                  method : 'POST',
                                  body : JSON.stringify({ uris : trackURIs})
                                });
                            }    
                    ).then(response => response.json()
                    ).then(data => { playlistID = data.snapshot_id})           
    }
};


export default Spotify;