//Spotify
// Set up app config
var page_count = 0;
var next_url = '';
var prev_url = '';
var client_id = '57a5ae8651d746c3b9b1fcb24561af24';
var response_type = 'token';
var redirect_uri = 'http://127.0.0.1:5501/dashboard.html';
var scope = [
    ''
].join(' ');

// get auth code from url hash
var hash = window.location.hash.substr(1).split('&');
var hashMap = [];
// break the hash into pieces to get the access_token
if (hash.length) {
    hash.forEach((chunk) => {
        const chunkSplit = chunk.split('=');
        hashMap[chunkSplit[0]] = chunkSplit[1];
    })
}

// if the hash has an access_token, then put it in localStorage
if (hashMap.access_token) {
    window.localStorage.setItem('token', hashMap.access_token);
    window.location = window.location.origin + window.location.pathname;
}

// add event listener for login
$('.login').on('click', function(e) {
    //build spotify auth url
    var url = `https://accounts.spotify.com/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scope}&response_type=${response_type}`;
    
    // send the user to the spotify login page
    window.location = url;
})

// get the token from localStorage (if it exitst)
var token = window.localStorage.getItem('token');

// if the token is set, then we are probably logged in
if (token !== null) {
    // so change the login button text
    $('.login').text('Refresh Spotify Login');
}

// when the form is submitted
$('.search-form').on('submit', function(e) {
    e.preventDefault();
    // get the search value from the search field
    var value = $('#searchname').val();
    // if the value is not empty
    if (value != '') {
        // get the search request from spotify
        $.ajax(`https://api.spotify.com/v1/search?q=${value}&type=track&limit=5`, {
            headers: {
                'Authorization': `Bearer ${token}` // this is where we use the access_token
            }
        })
        .then(renderSpotifyResults)

    }
})

function renderSpotifyResults(data) { // when the search request is finished // log the data to the console//console.log(data);
    let html = '';
    next_url = data.tracks.next;
    prev_url = data.tracks.previous;
    if (data.tracks.items.length > 0) {
        var songsHTML = data.tracks.items.map(track => {
            var artistsString = track.artists.map(artist => {
                return artist.name;
            }).join(', ');
            return `
                <div class = "album">
                    <img  class = "mb-1" width = "50" src = ${track.album.images[0].url} value= "${track.album.external_urls.spotify}"/>
                    <h3 class = "d-inline-block">${artistsString}</h3>
                </div>
                <div class = "song d-flex justify-content-between border-top border-bottom py-3">
                    <b>${track.name}</b>
                    <button type="button" data-spotify="${track.uri}" class="btn btn-primary">add</button>
                </div>
            `
        })
        html = songsHTML.join('');
    } else {
        html = '<div>No results</div>'
    }

    document.getElementsByClassName('music-container-fluid')[0].innerHTML = html;
}

$('.next').click((e) => {
    e.preventDefault();
    $.ajax(next_url, {
        headers: {
            'Authorization': `Bearer ${token}` // this is where we use the access_token
        }
    })
    .then(renderSpotifyResults)
});

$('.previous').click((e)=> {
    e.preventDefault();
    $.ajax(prev_url, {
        headers: {
            'Authorization': `Bearer ${token}` // this is where we use the access_token
        }
    })
    .then(renderSpotifyResults)
})

// Youtube