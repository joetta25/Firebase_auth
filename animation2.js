$(document).ready(function() {

    //Firebase INIT
    //FireBasePromises()
    //Jquery INIT
    $('.start-time').text('00:00');
    $('.end-time').text('00:00');
    addCurrentSongEvents();
    setupSpotifyNav();
    setupYoutubeNav()
    jqueryevent();
    jqueryAddRedirect();
    document.getElementById("logOutBtn").addEventListener("click", e => {
        firebase.auth().signOut();
        logoutUser()
      });
    
      // this will monitor the user's state
    //END Jquery INIT
    $(document).on('click', '.play-song', function(){
        let track_id = $(this).closest('tr')[0].id;
        let track = $(`#${track_id}`).html();
        let track_uri = $(`#${track_id}`).attr('value')
        console.log(track)
        console.log(track_id)
        console.log(track_uri)
        let length_sec = $(track).attr('value') / 1000
        let duration = moment.duration(length_sec, "seconds").format("mm:ss");
        let artist = $(`#${track_id} .artist-name`).text()
        let song_cover = $(`#${track_id} img`).attr('src'); 
        let song_name = $(`#${track_id} .song-name`).text()
        console.log(length_sec)
        AddSong(artist, song_name, song_cover, track_uri, length_sec)
        let songhtml = `<tr class="sp" value="${track_uri}" id="${track_id}">
                <td class="album" value="${duration}">
                    <i class="fa fa-play-circle fa-3x hidden" aria-hidden="true"></i>
                    <div class=album-holder><img src="${song_cover}"></div>
                </td>
                <td>
                    <p class="artist-name">${artist}</p>
                    <h5 class="song-name">${song_name}</h5>
                </td>
                <td>
                    <div class="time-holder" value="${length_sec}">
                    ${duration}
                    </div>
                </td>
        </tr>`
        $('#soundgood-likes tbody').append(songhtml);
        //alert(songhtml)
    })

});

function logoutUser() {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        // User is signed in.
        var displayName = user.displayName;
        var email = user.email;
        var emailVerified = user.emailVerified;
        var photoURL = user.photoURL;
        var isAnonymous = user.isAnonymous;
        var uid = user.uid;
        var providerData = user.providerData;
      } else {
        console.log("Not logged in");
        window.location = "home.html";
      }
    });
}


//Global Variables
var firebase_user = null; 
var user_json = null;
var token = undefined;
var interval = undefined;
var song_seconds = 0;
var current_seconds = 0;
var current_id = undefined;
var music_player = undefined;
var my_device = undefined;
//END Global Variables


function FireBasePromises(){
    return new Promise((resolve, reject) => {
        firebase.initializeApp(firebaseConfig);
        resolve();
    })
}
FireBasePromises()
.then(() => {return checkAuth()})
.then((user) => {
    console.log(user)
    return getFirebaseUserProfile(user)
})
.then(() =>{
    console.log("getting user info")
    console.log(user_json)
    console.log(firebase_user)
    console.log("done getting info");
    StoreAPIToken();
    verifySpotifyToken();
    return RenderAccountLikes(user_json)
})
.then( function(){
    if(token !==null){
        //alert("token" + token);
        getSpotifyUserProfile();
        SpotifyGetLikes();
    }
})
.then(function(){setupSpotify()});
/*
---------------------------------------------------------

This Section is used for everything related to firebase.
that includes authentication, getting user profile.

---------------------------------------------------------
*/

function checkAuth() {
    // check if a user is authenticated if so get the data for the user.
    // the data will generate the stored playlist and be used to retrieve the 
    //spotify token.. functions need to be added after to confirm a spotify token is
    //valid.
    return new Promise((resolve, reject) => {
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                firebase_user = user;
            }
            else {
                console.log('creating user');
                const email ='antony.tsygankov@gmail.com';
                const pswd ='football1924';
                return firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(function(){
                    firebase.auth().signInWithEmailAndPassword(email, pswd)
                }).then(() => {
                    firebase_user = firebase.auth().currentUser;
                }).catch(function(error) {
                    console.log(error.code + error.message);
                });
            }
            
        });
        userTimeoutCounter = 0;
        const userTimer = setInterval(() => {
            if (firebase_user) {
                clearInterval(userTimer);
                resolve(firebase_user);
            }
            if (userTimeoutCounter > 100) {
                reject();
            }
            userTimeoutCounter++
        }, 100);
    });
};


