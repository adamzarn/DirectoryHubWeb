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

var storage = firebase.storage();

var title = document.getElementById('title');
var ref = firebase.database().ref("Churches").orderByKey();

ref.once("value").then(function(snapshot) {
  var churches = [];
  var position = 0;
  snapshot.forEach(function(childSnapshot) {

    var church = {
  	 name: childSnapshot.key,
  	 loc: childSnapshot.child('location').val(),
  	 password: childSnapshot.child('password').val(),
  	 adminPassword: childSnapshot.child('adminPassword').val()
    };

    addRow(church.name, church.loc, position);
    churches.push(church);
    position++;
  })

  localStorage.setItem("churches", JSON.stringify(churches));

  addRowHandlers();
  var loader = document.getElementById('loader');
  loader.style.display = "none"

});

function addRow(name, location, position) {

  if (!document.getElementsByTagName) return;

    tabBody=document.getElementsByTagName("tbody").item(0);

    row=document.createElement("tr");


    var pathReference = storage.ref(name + ".jpg");
    imageCell = document.createElement("td");
    imageCell.setAttribute("class", "imageCell");
    imageElement = document.createElement("img");
    imageElement.setAttribute("id", "imageElement" + position);
      pathReference.getDownloadURL().then(function(url) {
        document.getElementById("imageElement" + position).src = url;
      }).catch(function(error) {
        console.log(error);
      });
    imageCell.appendChild(imageElement);

    textCell = document.createElement("td");
    textCell.setAttribute("class", "cell");
      nameElement = document.createElement("p");
      nameElement.setAttribute("class", "nameHeader");
      nameNode = document.createTextNode(name);
      nameElement.appendChild(nameNode);
      textCell.appendChild(nameElement);

      locElement = document.createElement("p");
      locNode = document.createTextNode(location);
      locElement.appendChild(locNode);
      textCell.appendChild(locElement);

    row.appendChild(imageCell);
    row.appendChild(textCell);

    tabBody.appendChild(row);

	}

function addRowHandlers() {

  var table = document.getElementById("churchesTable");
  var rows = table.getElementsByTagName("tr");

  for (i = 0; i < rows.length; i++) {

    var currentRow = table.rows[i];
    var createClickHandler = function(row) {
      return function() {

        var cell = row.getElementsByTagName("td")[1];
        var position = row.rowIndex;
        console.log("Position: "+position);
        var name = cell.getElementsByTagName("p")[0].innerText;
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
  				var church = storedChurches[position];
  				var passwordField = document.getElementById('passwordField');
  				var verification = document.getElementById('verification');

  				if (church.password == passwordField.value) {
  					verification.innerText = "";
            localStorage.setItem('church', church.name);
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