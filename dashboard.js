




//Initialize Firebase
$(document).on('click', '.add-spot-song',function(){ // once the page load then do this 
  let track_id = $(this).closest('.spot-song')[0].id; // this = to the action that happens once button is push , once the button is pushed then get the information thats inside of the spot id
  let track = $(`#${track_id}`).html() // this action or data will be on the html page
  let track_uri = $(`#${track_id}`).attr('value') // get the data that is inside of the value attribute 
  let duration = $(track).attr('value')
  let artist = $(`#${track_id} .artist-name`).text() // this is grabbing the data that is in artist-name class 
  let song_cover = $(`#${track_id} img`).attr('src'); // this is grabbing all the data thats in the image element 
  let song_name = $(`#${track_id} .song`).text() // this is grabbing all the data thats in the song class 
  let songhtml = `<tr "value="${track_uri}" id="${track_id}">
                <td class="album" value="${duration}">
                    <i class="fa fa-play-circle fa-3x hidden" aria-hidden="true"></i>
                    <div class=album-holder><img src="${song_cover}"></div>
                </td>
                <td>
                    <p class="artist-name">${artist}</p>
                    <h5 class="song-name">${song_name}</h5>
                </td>
                <td>
                    <div class="time-holder">
                    ${duration}
                    </div>
                </td>
        </tr>`
        $('.userSongs').append(songhtml);
        


})
function saveUserPlaylist(uri) {
  var song = spotifyTracks.tracks.items.find(function(currentSong){
    return currentSong.uri == uri;
  })
  console.log(song);
} 


firebase.initializeApp(firebaseConfig);

document.getElementById("logOutBtn").addEventListener("click", e => {
  firebase.auth().signOut();
});

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

//Spotify
// Set up app config
var page_count = 0;
var next_url = '';
var prev_url = '';
var client_id = "57a5ae8651d746c3b9b1fcb24561af24";
var response_type = "token";
var redirect_uri = "http://127.0.0.1:5501/dashboard.html";
var scope = [""].join(" ");


// get auth code from url hash
var hash = window.location.hash.substr(1).split("&");
var hashMap = [];
// break the hash into pieces to get the access_token
if (hash.length) {
  hash.forEach(chunk => {
    const chunkSplit = chunk.split("=");
    hashMap[chunkSplit[0]] = chunkSplit[1];
  });
}

// if the hash has an access_token, then put it in localStorage
if (hashMap.access_token) {
  window.localStorage.setItem("token", hashMap.access_token);
  window.location = window.location.origin + window.location.pathname;
}

// add event listener for login
$(".login").on("click", function(e) {
  //build spotify auth url
  var url = `https://accounts.spotify.com/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scope}&response_type=${response_type}`;

  // send the user to the spotify login page
  window.location = url;
});

// get the token from localStorage (if it exitst)
var token = window.localStorage.getItem("token");

// if the token is set, then we are probably logged in
if (token !== null) {
  // so change the login button text
  $(".login").text("Refresh Spotify Login");
}


// when the form is submitted

