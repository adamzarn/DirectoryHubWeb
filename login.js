// Initialize Firebase
var config = {
  apiKey: "AIzaSyDS6zch98V15uvpqsbKqnRrMnv3Ha_vMcA",
  authDomain: "valleybrookcommunitychur-77604.firebaseapp.com",
  databaseURL: "https://valleybrookcommunitychur-77604.firebaseio.com",
  projectId: "valleybrookcommunitychur-77604",
  storageBucket: "valleybrookcommunitychur-77604.appspot.com",
  messagingSenderId: "301967649981"
};

var loader = document.getElementById('loader');
loader.style.display = "none"

firebase.initializeApp(config);

var loginButton = document.getElementById("loginButton");
loginButton.onclick = function() {
	var emailBox = document.getElementById("emailBox");
	var passwordBox = document.getElementById("passwordBox");

	var email = emailBox.value;
	var password = passwordBox.value;

	firebase.auth().signInWithEmailAndPassword(email, password)

	.then(function(user) {

		loader.style.display = "none";
		window.location.href = "myGroups.html";

	}).catch(function(error) {

  		var errorCode = error.code;
  		var errorMessage = error.message;

  		alert(errorMessage);

	});

}