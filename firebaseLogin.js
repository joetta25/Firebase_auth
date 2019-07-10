// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var emailText = document.getElementById("email");
var passwordText = document.getElementById("password");
var loginForm = document.getElementById("mainForm");

if (loginForm) {
  loginForm.addEventListener("submit", e => {
    e.preventDefault();

    const email = emailText.value;
    const password = passwordText.value;

    const promise = firebase.auth().signInWithEmailAndPassword(email, password);
    promise.catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      document.getElementById("alert").style.display = "block";
      // ...
    });
  });
}

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    console.log(user);

    // redirect user to this location
    window.location = "dashboard.html";

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
  }
});
