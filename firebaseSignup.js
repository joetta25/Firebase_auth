// Initialize Firebase
firebase.initializeApp(firebaseConfig);

let submitForm = document.getElementById("signUpForm");

submitForm.addEventListener("submit", e => {
  e.preventDefault();
  let name = document.getElementById("name").value;
  let email = document.getElementById("email").value;
  let password = document.getElementById("pass").value;
  let phoneNumber = document.getElementById("phone").value;
  console.log(email, password);

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
    });

  document.getElementById("alert").style.display = "block";

  setTimeout(() => {
    document.getElementById("alert").style.display = "none";
  }, 2000);

  document.getElementById("signUpForm").reset();
});
