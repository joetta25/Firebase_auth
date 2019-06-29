$(document).ready(function() {
    firebase.initializeApp(firebaseConfig);
    //checkAuth();
    jqueryevent();
    jqueryAddRedirect();
    playSong2(200);
    SpotifyInit();
})

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
    alert(end);
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

function SpotifyInit() {
    window.onSpotifyWebPlaybackSDKReady = () => {
        const token = 'BQBsQORKvHDTmIZXHrrqVzv8OawBIoJrRAIlwlhXT48-I-5MRtauI6BLunKX2E0chlY3vBM50RiQBmHvcNsMXQoh9cxn-gGWbgxJaqrRmTu88YKZ_4A-ZNTXuedRdDcusCkWOwda7A55YP_PsuQShNPhq7GhhdwVS3krXI4UWY0v2lCEcpqgNZ6s';
        const player = new Spotify.Player({
          name: 'Web Playback SDK Quick Start Player',
          getOAuthToken: cb => { cb(token); }
        });
      
    // Error handling
    player.addListener('initialization_error', ({ message }) => { console.error(message); });
    player.addListener('authentication_error', ({ message }) => { console.error(message); });
    player.addListener('account_error', ({ message }) => { console.error(message); });
    player.addListener('playback_error', ({ message }) => { console.error(message); });
      
    // Playback status updates
    player.addListener('player_state_changed', state => { console.log(state); });
      
    // Ready
    player.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
    });
      
    // Not Ready
    player.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
    });
      
    // Connect to the player!
    player.connect();
    };


}