$(".search-form").on("submit", function(e) {

  e.preventDefault();
  // get the search value from the search field
  var value = $('#searchname').val();
  // if the value is not empty
  if (value != '') {
      // get the search request from spotify
    $.ajax(`https://api.spotify.com/v1/search?q=${value}&type=track&limit=5`,{
      headers: {
              'Authorization': `Bearer ${token}` // this is where we use the access_token
          }
        
      })
      .then(renderSpotifyResults)
  }
})
function renderSpotifyResults(data) { // when the search request is finished // log the data to the console//console.log(data);
  window.spotifyTracks = data;
  let html = '';
  next_url = data.tracks.next;
  prev_url = data.tracks.previous;
  var track_count = 0;
  if (data.tracks.items.length > 0) {
      var songsHTML = data.tracks.items.map(track => {
        track_count ++;
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
        <div class = "spot-song search-bar spot item" id = "spot-${track_count}"> 
          <div class = "album">
            <img  class = "mb-1" width = "50" src = ${track.album.images[0].url} value= "${track.album.external_urls.spotify}"/>
            <h3 class = "d-inline-block artist-name">${artistsString}</h3>
          </div>
          <div class = "song d-flex justify-content-between border-top border-bottom py-3">
            <b>${track.name}</b>
            <button class="btn btn-primary add-spot-song" type="button" $(document).on('click', '.play-song', function(){>add</button>
          </div>
        </div>
                `
      })// spot equals to the first spot-song in the music container 
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
    .then(renderSpotifyResults)// this will call the rest of the data once the next request is complete 
  });
$('.previous').click((e)=> { // creating the event listener 
  e.preventDefault();// stops the page from refreshing
  $.ajax(prev_url,{
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }) 
  .then(renderSpotifyResults) // this will call the rest of the data once the next request is complete 
})

// tabs function ---------------------------------------
$(document).ready(function(){
  setupSpotifyNav();
})
function setupSpotifyNav() {
  console.log(0);
  // this will deactivate and activate the tabs once clicked and also have the log out method 
  $('.spotify-nav .nav-item') . click(function(){ // this is creating a event listener fo the container and each tab
    console.log(1);
  $('.spotify-container .nav-item').removeClass('active') // everythings is unselected  once the tab is clicked 
  $(this).addClass('active'); // this refers to nav-item ( account , search , likes), if one of these are clicked switch to active 
  changeSpotifyTab(this.id); // and then change to the spotify tabs (account , search, likes)
  console.log(2);
  })
  $('.logout').click(function(){SpotifyLogout()})
};

function changeSpotifyTab(id) {
  console.log(id);
  $('.spot-item').hide();
  $(`#${id}-tab`).show();
}






// Youtube
// Use localhost port 8888
// const ytApiKey = "AIzaSyDHaIMUkv2DdX8RqP0rmf8QIhcCg_5KU08"; API is over quota limit
const ytApiKey = "AIzaSyCw7Gw6BDPrcRiqjfTMfDckh_11BKWl7HM"
const ytCLIENT_ID = "976539214773-2gpmtmkm9phb43cir7mdgfjfl4cus9vr.apps.googleusercontent.com";
const ytDISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest'];
const ytSCOPES = 'https://www.googleapis.com/auth/youtube.readonly';


const authorizeButton = document.getElementById('authorize-button');
const signoutButton = document.getElementById('signout-button');
const content = document.getElementById('content');
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const videoContainer = document.getElementById('video-container');
const searchTerm = document.querySelector('search-input');


// Form submit 
searchForm.addEventListener('submit', e => {
    e.preventDefault();
    makeRequest();
});

// Load auth2 library
function handleClientLoad() {
  gapi.load('client:auth2', initClient);
}

// Init API client
function initClient() {
  gapi.client
      .init({
        discoveryDocs: ytDISCOVERY_DOCS,
        clientId: ytCLIENT_ID,
        scope: ytSCOPES
      })
      .then(() => {
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        authorizeButton.onclick = handleAuthClick;
        signoutButton.onclick = handleSignoutClick;
      });
}

// Hide and unhide elements based on login state
function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
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


// Login and Logout
function handleAuthClick() {
    gapi.auth2.getAuthInstance().signIn();
}
function handleSignoutClick() {
    gapi.auth2.getAuthInstance().signOut();
}

function searchList() {
    gapi.client.setApiKey(ytApiKey); 
    gapi.client.load('youtube', 'v3', function() {
        makeRequest();
    });
}

function makeRequest(token) {
    var q = $('#search-input').val().toLowerCase();
    
    // make API search request
    var searchRequest = gapi.client.youtube.search.list({
        q: q,
        part: 'snippet', 
        type: 'video',
        maxResults: 5,
        pageToken: token 
    })

    searchRequest.execute(function(response)  {                                                                                    
            $('#video-container').empty()
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
                var vidTitle = item.snippet.title;  
                var videoId = item.id.videoId;
                var videoImg = item.snippet.thumbnails.default.url;  
                
                // make API video request in order to get duration
                var detailsRequest = gapi.client.youtube.videos.list({
                    id: videoId,
                    part: 'contentDetails', 
                    type: 'video',
                    maxResults: 5
                })

                detailsRequest.execute(function(details) {
                  var videoDuration = ISO8601toDuration(details.items[0].contentDetails.duration);

                  // Check index of returned YT ISO8601 time format and trim
                  function formatTimeUnit(input, unit){
                      var index = input.indexOf(unit);
                      var output = "00"
                      if (index < 0) {
                          return output; // unit isn't in the input
                      }
                      if (isNaN(input.charAt(index-2))) {
                          return '0' + input.charAt(index-1);
                      } else {
                          return input.charAt(index-2) + input.charAt(index-1);
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

                    $videoContainer.append(`
                        <div class="container">
                            <img src="${videoImg}"/>
                            ${vidTitle}
                            ${videoDuration}
                            <button src="https://www.youtube.com/watch?v=${videoId}">Add</button>
                            ${videoId}
                        </div>`);    
                })
            })
    })
}

function getNext () {
    makeRequest(window.nextPageToken);
}

function getPrev () {
    makeRequest(window.prevPageToken);
}

document.getElementById("next").addEventListener("click", getNext)
document.getElementById("prev").addEventListener("click", getPrev)