function getFirebaseUserProfile(user){
    // once a user is proven to be logged in he is assigned to firbase_user
    // unfortunatley I was unable to get data from the json array with that call.
    //therefore their userid is used to get the full json object.
    //this object is called user_json.
    const URL = `https://signupform-96aeb.firebaseio.com/user/${user.uid}.json`;
    console.log(user.uid)
    return $.ajax(URL).then(result => {
        return user_json = result;
    });
}


function verifySpotifyToken() {
    console.log("verifying spotify token")
    if (user_json.spotify_token){
        let token_unique = Object.keys(user_json.spotify_token)[0];
        let token_dict = user_json.spotify_token[Object.keys(user_json.spotify_token)[0]]
        let token_age = new Date().getTime() / 1000 - token_dict.created
        if (token_age < 3600 & token_dict.valid) {
            token = token_dict.token;
            return token
        }
        else {
            console.log('token has expired authentication required');
            $.ajax({
                url: `https://signupform-96aeb.firebaseio.com/user/${firebase_user.uid}/spotify_token/${token_unique}.json`,
                type: "DELETE",
                success: function () {
                    console.log("old token deleted!!");
                },
            })
            return null
        }
    }
}

function CreateBoofDBUser() {
    //I got tired of creating users so this will create a fake user for testing
    //currently it creates a new section to not mess with the signup form
    //by removing the 's' at the end of users it will plop the data in the same json array
    
    let username = "A3JmyocW0XY9KSYY27AVwyi5e2B3"
    firebase.database().ref('user/' + username).set({
        username: 'antony',
        email: 'antony.tsygankov@gmail.com',
        password: 'apples123',
        phonenumber: '12345678'
      });
}


function AddSong(artist, song_name, song_cover, song_uri, duration){
    // currently a mock function to demonstrate how songs will be added.
    //param is everything we need to display and play the song...
    //ajax is used to post it into the database under a users songs.
    var param = {
        'Artist' : artist, 
        'Song' : song_name,
        'song_cover' : song_cover,
        'song_uri' : song_uri,
        'duration' : duration,
        }
    $.ajax({
        url: `https://signupform-96aeb.firebaseio.com/user/${firebase_user.uid}/songs.json`,
        type: "POST",
        data: JSON.stringify(param),
        success: function () {
        console.log("song added successfully");
        },
        error: function(error) {
            console.log("error: "+error);
        }
    });

}

function removeUserToken() {
    //function to delete a token at the users request...
    //if it is lost no one can use it and user must reauthenticate.
    //'PATCH' is used as the ajax parameter which means to update
    let key_id = Object.keys(user_json.spotify_token)[0];
    let patch = {'valid' : false, 'token' : ''}
    $.ajax({
        url: `https://signupform-96aeb.firebaseio.com/user/${firebase_user.uid}/spotify_token/${key_id}.json`,
        type: "PATCH",
        data: JSON.stringify(patch),
        success: function () {
            console.log("successfuly removed user token")
        },
        error: function(error) {
            console.log("token remove failed: "+error.message);
        }
    });
};

function RenderAccountLikes(user_json){
    let songsHTML = createPlaylistHTML(user_json)
    let HTML = `<table class="table" id="soundgood-likes">
                <thead>
                <tr>
                </tr>
                </thead>
                <tbody>
                ${songsHTML}
                </tbody>
                </table>`;
    document.getElementsByClassName('sound-good-container')[0].innerHTML = HTML;
    $('#soundgood-likes > tbody').wrap('<div class="scrollable"></div>')
    //$(document).on('click', '.play-song', function(){alert(999);})
};

