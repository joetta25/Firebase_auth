//Spotify
// Set up app config
var client_id = '57a5ae8651d746c3b9b1fcb24561af24';
var response_type = 'token';
var redirect_uri = 'http://127.0.0.1:5500/dashboard.html';
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
        $.ajax(`https://api.spotify.com/v1/search?q=${value}&type=track`, {
            headers: {
                'Authorization': `Bearer ${token}` // this is where we use the access_token
            }
        })
        .then((data) => { // when the search request is finished // log the data to the console//console.log(data);
            if (data.tracks.items.length > 0) {
                var songsHTML = data.tracks.items.map(track => {
                    var artistsString = track.artists.map(artist => {
                        return artist.name;
                    }).join(', ');
                    return `
                    <div class="card movie col-3 mx-4 my-4 " style ="background-color: black;" >
                        <img class="card-img-top" src="${track.album.images[0].url}" value= "${track.album.external_urls.spotify}"/>
                        <div class="card-body" style="background>
                        <h5 class="card-title">${artistsString} <span class="badge badge-secondary">${track.album.release_date}</span></h5>
                        <h5 class="card-title">${track.name}</h5>
                        <button class="btn btn-primary" type="button" onclick="favoriteSongs('${track.id}')">add</button>
                        </div>
                    </div>
                    `
                })
                return songsHTML.join('');
            } else {
                return '<div>No results</div>'
            }
        })
        .then((html) => {
            document.getElementsByClassName('music-container-fluid')[0].innerHTML = html;
        })

    }
})


// Youtube