// Use localhost port 8888
const ytApiKey = "AIzaSyDHaIMUkv2DdX8RqP0rmf8QIhcCg_5KU08"
// const ytApiKey = "AIzaSyCw7Gw6BDPrcRiqjfTMfDckh_11BKWl7HM"
// const ytCLIENT_ID = "976539214773-2gpmtmkm9phb43cir7mdgfjfl4cus9vr.apps.googleusercontent.com";
const ytCLIENT_ID = "254484771306-7r6u8p6efbpqcjru9diqqnq4naoval1o.apps.googleusercontent.com";
const ytDISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest'];
const ytSCOPES = 'https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/youtube.force-ssl';

const authorizeButton = document.getElementById('authorize-button');
const signoutButton = document.getElementById('signout-button');
const content = document.getElementById('content');
const searchForm = document.getElementById('yt-search-form');
const searchInput = document.getElementById('search-input');
const videoContainer = document.getElementById('video-container');

// Form submit 
$('#yt-search-form').on('submit', function(e) {
    e.preventDefault();
    makeSearchRequest();
});

// Load auth2 library
function handleClientLoad() {
    gapi.load('client:auth2', initClient);
}

// Init API client
function initClient() {
    gapi.client.init({
        discoveryDocs: ytDISCOVERY_DOCS,
        clientId: ytCLIENT_ID,
        scope: ytSCOPES
    }).then(() => {
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        authorizeButton.onclick = handleAuthClick;
        signoutButton.onclick = handleSignoutClick;
        });
}

// Hide and unhide elements based on login state
function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        console.log(isSignedIn)
        $('.tube-welcome').text("Welcome, You're Logged In!")
        authorizeButton.style.display = 'none';
        signoutButton.style.display = 'block';
        content.style.display = 'block';
        videoContainer.style.display = 'block';
    } else {
        authorizeButton.style.display = 'block';
        signoutButton.style.display = 'none';
        content.style.display = 'none';
        videoContainer.style.display = 'none';
    }
}

// Login and Logout functions
function handleAuthClick() {
    gapi.auth2.getAuthInstance().signIn();
}

function handleSignoutClick() {
    gapi.auth2.getAuthInstance().signOut();
}

function searchList() {
    gapi.client.setApiKey(ytApiKey); 
    gapi.client.load('youtube', 'v3', function() {
        makeSearchRequest();
    });
}

// This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);


// This function creates an <iframe> (and YouTube player)
// after the API code downloads.
var ytplayer;
function onYouTubeIframeAPIReady() {
    ytplayer = new YT.Player('player', {
    height: '40',
    width: '400',
    videoId: '',
    events: {
        'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange
    }
    });
}

// The API will call this function when the video player is ready.
function onPlayerReady(event) {
    event.target.playVideo();

}

// The API calls this function when the player's state changes.
var done = false;
function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING && !done) {
        done = true;
    }
}

// This function will play the specified clicked song in the player
function playVideoToPlayer(id){
    ytplayer.loadVideoById(id)

};


// This function adds the eventlistener to the play button
$(document).on('click', '.yt-album', function(){
    let videoid = $(this).closest('tr')[0].id;
    alert(videoid);
    playVideoToPlayer(videoid);
});


///////////// line #126 through line #187 is what I am having issues with

// It may be easier to re-copy the function codes from the animation.js file again.