function createPlaylistHTML() {
    if(user_json.songs ==undefined){return ''}
    let song_count = 0;
    let songsHTML = Object.keys(user_json.songs).map(key =>{
    let song = user_json.songs[key];
    let song_length = moment.duration(song.duration, "seconds").format("mm:ss");
    song_count ++;
    if(song.youtube) {
        var song_class = 'yt';
    } else {
        var song_class = 'sp';
    }
    console.log(song_class);
    return `<tr class="${song_class} "value="${song.song_uri}" id="sound-${song_count}">
                <td class="album" value="${song_length}">
                    <i class="fa fa-play-circle fa-3x hidden" aria-hidden="true"></i>
                    <div class=album-holder><img src="${song.song_cover}"></div>
                </td>
                <td>
                    <p class="artist-name">${song.Artist}</p>
                    <h5 class="song-name">${song.Song}</h5>
                </td>
                <td>
                    <div class="time-holder" value="${song.duration}">
                    ${song_length}
                    </div>
                </td>
        </tr>`}).join('');
    return songsHTML
};


//-----------------------------------
//End Firebase Section





/*
---------------------------------------------------------

This Section is used for everything related to Jquery events and basic
UI components. Does not include rendering of HTML from spotify or youtube

---------------------------------------------------------
*/

function addCurrentSongEvents(){
    //adds icons to indicate if a song is playing or paused etc...
    $(document).on('click', 'tr', function(){
        let play_icon = $(this).find('i');
        $('tr').removeClass('active');
        $('tr').find('i').removeClass('active fa-pause-circle').addClass('hidden fa-play-circle');
        $(this).addClass('active');
        $(play_icon).removeClass('fa-play-circle hidden').addClass('fa-pause-circle active');

    });
};

function jqueryevent() {
    //this function is currently useless will be used when animation is implemented
    $('.pl-next').click(function() {
        current_seconds = song_seconds;
        current_id = `sound-${parseInt(current_id.substring(6)) + 1}`
    });
    $('.pl-prev').click(function() {
        current_seconds = song_seconds;
        current_id = `sound-${parseInt(current_id.substring(6)) - 1}`
    });
    $('.pl-btn').click(function() {
        if($(this).hasClass('fa-pause')){
            music_player.pause().then(() => {
                console.log('Paused!');
                clearInterval(interval)
              });
        }
        else if ($(this).hasClass('fa-play')){
            music_player.resume().then(() => {
                console.log('Resumed!');
                playSong();
              });
        }
       $(this).toggleClass('fa-play');
       $(this).toggleClass('fa-pause');
});
}

function playSong() {
    //function that makes the fake player work
    // it takes the length of the song in seconds, and once a second will call
    // a function to update width of the red bar inside progress bar
    // moment is library for parsing timestamps...
    clearInterval(interval);
    console.log(song_seconds);
    console.log(current_seconds);
    let end = moment(0, "ss").add(song_seconds, 'seconds').format("mm:ss")
    $('.end-time').text(end);

    interval = setInterval(function() {
    if (current_seconds <= song_seconds) {
        current_seconds ++;
        let start = moment(0, "ss").add(current_seconds, 'seconds').format("mm:ss")
        let width = (current_seconds / song_seconds) * 100;
        $('.progress').width(`${width}%`);
        $('.start-time').text(start);
    }
    else if (current_seconds == song_seconds || current_seconds > song_seconds ) {
        clearInterval(interval);
        let track_uri = $(`#${current_id}`).attr('value')
        let track_length = $(`#${current_id} .time-holder`).attr('value');
        let artist = $(`#${current_id} .artist-name`).text()
        let song_cover = $(`#${current_id} img`).attr('src'); 
        let song_name = $(`#${current_id} .song-name`).text()
        $('.current-playing').html(`
        <div class="row">
            <div class="col-lg-4"><img src="${song_cover}"></div>
            <div class="col-lg-8">
                <h3>${artist}</h3>
                <h1>${song_name}</h1>
            </div>
        </div>`)
        PressPlay(my_device, token, music_player, track_uri, track_length)

    }
    }, 1000);
};


