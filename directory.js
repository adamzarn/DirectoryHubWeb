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

var church = JSON.parse(localStorage.getItem("church"));
console.log(church);
var switchChurchesButton = document.getElementById("switchChurchesButton");

switchChurchesButton.onclick = function() {
  localStorage.setItem('families', 'null')
  var search = document.getElementById("search");
  search.value = "";
	window.location.href = "index.html";
}

function search() {
    var search = document.getElementById("search");
    filter = search.value.toLowerCase();
    table = document.getElementById("directoryTable");
    rows = table.getElementsByTagName("tr");
    for (i = 0; i < rows.length; i++) {
        var cell = rows[i].getElementsByTagName("td")[0];
        var header = cell.getElementsByTagName("p")[0];
        if (header.innerText.toLowerCase().indexOf(filter) > -1) {
            rows[i].style.display = "";
        } else {
            rows[i].style.display = "none";
        }
    }
}

var addFamilyButton = document.getElementById("addFamilyButton");

addFamilyButton.onclick = function() {

    var modal = document.getElementById('myModal');
    var span = document.getElementsByClassName("close")[0];
    var passwordField = document.getElementById('passwordField');
    passwordField.placeholder = "Password";
    var submitButton = document.getElementById('submitButton');
    var passwordPrompt = document.getElementById('passwordPrompt');
    passwordPrompt.innerHTML = "You must enter your church's Administrator Password to add a family:";
    var verification = document.getElementById('verification');

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
          passwordField.value = "";
          verification.innerText = "";
      }

    }

    submitButton.onclick = function() {

      if (church.adminPassword == passwordField.value) {
        verification.innerText = "";
          var currentFamily = {
            key: "",
            name: "",
            phone: "",
            email: "",
            street: "",
            line2: "",
            line3: "",
            city: "",
            state: "IL",
            zip: "",
            people: []
          };

          localStorage.setItem("currentFamily", JSON.stringify(currentFamily));
          var search = document.getElementById("search");
          search.value = "";
          window.location.href = "editFamily.html"
      } else {
        verification.innerText = "Incorrect Password.";
      }

    }

}

if (church == null) {
  var search = document.getElementById("search");
  search.value = "";
	window.location.href = "index.html"
}

var families = JSON.parse(localStorage.getItem("families"));
if (families == null) {
    getDirectory()
} else {
    var churchName = document.getElementById('churchName');
    churchName.innerHTML = church.name;
    families.forEach(function(family) {
        addRow(family.key, family.name, family.phone, family.email, family.street, family.line2, family.line3, family.city, family.state, family.zip, family.people);
    });
    addRowHandlers();
    var loader = document.getElementById('loader');
    loader.style.display = "none"
}

function header(name, people) {
	var husband = "";
	var wife = "";
	var single = "";
	people.forEach(function(person) {
		if (person.type == "Husband") {
			husband = person.name;
		} else if (person.type == "Wife") {
			wife = person.name;
		} else if (person.type == "Single") {
			single = person.name;
		}
	})
	if (husband != "") {
		return name + ", " + husband + " & " + wife;
	} else {
		return name + ", " + single;
	}
}

function childrenString(people) {
	people.sort(compareBirthOrders);
	children = [];
	people.forEach(function(person) {
		if (person.type == "Child") {
			children.push(person.name);
		}
	})
	if (children.length == 1) {
		return children[0];
	} else if (children.length == 2) {
		return children[0] + " & " + children[1];
	} else if (children.length > 2) {
		var childrenString = children[0];
		for (i = 1; i < children.length; i++) {
			if (i < children.length - 1) {
				childrenString = childrenString + ", " + children[i];
			} else {
				childrenString = childrenString + ", & " + children[i];
			}
		}
		return childrenString;
	} else {
		return "";
	}
	return "";
}

function compareBirthOrders(a, b) {
  if (a.birthOrder < b.birthOrder)
    return -1;
  if (a.birthOrder > b.birthOrder)
    return 1;
  return 0;
}

function compareLastNames(a, b) {
  if (a.name < b.name)
    return -1;
  if (a.name > b.name)
    return 1;
  return 0;
}