$(document).on('click', '.add-button', function(){
    let track_id = $(this).closest('tr')[0].id; //right //also song_uri
    let duration = $(`#${track_id} .time-holder`).attr('value')
    let length_sec = moment(duration, "mm:ss").format("ss");
    let artist = $(`#${track_id} .artist-name`).text()
    let song_cover = $(`#${track_id} img`).attr('src'); 
    let song_name = $(`#${track_id} .song-name`).text()
    AddSong(artist, song_name, song_cover, track_id, length_sec, true)
    
    var $videoContainer = $('#video-container')
    var song = `
    <tr class="vidTable yt" value="#trackuri" id="${track_id}">
        <td class="album yt-album" value="#">
            <i class="fa fa-play-circle fa-3x hidden" aria-hidden="true"></i>
            <div class=album-holder><img src="${song_cover}"></div>
        </td>
        <td>
            <p class="artist-name">${artist}</p>
            <h5 class="song-name">${song_name}</h5>
        </td>
        <td>
            <div class="time-holder" value="${length_sec}">${duration}</div>                       
            
        </td>
    </tr>`
	$('#soundgood-likes tbody').append(song);
})


function AddSong(vidChannelTitle, vidTitle, videoImg, videoId, videoDuration, youtube){
    // currently a mock function to demonstrate how songs will be added.
    //param is everything we need to display and play the song...
    //ajax is used to post it into the database under a users songs.
    console.log(vidChannelTitle)
    console.log(vidTitle)
    console.log(videoImg)
    console.log(videoId)
    console.log(videoDuration)
    console.log(youtube)
    var param = {
        'Artist' : vidChannelTitle, 
        'Song' : vidTitle,
        'song_cover' : videoImg,
        'song_uri' : videoId,
        'duration' : videoDuration,
        'youtube' : youtube
        }
    $.ajax({
        url: `https://signupform-96aeb.firebaseio.com/user/${firebase_user.uid}/songs.json`,
        type: "POST",
        data: JSON.stringify(param),
        success: function () {
        console.log("song added successfully");
        },
        error: function(error) {
        alert("error: "+error);
        }
    });

}

///////////// line #126 through line #187 is what I am having issues with



// This function will make the api requests and render the searched results 
function makeSearchRequest(token) {
    var q = $('#search-input').val().toLowerCase();
    
    // make API Search request using google library 
    var searchRequest = gapi.client.youtube.search.list({
        q: q,
        part: 'snippet', 
        type: 'video',
        maxResults: 25,
        pageToken: token 
    })

    searchRequest.execute(function(response)  {   
            $('.yt-searched').empty()
            var srchItems = response.result.items; 
            
            // Global variables for pagination
            window.nextPageToken = response.nextPageToken;
            window.prevPageToken = response.prevPageToken;
            
            var $videoContainer = $('#video-container')
            
            if(token) {
                $videoContainer.html("");
            }

            // toggleClass accepts 2 arguments (1st is required, 2nd one is optional)
            // if you specify a 2nd argument, the class would be added or removed depending on the boolean
            $("#prev").toggleClass("hide", !window.prevPageToken)
            $("#next").toggleClass("hide", !window.nextPageToken)
            
            $.each(srchItems, function(index, item) {
                var vidChannelTitle = item.snippet.channelTitle; // artist name
                var vidTitle = item.snippet.title;  
                var videoId = item.id.videoId;
                var videoImg = item.snippet.thumbnails.default.url;  
                
                // make API Video request in order to get duration
                var detailsRequest = gapi.client.youtube.videos.list({
                    id: videoId,
                    part: 'contentDetails', 
                    type: 'video',
                    maxResults: 5
                })

                detailsRequest.execute(function(details) {
                    console.log(details);
                    var videoDuration = ISO8601toDuration(details.items[0].contentDetails.duration);

                // Check index of returned YT ISO8601 time format and trim
                function formatTimeUnit(input, unit){
                    var index = input.indexOf(unit);
                    var output = "00"
                    if (index < 0) {
                        return output; // unit isn't in the input
                    }
                    if (isNaN(input.charAt(index-2))) {
                        return '0' + input.charAt(index - 1);
                    } else {
                        return input.charAt(index - 2) + input.charAt(index - 1);
                    }
                }

                // Convert ISO8601 format to time HH:MM:SS
                function ISO8601toDuration(input){
                    var H = formatTimeUnit(input, 'H');
                    var M = formatTimeUnit(input, 'M');
                    var S = formatTimeUnit(input, 'S');
                    if (H == "00") {
                        H = "";
                    } else {
                        H += ":"
                    }
                
                    return H  + M + ':' + S ;
                }
                
                // HTML render
                $('.yt-searched').append(`
                    <tr class="vidTable" value="#trackuri" id="${videoId}">
                        <td class="album" value="#">
                            <i class="fa fa-play-circle fa-3x hidden" aria-hidden="true"></i>
                            <div class=album-holder><img src="${videoImg}"></div>
                        </td>
                        <td>
                            <p class="artist-name">${vidChannelTitle}</p>
                            <h5 class="song-name">${vidTitle}</h5>
                        </td>
                        <td>
                            <div class="time-holder" value="${videoDuration}"><button class="add-button btn btn-primary yt-add-song">Add</button></div>                       
                            
                        </td>
                    </tr>`); 
                })
            })
            $('.yt-searched').wrap('<div class="scrollable"></div>')
    })
}