function jqueryAddRedirect() {
    //ignore this function currently useless. a modal will popup whenever a user 
    //is not autenticated they can go home or to the login form
    $('.modal .btn').click(function() {
        if($(this).attr('id') =='home') {
            console.log(1)
            //window.location.replace("http://stackoverflow.com");
        } else {
            console.log(2)
            //window.location.replace("http://google.com");
        }
    })
}


function setupSpotifyNav() {
    //every column should have a couple of sections for example your likes, search,
    //and account management. Therefore this function is used to add event listeners,
    // as well added an event listener for logging out.
    $('.spot-item').hide();
    $(`#account-tab`).show();
    $('.spotify-nav .nav-item').click(function(){
        $('.section1 .nav-item').removeClass('active');
        $(this).addClass('active');
        changeSpotifyTab(this.id);
    })
    $('.logout').click(function(){SpotifyLogout()})
};


function changeSpotifyTab(id) {
    $('.spot-item').hide();
    $(`#${id}-tab`).show();
    //alert(id);
}


function setupYoutubeNav() {
    //every column should have a couple of sections for example your likes, search,
    //and account management. Therefore this function is used to add event listeners,
    // as well added an event listener for logging out.
    $('.tube-item').hide();
    $('#yt-account-tab').show();
    $('.section2 .nav-item').click(function(){
        $('.section2 .nav-item').removeClass('active');
        $(this).addClass('active');
        changeYoutubeTab(this.id);
    })
};


function changeYoutubeTab(id) {
    $('.tube-item').hide();
    $(`#yt-${id}-tab`).show();
    //alert(id);
}

//-----------------------------------
//End UI/Jquery Section





/*
---------------------------------------------------------

This Section is dedicated for working with the spotify API
it does include rendering, logging in, getting account information,
as well as user profile and playing tracks.

---------------------------------------------------------
*/
function StoreAPIToken() {
    var hash = window.location.hash.substr(1).split('&');
    var hashMap = [];
    // break the hash into pieces to get the access_token
    if (hash.length) {
        hash.forEach((chunk) => {
            const chunkSplit = chunk.split('=');
            hashMap[chunkSplit[0]] = chunkSplit[1];
        })
    }
    if (hashMap.access_token) {
        console.log("token retreived from url")
        token = hashMap.access_token;
        AddSpotifyToken()
    }
}

function AddSpotifyToken() {
    console.log("deleting old token")
    $.ajax({
        url: `https://signupform-96aeb.firebaseio.com/user/${firebase_user.uid}/spotify_token.json`,
        type: "DELETE",
        success: function () {
            console.log("Deleted old token!!");
        },
        error: function(error) {
            console.log(error)
            console.log("error: "+error);
            }
    })
    .then(() => {return addNewToken()})
}

function addNewToken(){
    console.log("adding new token")
    console.log(token)
    console.log("finished printing token")
    var params = {'token' : token, 'created' : new Date().getTime() / 1000, 'valid' : true,};
    $.ajax({
        url: `https://signupform-96aeb.firebaseio.com/user/${firebase_user.uid}/spotify_token.json`,
        type: "POST",
        data: JSON.stringify(params),
        success: function () {
            console.log("success spotify token has been added to database");
            },
        error: function(error) {
            console.log(error)
            console.log("error: "+error.message);
            }
        }).then(function(){return window.location = 'http://159.203.185.216:8899/animation.html'});
}

function PressPlay(my_device, token, player, song, song_length){
    ///work in progress function to play a track
    song_seconds = song_length;
    music_player = player;
    current_seconds = 0;
    $('.pl-btn').removeClass('fa-play');
    $('.pl-btn').addClass('fa-pause');
    player.addListener('player_state_changed', state => { 
        console.log(state); 
        console.log("music my good sir"); 
        if (state.paused){
            clearInterval(interval);
            current_seconds = moment.duration(state.position/1000, "seconds").format("ss");
        }
        else if (song_seconds == 0){
            song_seconds = moment.duration(state.duration/1000, "seconds").format("ss");
        }
        else {
            playSong();

        }

        });
    $.ajax({
        url: "https://api.spotify.com/v1/me/player/play?device_id=" + my_device,
        type: "PUT",
        data: `{"uris": ["${song}"]}`,
        beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + token );},
        success: function(data) {
            console.log("start playing")
            console.log(data)
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.status);
            console.log(thrownError);
            console.log(ajaxOptions);
          }
    })

};

