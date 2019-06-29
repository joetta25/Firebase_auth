$(document).ready(function() {
    firebase.initializeApp(firebaseConfig);
    //checkAuth();
    jqueryevent();
    jqueryAddRedirect();
    playSong2(200)
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


function playSong(song_length) {
    const start_time = new Date().getTime() / 1000;
    const end_time = start_time += song_length;
    let time_now = 0;
    let last_update = 1;
    while (time_now > end_time){
        time_now = new Date().getTime() / 1000;
        last_update = 1;
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
}
