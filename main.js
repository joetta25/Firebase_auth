// const keys = require('./keys.js');
// var firebase = require('firebase');
// console.log(keys.rest_api);
// firebase.initializeApp(firebaseConfig);
$(document).ready(function(){
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
        window.localStorage.setItem('token', hashMap.access_token);
        window.location = window.location.origin + window.location.pathname;
        alert("success");
    }
    window.location="http://127.0.0.1:8899/animation.html"
})