function setupSpotify(){
    // Setup login to spotify '.login is the button it redirects to index.html where the 
    //token is scraped from the url and sent to firebase.
    //if no token exists a button is created to reauthenticate in case the user is experiencing issues.
    // as well an event listener is created to search spotify
    var client_id = '42c128e85c9c4eddad1930a129937c94';
    var response_type = 'token';
    var redirect_uri = 'http://159.203.185.216:8899/animation.html';
    var scope = [
        'user-read-playback-state', 'streaming', 'user-read-private', 'user-read-currently-playing', 'user-modify-playback-state', 'user-read-birthdate', 'user-read-email', 'user-library-read',].join(' ');

    $('.login').on('click', function(e) {
        var url = `https://accounts.spotify.com/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scope}&response_type=${response_type}`;
        // send the user to the spotify login page
        window.location = url;
    })

// if the token is set, then we are probably logged in
    if (token == undefined) {
        // so change the login button text
        $('.login').text('Refresh Spotify Login');
        $('.spot-welcome').text(`Login and Start Listening!`);
    } else {
        $('.login').text('Re-Authenticate');}


    $('.search-form').on('submit', function(e) {searchSpotify(e)});
    }


function searchSpotify(e){
    //whenever the searchform is submitted the value is returned from user input
    //then an ajax request is sent and an object of matching records are returned
    //I added parameters to prevent too long of song names from fully appearing.
    // as well the song cuts off at three featured artists
    // ex Song Name  "Some song name" Drake Feat(Jay-z, Kanye West, Tyler...)
    e.preventDefault();
    var value = $('#searchname').val();
    $('.spotify-container').html();
    if (value != '') {
        $.ajax(`https://api.spotify.com/v1/search?q=${value}&type=track`, {
            headers: {'Authorization': `Bearer ${token}`}
            })
        .then((data) => { // when the search request is finished // log the data to the console//console.log(data);
            if (data.tracks.items.length > 0) {
                let song_count = 0;
                var songsHTML = data.tracks.items.map(track => {
                    song_count ++;
                    let artist_count = 0;
                    let main_artist = '';
                    var featured_artists = track.artists.map(artist => {
                        artist_count ++;
                        if (artist_count == 1){
                            main_artist = artist.name;
                    }   
                    else if (artist_count==2) {
                        return artist.name
                    } 
                    else if (artist_count==3) {
                        return `, ${artist.name.substring(0,6)}...`
                    };

                    }).join('');
                    let artistsString = `${main_artist}`;
                    if (artist_count > 1){ 
                        artistsString = `${main_artist} feat(${featured_artists})`
                    }
                    return `
                    <tr value="${track.uri}" id="sp-search-${song_count}">
                        <td class="album" value="${track.duration_ms}">
                            <div class=album-holder><img src="${track.album.images[0].url}"></div>
                            </td>
                        <td>
                        <p class="artist-name">${artistsString}</p>
                        <h5 class="song-name">${track.name}</h5>
                        </td>
                        <td>
                        <div class="time-holder">
                        <h5 class="song-length"><button class="btn btn-primary play-song" type="button">add</button></h5>
                        </div>
                        </td>
                    </tr>
                    `
                }).join('')
                return `<table class="table" id="spotify-table">
                        <thead>
                        <tr>
                        </tr>
                        </thead>
                        <tbody>
                        ${songsHTML}
                        </tbody>
                        </table>`

            } else {
                return '<div>No results</div>'
            }
        })
        .then((html) => {
            document.getElementsByClassName('spotify-container')[0].innerHTML = html;
            $('#spotify-table > tbody').wrap('<div class="scrollable"></div>')
        }).then(
            $(document).on('click', '.play-song', function(){
                console.log($(this));
                //AddSong(artist, song_name, song_cover, song_uri, duration)
            })
        )

    }
};


