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

localStorage.setItem("groups", "null");

var storage = firebase.storage();

var title = document.getElementById('title');
var ref = firebase.database().ref("Groups")

ref.once("value").then(function(snapshot) {
  var groups = [];
  var position = 0;
  snapshot.forEach(function(childSnapshot) {

    var group = {
     uid: childSnapshot.key,
  	 name: childSnapshot.child('name').val(),
     city: childSnapshot.child('city').val(),
     state: childSnapshot.child('state').val(),
  	 createdBy: childSnapshot.child('createdBy').val(),
     createdByUid: childSnapshot.child('createdByUid').val(),
     password: childSnapshot.child('password').val(),
  	 admins: childSnapshot.child('admins'),
     users: childSnapshot.child('users')
    };

    addRow(group.uid, group.name, group.city, group.state, group.createdBy, position);
    groups.push(group);
    position++;
  })

  localStorage.setItem("groups", JSON.stringify(groups));

  addRowHandlers();
  var loader = document.getElementById('loader');
  loader.style.display = "none"

});

function search() {
    var search = document.getElementById("search");
    filter = search.value.toLowerCase();
    table = document.getElementById("groupsTable");
    rows = table.getElementsByTagName("tr");
    for (i = 0; i < rows.length; i++) {
        var cell = rows[i].getElementsByTagName("td")[1];
        var header = cell.getElementsByTagName("p")[0];
        if (header.innerText.toLowerCase().indexOf(filter) > -1) {
            rows[i].style.display = "";
        } else {
            rows[i].style.display = "none";
        }
    }
}

function addRow(uid, name, city, state, createdBy, position) {

  if (!document.getElementsByTagName) return;

    tabBody=document.getElementsByTagName("tbody").item(0);

    row=document.createElement("tr");

    var pathReference = storage.ref(uid + ".jpg");
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
    nameElement.setAttribute("class", "groupHeader");
    nameNode = document.createTextNode(name);
    nameElement.appendChild(nameNode);
    textCell.appendChild(nameElement);

    locElement = document.createElement("p");
    locElement.setAttribute("class", "loc");
    locNode = document.createTextNode(city + ", " + state);
    locElement.appendChild(locNode);
    textCell.appendChild(locElement);

    createdByElement = document.createElement("p");
    createdByElement.setAttribute("class", "createdBy");
    createdByNode = document.createTextNode("Created by " + createdBy);
    createdByElement.appendChild(createdByNode);
    textCell.appendChild(createdByElement);

    row.appendChild(imageCell);
    row.appendChild(textCell);

    tabBody.appendChild(row);

}

function addRowHandlers() {

  var table = document.getElementById("groupsTable");
  var rows = table.getElementsByTagName("tr");

  for (i = 0; i < rows.length; i++) {

    var currentRow = table.rows[i];
    var createClickHandler = function(row) {
      return function() {

        var cell = row.getElementsByTagName("td")[1];
        var position = row.rowIndex;
        var name = cell.getElementsByTagName("p")[0].innerText;
        var modal = document.getElementById('myModal');
			  var span = document.getElementsByClassName("close")[0];
			  var passwordField = document.getElementById('passwordField');
			  passwordField.placeholder = "Password";
        var submitButton = document.getElementById('submitButton');
				var passwordPrompt = document.getElementById('passwordPrompt');
				passwordPrompt.innerHTML = "PIN Required - Please enter the Access PIN for the directory of " + name + ":";
        var verification = document.getElementById('verification');

        var storedGroups = JSON.parse(localStorage.getItem("groups"));
        var group = storedGroups[position];

        modal.style.display = "block";

				span.onclick = function() {

    			modal.style.display = "none";
        	passwordField.value = "";
        	verification.innerText = "";

				}

  			window.onclick = function(event) {

      		if (event.target == modal) {
          	modal.style.display = "none";
          	passwordField.value = "";
          	verification.innerText = "";
      		}

  			}

  			submitButton.onclick = function() {

  				if (group.password == passwordField.value) {
  					verification.innerText = "";

            localStorage.setItem("group", JSON.stringify(group));
            var search = document.getElementById("search");
            search.value = "";
            window.location.href = "directory.html";
  				} else {
  					verification.innerText = "Incorrect Password.";
  				}

  			}

      };

    };
      
    currentRow.onclick = createClickHandler(currentRow);

  }

}