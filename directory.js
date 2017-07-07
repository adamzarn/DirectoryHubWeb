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
var ref = firebase.database().ref("Valleybrook Community Church/Directory");

ref.once("value").then(function(snapshot) {
  var families = [];
  snapshot.forEach(function(childSnapshot) {

    var family = {
  	 name: childSnapshot.child('name').val(),
  	 phone: childSnapshot.child('phone').val(),
  	 email: childSnapshot.child('email').val(),
    };

    addRow(family.name, family.phone, family.email);
    families.push(family);
  })

  localStorage.setItem("families", JSON.stringify(families));

  addRowHandlers();
  var loader = document.getElementById('loader');
  loader.style.display = "none"

});

function addRow(name, phone, email) {

  if (!document.getElementsByTagName) return;

    tabBody=document.getElementsByTagName("tbody").item(0);

    row=document.createElement("tr");

    cell = document.createElement("td");
   	cell.setAttribute("class", "cell");
    	nameElement = document.createElement("p");
    	nameElement.setAttribute("class", "nameHeader");
    	nameNode = document.createTextNode(name);
    	nameElement.appendChild(nameNode);
    	cell.appendChild(nameElement);

    	if (phone != "") {
    		phoneElement = document.createElement("p");
    		phoneElement.setAttribute("class", "line");
    		phoneNode = document.createTextNode(phone);
    		phoneElement.appendChild(phoneNode);
    		cell.appendChild(phoneElement);
    	}

    	if (email != "") {
    		emailElement = document.createElement("p");
    		emailElement.setAttribute("class", "line");
    		emailNode = document.createTextNode(email);
    		emailElement.appendChild(emailNode);
    		cell.appendChild(emailElement);
    	}

    if (email != "") {
    	emailElement.setAttribute("class", "lastLine");
    } else if (phone != "") {
    	phoneElement.setAttribute("class", "lastLine");
    }

    row.appendChild(cell);

    tabBody.appendChild(row);

	}

function addRowHandlers() {

  var table = document.getElementById("directoryTable");
  var rows = table.getElementsByTagName("tr");

  for (i = 0; i < rows.length; i++) {

    var currentRow = table.rows[i];
    var createClickHandler = function(row) {
    	return function() {

        	var cell = row.getElementsByTagName("td")[0];
        	var position = row.rowIndex;
        	var name = cell.innerHTML;
        	console.log(position);

        	var storedFamilies = JSON.parse(localStorage.getItem("families"));
        	var family = storedFamilies[position-1];
        	console.log(family.name);
        	console.log(family.phone);
        	console.log(family.email);

       	};
  	};
  	currentRow.onclick = createClickHandler(currentRow);
  }
}