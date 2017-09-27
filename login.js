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

	var email = document.getElementById("emailBox").value;
	var password = document.getElementById("passwordBox").value;

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

var submitButton = document.getElementById("createAccountButton");
submitButton.onclick = function() {

	var firstName = document.getElementById("firstNameBox").value;
	var lastName = document.getElementById("lastNameBox").value;
	var email = document.getElementById("newEmailBox").value;
	var password = document.getElementById("newPasswordBox").value;
	var passwordVerification = document.getElementById("verifyPasswordBox").value

	if (firstName == "") {
		alert("You must provide a first name.");
		return;
	}

	if (lastName == "") {
		alert("You must provide a last name.");
		return;
	}

	if (email == "") {
		alert("You must provide an email.");
		return;
	}

	if (password == "") {
		alert("You must set a password.");
		return;
	}

	if (passwordVerification == "") {
		alert("You must verify your password.");
		return;
	}

	if (password != passwordVerification) {
		alert("Your passwords don't match.");
	}

	var newUser = {};
	var fullName = firstName.trim() + " " + lastName.trim();
	newUser["name"] = fullName;

	firebase.auth().createUserWithEmailAndPassword(email, password)

	.then(function(user) {

		user.updateProfile({displayName: fullName})

		.then(function() {

			const userRef = firebase.database().ref().child("Users").child(user.uid);
        	userRef.set(newUser, function(error) {
        		if (error) {
        			console.log(error);
        		} else {
        			loader.style.display = "none";
					window.location.href = "myGroups.html";
        		}
            });

		}).catch(function(error) {
			alert(error.message);
		});

	})

	.catch(function(error) {
  		alert(error.message);
	});

}

function forgotPasswordPressed() {

	var email = document.getElementById("emailBox").value;

	if (email == "") {
		alert("You must provide an email.");
		return;
	}

	if (confirm("Send password reset email to " + email + "?")) {

		firebase.auth().sendPasswordResetEmail(email).then(function() {
	  		alert("A password reset email has been sent to " + email + ".");
		}).catch(function(error) {
	  		alert(error.message)
		});

	}
}