function addRow(key, name, phone, email, street, line2, line3, city, state, zip, people) {

  if (!document.getElementsByTagName) return;

    tabBody=document.getElementsByTagName("tbody").item(0);

    row=document.createElement("tr");

    cell = document.createElement("td");
   	cell.setAttribute("class", "cell");
    	nameElement = document.createElement("p");
    	nameElement.setAttribute("class", "nameHeader");
    	nameNode = document.createTextNode(header(name, people));
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

    	if (street != "") {
    		streetElement = document.createElement("p");
    		streetElement.setAttribute("class", "line");
    		streetNode = document.createTextNode(street);
    		streetElement.appendChild(streetNode);
    		cell.appendChild(streetElement);
    	}

    	if (line2 != "") {
    		line2Element = document.createElement("p");
    		line2Element.setAttribute("class", "line");
    		line2Node = document.createTextNode(line2);
    		line2Element.appendChild(line2Node);
    		cell.appendChild(line2Element);
    	}

    	if (line3 != "") {
    		line3Element = document.createElement("p");
    		line3Element.setAttribute("class", "line");
    		line3Node = document.createTextNode(line3);
    		line3Element.appendChild(line3Node);
    		cell.appendChild(line3Element);
    	}

      var cityStateZip = "";
      if (city != "") {
          cityStateZip = city + ", " + state + " " + zip;
      }

    	if (cityStateZip != "") {
    		cityStateZipElement = document.createElement("p");
    		cityStateZipElement.setAttribute("class", "line");
    		cityStateZipNode = document.createTextNode(cityStateZip);
    		cityStateZipElement.appendChild(cityStateZipNode);
    		cell.appendChild(cityStateZipElement);
    	}

    	var children = childrenString(people);
    	if (children != "") {
    		childrenStringElement = document.createElement("p");
    		childrenStringElement.setAttribute("class", "line");
    		childrenStringNode = document.createTextNode(children);
    		childrenStringElement.appendChild(childrenStringNode);
    		cell.appendChild(childrenStringElement);
    	}

    if (children != "") {
    	childrenStringElement.setAttribute("class", "lastLine");
    } else if (cityStateZip != "") {
    	cityStateZipElement.setAttribute("class", "lastLine");
    } else if (line3 != "") {
    	line3Element.setAttribute("class", "lastLine");
    } else if (line2 != "") {
    	line2Element.setAttribute("class", "lastLine");
    } else if (street != "") {
    	streetElement.setAttribute("class", "lastLine");
    } else if (email != "") {
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

        	var storedFamilies = JSON.parse(localStorage.getItem("families"));
        	var family = storedFamilies[position];

        	localStorage.setItem("currentFamily", JSON.stringify(family));
          var search = document.getElementById("search");
          search.value = "";
        	window.location.href = "family.html";

       	};
  	};
  	currentRow.onclick = createClickHandler(currentRow);
  }
}

function getDirectory() {

  var ref = firebase.database().ref(church.name + "/Directory");

  var churchName = document.getElementById('churchName');
  churchName.innerHTML = church.name;

    ref.on("value", function(snapshot) {
        var families = [];
        snapshot.forEach(function(family) {

            var people = [];
            family.child('People').forEach(function(person) {
                var newPerson = {
                  name: person.child('name').val(), 
                  type: person.child('type').val(), 
                  phone: person.child('phone').val(),
                  email: person.child('email').val(), 
                  birthOrder: person.child('birthOrder').val(), 
                };
                people.push(newPerson); 
            })

            var newFamily = {
                key: family.key,
                name: family.child('name').val(),
                phone: family.child('phone').val(),
                email: family.child('email').val(),
                street: family.child('Address').child('street').val(),
                line2: family.child('Address').child('line2').val(),
                line3: family.child('Address').child('line3').val(),
                city: family.child('Address').child('city').val(),
                state: family.child('Address').child('state').val(),
                zip: family.child('Address').child('zip').val(),
                people: people
            };

            families.push(newFamily);
  })

  families.sort(compareLastNames);

  families.forEach(function(newFamily) {
    addRow(newFamily.key, newFamily.name, newFamily.phone, newFamily.email, newFamily.street, newFamily.line2, newFamily.line3, newFamily.city, newFamily.state, newFamily.zip, newFamily.people);
  });

  localStorage.setItem("families", JSON.stringify(families));

  addRowHandlers();
  var loader = document.getElementById('loader');
  loader.style.display = "none"

});

}