function getSpotifyUserProfile(){
    $.ajax(`https://api.spotify.com/v1/me`, {
        headers: {
            'Authorization': `Bearer ${token}` // this is where we use the access_token
        },
        error: function () {
            $('.spot-welcome').text(`Login and Start Listening!`);
            $('.login').text('Login to Spotify');
          },
    }).then(profile => {
        //console.log(profile)
        $('.spot-welcome').text(`Welcome ${profile.display_name}!`);
    });
};


function SpotifyLogout() {
    // Spotify does not have a logout api call therefore we can open a temporary
    //window to logout of the spotify website SetTimeout() makes it disappear in 5 seconds.
    // Unfortunatley the user can still use the token to get more tracks, therefore a
    //database call is made to remove the user stored token and mark it as valid==False.

    //AuthenticationClient.clearCookies(getApplication());
    removeUserToken();
    const url = 'https://www.spotify.com/logout/'                                                                                                                                                                                                                                                                               
    const spotifyLogoutWindow = window.open(url, 'Spotify Logout', 'width=700,height=500,top=40,left=40')                                                                                                
    setTimeout(() => spotifyLogoutWindow.close(), 3000)
}


function SpotifyGetLikes() {
    //ajax request to get all user spotify likes whenever a user is logged in.
    console.log("getting likes")
    $.ajax(`    https://api.spotify.com/v1/me/tracks?&limit=50`, {
        headers: {
            'Authorization': `Bearer ${token}` // this is where we use the access_token
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + xhr)
            console.log('getting likes failed');
          },
    }).then((data) => { // when the search request is finished // log the data to the console//console.log(data);
        //console.log(data);
        if (data.items.length > 0) {
            let song_count = 0;
            var songsHTML = data.items.map(track => {
                let artist_count = 0;
                let main_artist = '';
                var featured_artists = track.track.artists.forEach(artist => {
                    artist_count ++;
                    if (artist_count == 1){
                        main_artist = artist.name;
                }   
                else if (artist_count==2) {
                    return artist.name
                }
                else if (artist_count==3) {
                    return `, ${artist.name.substring(0,6)}...`
                };
                });
                let artistsString = `${main_artist}`;
                if (artist_count > 1){ 
                    featured_artists.join('');
                    artistsString = `${main_artist} feat(${featured_artists})`
                }
                song_count ++;
                if(track.track.name.length > 40){
                    track.track.name = track.track.name.substring(0,25);
                }
                return `<tr value="${track.track.uri}" id="sp-likes-${song_count}">
                            <td class="album" value="${track.track.duration_ms}">
                                <div class=album-holder><img src="${track.track.album.images[0].url}"></div>
                                </td>
                            <td>
                            <p class="artist-name">${artistsString}</p>
                            <h5 class="song-name">${track.track.name}</h5>
                            </td>
                            <td>
                            <div class="time-holder">
                            <h5 class="song-length"><button class="btn btn-primary play-song" type="button">add</button></h5>
                            </div>
                            </td>
                        </tr>`}).join('')
            //console.log(songsHTML)
            return `<table class="table" id="spotify-likes">
                    <thead>
                    <tr>
                    </tr>
                    </thead>
                    <tbody>
                    ${songsHTML}
                    </tbody>
                    </table>`

        } else {
            return '<div>No results</div>'
        }
    })
    .then((html) => {
        //I used a table to display user's songs therefore this section wraps 
        //the table body in a div and makes it scrollable.
        //I understand that the idea was to have buttons instead of scrolling,
        //I have functions to accomplish this as well we can change it next time we 
        //all meet.
        document.getElementsByClassName('spotify-likes')[0].innerHTML = html;
        $('#spotify-likes > tbody').wrap('<div class="scrollable"></div>')
    })
};
