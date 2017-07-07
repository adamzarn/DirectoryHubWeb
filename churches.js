// Initialize Firebase
var config = {
  apiKey: "AIzaSyDS6zch98V15uvpqsbKqnRrMnv3Ha_vMcA",
  authDomain: "valleybrookcommunitychur-77604.firebaseapp.com",
  databaseURL: "https://valleybrookcommunitychur-77604.firebaseio.com",
  projectId: "valleybrookcommunitychur-77604",
  storageBucket: "valleybrookcommunitychur-77604.appspot.com",
  messagingSenderId: "301967649981"
};

firebase.initializeApp(config);

var title = document.getElementById('title');
var ref = firebase.database().ref("Churches").orderByKey();

ref.once("value").then(function(snapshot) {
  var churches = [];
  snapshot.forEach(function(childSnapshot) {

    var church = {
  	 name: childSnapshot.key,
  	 loc: childSnapshot.child('location').val(),
  	 password: childSnapshot.child('password').val(),
  	 adminPassword: childSnapshot.child('adminPassword').val()
    };

    addRow(church.name, church.loc);
    churches.push(church);
  })

  localStorage.setItem("churches", JSON.stringify(churches));

  addRowHandlers();
  var loader = document.getElementById('loader');
  loader.style.display = "none"

});

function addRow(name, location) {

  if (!document.getElementsByTagName) return;

    tabBody=document.getElementsByTagName("tbody").item(0);

    row=document.createElement("tr");
    nameCell = document.createElement("td");
    locationCell = document.createElement("td");

    nameNode=document.createTextNode(name);
    locationNode=document.createTextNode(location);

    nameCell.appendChild(nameNode);
    locationCell.appendChild(locationNode);

    row.appendChild(nameCell);
    row.appendChild(locationCell);

    tabBody.appendChild(row);

	}

function addRowHandlers() {

  var table = document.getElementById("churchesTable");
  var rows = table.getElementsByTagName("tr");

  for (i = 0; i < rows.length; i++) {

    var currentRow = table.rows[i];
    var createClickHandler = function(row) {
      return function() {

        var cell = row.getElementsByTagName("td")[0];
        var position = row.rowIndex;
        var name = cell.innerHTML;
        var modal = document.getElementById('myModal');
			  var span = document.getElementsByClassName("close")[0];
			  var passwordField = document.getElementById('passwordField');
			  passwordField.placeholder = "Password";
        var submitButton = document.getElementById('submitButton');
				var passwordPrompt = document.getElementById('passwordPrompt');
				passwordPrompt.innerHTML = "To access the directory, enter the password for " + name + ":";

        modal.style.display = "block";

				span.onclick = function() {

    			modal.style.display = "none";
    			var passwordField = document.getElementById('passwordField');
        	passwordField.value = "";
        	verification.innerText = "";

				}

  			window.onclick = function(event) {

      		if (event.target == modal) {
          	modal.style.display = "none";
          	var passwordField = document.getElementById('passwordField');
          	passwordField.value = "";
          	verification.innerText = "";
      		}

  			}

  			submitButton.onclick = function() {

  				var storedChurches = JSON.parse(localStorage.getItem("churches"));
  				var church = storedChurches[position-1];
  				var passwordField = document.getElementById('passwordField');
  				var verification = document.getElementById('verification');

  				if (church.password == passwordField.value) {
  					verification.innerText = "Correct Password";
            window.location.href = "directory.html";
  				} else {
  					verification.innerText = "Incorrect Password. Try again.";
  				}

  			}

      };

    };
      
    currentRow.onclick = createClickHandler(currentRow);

  }

}