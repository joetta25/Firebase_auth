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

    // this function will signIn an existing user and return a promise where you can resolve that user
    const promise = firebase
      .auth()
      .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
      .then(function() {
        // Existing and future Auth states are now persisted in the current
        // session only. Closing the window would clear any existing state even
        // if a user forgets to sign out.
        // ...
        // New sign-in will be persisted with session persistence.
        return firebase.auth().signInWithEmailAndPassword(email, password);
      });

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
