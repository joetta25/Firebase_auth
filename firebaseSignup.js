// Initialize Firebase
firebase.initializeApp(firebaseConfig);

//Get Element so we can add an eventlistener
let submitForm = document.getElementById("signUpForm");

// Reference msessages collection
var messagesRef = firebase.database().ref("user");

submitForm.addEventListener("submit", e => {
  e.preventDefault();

  // Get elements
  let name = document.getElementById("name").value;
  let email = document.getElementById("email").value;
  let password = document.getElementById("pass").value;
  let phoneNumber = document.getElementById("phone").value;

  // this function will create an user using email and password and it will also log them in, which will return a promise and  allows you to resolve the user's data
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // ...
      document.getElementById("error").innerHTML = errorCode;
      console.log(errorCode);
    })
    .then(function() {
      document.location.href = "http://159.203.185.216:8899/animation.html";
    });

  //function will be call when the form gets submitted
  //Save message, the user's data will be saved in firebase database

  saveMessage(name, email, password, phoneNumber);

  //the alert msg will be shown and hide in 2secs after you click submit
  document.getElementById("alert").style.display = "block";

  setTimeout(() => {
    document.getElementById("alert").style.display = "none";
  }, 2000);

  //will reset the submit form
  document.getElementById("signUpForm").reset();
});

// save the msg to firebase
//send an object of data to firebase database
function saveMessage(name, email, password, phoneNumber) {
  var newMessageRef = messagesRef.push();
  newMessageRef.set({
    name: name,
    email: email,
    password: password,
    phoneNumber: phoneNumber
  });
}
