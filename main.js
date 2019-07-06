$(document).ready(function(){
    firebase.initializeApp(firebaseConfig);
    var scope = [''].join(' ');

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
        checkAuth(hashMap.access_token)
    }
})

var firebase_user = null;

function AddSpotifyToken(token) {
    var params = {
        'token' : token,
        'created' : new Date().getTime() / 1000,
        'valid' : true,};
    $.ajax({
    url: `https://signupform-96aeb.firebaseio.com/users/${firebase_user.uid}/spotify_token.json`,
    type: "POST",
    data: JSON.stringify(params),
    success: function () {
    alert("success");
    window.location="http://127.0.0.1:8899/animation.html";
    },
    error: function(error) {
    console.log(error)
    alert("error: "+error);
    }
});
}


function checkAuth(token) {
    firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        firebase_user = user;
    //$('#noauth').modal('show');
    }
    else {
    alert('creating user');
    const email ='antony.tsygankov@gmail.com';
    const pswd ='football1924';
    const promise = firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(function(){signInWithEmailAndPassword(email, pswd)})
    promise.catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode);
        console.log(errorMessage);
        // ...
    });
    firebase_user = firebase.auth().currentUser;
}
    AddSpotifyToken(token);
});
};