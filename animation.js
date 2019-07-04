var token = window.localStorage.getItem('token');

$(document).ready(function() {
    firebase.initializeApp(firebaseConfig);
    //checkAuth();
    addCurrentSongEvents();
    jqueryevent();
    jqueryAddRedirect();
    playSong2(200);
    setupSpotify();
});

function addCurrentSongEvents(){
    $('tr').click(function(){
        let play_icon = $(this).find('i');
        $('tr').removeClass('active');
        $('tr').find('i').removeClass('active fa-pause-circle').addClass('hidden fa-play-circle');
        $(this).addClass('active');
        $(play_icon).removeClass('fa-play-circle hidden').addClass('fa-pause-circle active');
    });
};

function PressPlay(my_device, token, player){
    alert(1)
    $.ajax({
        url: "https://api.spotify.com/v1/me/player/play?device_id=" + my_device,
        type: "PUT",
        data: '{"uris": ["spotify:track:5h0Jgt873QtgL6nJRBGfT6"]}',
        beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + token );},
        success: function(data) {
            alert(2); 
            console.log(data)
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.status);
            alert(thrownError);
            alert(ajaxOptions);
          }
    }).then(
        player.getCurrentState().then(state => {
            if (!state) {
              console.error('User is not playing music through the Web Playback SDK');
              return;
            }
          
            let {
              current_track,
              next_tracks: [next_track]
            } = state.track_window;
          
            console.log('Currently Playing', current_track);
            console.log('Playing Next', next_track);
          })
    )

};

function jqueryevent() {
    $('.hide-open').click(function() {
        if ($('.bottom-section').hasClass('hidden')) {
            $('.top-section').height('40vh');
            $('.bottom-section').height('40vh');
            $('.bottom-section').removeClass('hidden');
        }
        else {
            $('.top-section').height('80vh');
            $('.bottom-section').height('3vh');
            $('.bottom-section').addClass('hidden');
        }
    })
};

function jqueryAddRedirect() {
    $('.modal .btn').click(function() {
        if($(this).attr('id') =='home') {
            alert(1)
            //window.location.replace("http://stackoverflow.com");
        } else {
            alert(2)
            //window.location.replace("http://google.com");
        }
    })
}


function checkAuth() {
    var user = firebase.auth().currentUser;
    if (user) {
        alert(1);
    } else {
        $('#noauth').modal('show');
    }
}


function playSong2(song_length, start=0) {
    start = moment(start, "ss").format("mm:ss")
    let end = moment(start, "ss").add(song_length, 'seconds').format("mm:ss")
    $('.end-time').text(end);
    var time = 1;

    var interval = setInterval(function() {
    if (time <= song_length) {
        time++;
        start = moment(start, "mm:ss").add(1, 'seconds').format("mm:ss");
        let width = (time / song_length) * 100;
        $('.progress').width(`${width}%`);
        $('.start-time').text(start);
    }
    else { 
        clearInterval(interval);
    }
    }, 1000);
};

function setupSpotify(){
    // Set up app config
    var client_id = '42c128e85c9c4eddad1930a129937c94';
    var response_type = 'token';
    var redirect_uri = 'http://127.0.0.1:8899/index.html';
    var scope = [
        'user-read-playback-state', 'streaming', 'user-read-private', 'user-read-currently-playing', 'user-modify-playback-state', "user-read-birthdate", "user-read-email",].join(' ');
    //alert(scope);
        // add event listener for login
    $('.login').on('click', function(e) {
        var url = `https://accounts.spotify.com/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scope}&response_type=${response_type}`;
        // send the user to the spotify login page
        token = window.localStorage.getItem('token');
        window.location = url;
    })

// get the token from localStorage (if it exitst)
//var token = window.localStorage.getItem('token');

// if the token is set, then we are probably logged in
    if (token == null) {
        // so change the login button text
        $('.login').text('Refresh Spotify Login');
    } else {
        $('.login').text('token recieved');}


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
                    console.log(track);
                    var artistsString = track.artists.map(artist => {
                        return artist.name;
                    }).join(', ');
                    return `
                    <div class="card spotify-card col-3 mx-4 my-4 ">
                        <img class="card-img-top" src="${track.album.images[0].url}" value= "${track.album.external_urls.spotify}"/>
                        <div class="card-body">
                        <h5 class="card-title">${artistsString} <span class="badge badge-secondary">${track.album.release_date}</span></h5>
                        <h5 class="card-title">${track.name}</h5>
                        <button class="btn btn-primary play-song" type="button" onclick="favoriteSongs('${track.id}')">add</button>
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
            console.log(html)
            document.getElementsByClassName('spotify-container')[0].innerHTML = html;
        }).then(
            $(document).on('click', '.play-song', function(){alert(999);})
        )

    }
    })

};