// function to get liked videos
function getLikedVideos() {
    $('#video-container').empty()
    var searchRequest =  gapi.client.youtube.videos.list({
        "part": "snippet",
        "myRating": "like",

    });

    searchRequest.execute(function(response)  {
            $('#video-container').empty()
            var srchItems = response.result.items; 
            var $videoContainer = $('#video-container')
            $.each(srchItems, function(index, item) {
                var vidChannelTitle = item.snippet.channelTitle;
                var vidTitle = item.snippet.title;  
                var videoId = item.id;
                var videoImg = item.snippet.thumbnails.default.url;  

                // make API Video request in order to get duration
                var detailsRequest = gapi.client.youtube.videos.list({
                    id: videoId,
                    part: 'contentDetails', 
                    type: 'video',
                    maxResults: 5
                })

                detailsRequest.execute(function(details) {
                    console.log(details);
                    var videoDuration = ISO8601toDuration(details.items[0].contentDetails.duration);

                // Check index of returned YT ISO8601 time format and trim
                function formatTimeUnit(input, unit){
                    var index = input.indexOf(unit);
                    var output = "00"
                    if (index < 0) {
                        return output; // unit isn't in the input
                    }
                    if (isNaN(input.charAt(index-2))) {
                        return '0' + input.charAt(index - 1);
                    } else {
                        return input.charAt(index - 2) + input.charAt(index - 1);
                    }
                }

                // Convert ISO8601 format to time HH:MM:SS
                function ISO8601toDuration(input){
                    var H = formatTimeUnit(input, 'H');
                    var M = formatTimeUnit(input, 'M');
                    var S = formatTimeUnit(input, 'S');
                    if (H == "00") {
                        H = "";
                    } else {
                        H += ":"
                    }
                
                    return H  + M + ':' + S ;
                }
                    // HTML render for Liked videos
                    $videoContainer.append(`
                    <tr class="vidTable" value="#trackuri" id="${videoId}">
                        <td class="album" value="#">
                            <i class="fa fa-play-circle fa-3x hidden" aria-hidden="true"></i>
                            <div class=album-holder><img src="${videoImg}"></div>
                        </td>
                        <td>
                            <p class="artist-name">${vidChannelTitle}</p>
                            <h5 class="song-name">${vidTitle}</h5>
                        </td>
                        <td>
                            <div class="time-holder">${videoDuration}</div>                       
                            <button class="add-button btn btn-primary yt-add-song">Add</button>
                            
                        </td>
                    </tr>`); 
                })
            })
            //$($videoContainer).wrap('<div class="scrollable"></div>')
    })
}

// Pagination button functions 
function getNext () {
    makeSearchRequest(window.nextPageToken);
}

function getPrev () {
    makeSearchRequest(window.prevPageToken);
}

document.getElementById("next").addEventListener("click", getNext)
document.getElementById("prev").addEventListener("click", getPrev)