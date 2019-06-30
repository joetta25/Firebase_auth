// // Your web app's Firebase configuration

// // Initialize Firebase
// firebase.initializeApp(firebaseConfig);

// // Initialize the FirebaseUI Widget using Firebase.
// var ui = new firebaseui.auth.AuthUI(firebase.auth());

// document.getElementById('loginBtn').addEventListener('click', () => {
//     ui.start('#firebaseui-auth-container', {
//         signInFlow: 'popup',
//         signInSuccessUrl: './login.html',
//         signInOptions: [
//             firebase.auth.EmailAuthProvider.PROVIDER_ID
//         ],

//     });
// })

// var uiConfig = {
//     callbacks: {
//         signInSuccessWithAuthResult: function (authResult, redirectUrl) {
//             // User successfully signed in.
//             // Return type determines whether we continue the redirect automatically
//             // or whether we leave that to developer to handle.
//             return true;
//         },
//         uiShown: function () {
//             // The widget is rendered.
//             // Hide the loader.
//             document.getElementById('loader').style.display = 'none';
//         }
//     },
//     // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
//     signInFlow: 'popup',
//     signInSuccessUrl: './dashboard.html',
//     signInOptions: [
//         // Leave the lines as is for the providers you want to offer your users.
//         // firebase.auth.GoogleAuthProvider.PROVIDER_ID,
//         // firebase.auth.FacebookAuthProvider.PROVIDER_ID,
//         // firebase.auth.TwitterAuthProvider.PROVIDER_ID,
//         // firebase.auth.GithubAuthProvider.PROVIDER_ID,
//         firebase.auth.EmailAuthProvider.PROVIDER_ID,
//         // firebase.auth.PhoneAuthProvider.PROVIDER_ID
//     ],
//     // Terms of service url.
//     tosUrl: '<your-tos-url>',
//     // Privacy policy url.
//     privacyPolicyUrl: '<your-privacy-policy-url>'
// };

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
      // ...
    });
  });
}

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    console.log(user);

    // redirect user to this location
    location = `./dashboard.html`;

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
