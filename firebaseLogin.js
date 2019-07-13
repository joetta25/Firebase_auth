// Initialize Firebase
firebase.initializeApp(firebaseConfig);

//Get Elements
var emailText = document.getElementById("email");
var passwordText = document.getElementById("password");
var loginForm = document.getElementById("mainForm");

//
if (loginForm) {
  // We add an eventlistener to the logInForm and listen for a submit event
  loginForm.addEventListener("submit", e => {
    e.preventDefault();

    // this will get the values of email and passowrd
    const email = emailText.value;
    const password = passwordText.value;

    // this function will signIn an existing user and return a promise where you can resolve that user
    const promise = firebase
      .auth()
      .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
      .then(function() {
        return firebase.auth().signInWithEmailAndPassword(email, password);
      });

    promise.catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;

      // if the user entered the wrong email or password this msg will displayed in the form
      // user enter the wrong email or password
      //
      document.getElementById("alert").style.display = "block";

      // ...
    });
  });
}

// this method will monitor authentication state
firebase.auth().onAuthStateChanged(function(user) {
  // if the user is signed in, it will...
  if (user) {
    console.log(user);

    // redirect user to this location
    window.location = "http://159.203.185.216:8899/animation.html";

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
