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

document.body.style.display = "none";

var groupUID = localStorage.getItem("groupUID");
getEntry(localStorage.getItem("currentEntryKey"));

var editingEntry = true;

var editEntryButton = document.getElementById("editEntryButton");
editEntryButton.onclick = function() {

    window.location.href = "editEntry.html";

}

var deleteEntryButton = document.getElementById("deleteEntryButton");

deleteEntryButton.onclick = function() {
	
}

function getEntryName(entry) {
	var people = entry.people;
	var entryName = "The " + entry.name + " Family";
	people.forEach(
		function(person) {	
			if (person.type == "Single") {
				entryName = person.name + " " + entry.name;
			}
		}
	);
	return entryName;
}

function compare(a, b) {
  if (a.birthOrder < b.birthOrder)
    return -1;
  if (a.birthOrder > b.birthOrder)
    return 1;
  return 0;
}

function addPhone(entry) {

	var entryDetails = document.getElementById("entryDetails");

	if (entry.phone != "") {

		var newHeader = document.createElement("p");
		newHeader.setAttribute("class", "boldHeader");
		newHeader.innerText = "Home Phone";

		var newDiv = document.createElement("div");
		newDiv.setAttribute("class", "detailDiv");
		homePhone = document.createElement("p");
		homePhone.setAttribute("class", "detailLine");
		homePhone.innerText = entry.phone;
    	newDiv.appendChild(homePhone);
    	entryDetails.appendChild(newHeader);
    	entryDetails.appendChild(newDiv);

	}

}

function addEmail(entry) {

	var entryDetails = document.getElementById("entryDetails");

	if (entry.email != "") {

		var newHeader = document.createElement("p");
		newHeader.setAttribute("class", "boldHeader");
		newHeader.innerText = "Email";

		var newDiv = document.createElement("div");
		newDiv.setAttribute("class", "detailDiv");
		entryEmail = document.createElement("p");
		entryEmail.setAttribute("class", "detailLine");
		entryEmail.innerText = entry.email;
    	newDiv.appendChild(entryEmail);
    	entryDetails.appendChild(newHeader);
    	entryDetails.appendChild(newDiv);
    	
	}

}

function addAddress(entry) {

	var entryDetails = document.getElementById("entryDetails");

	if (entry.street != "") {

		var newHeader = document.createElement("p");
		newHeader.setAttribute("class", "boldHeader");
		newHeader.innerText = "Address";

		var newDiv = document.createElement("div");
		newDiv.setAttribute("class", "detailDiv");

		var street = document.createElement("p");
		street.setAttribute("class", "detailLine");
		street.innerText = entry.street;
		newDiv.appendChild(street);

		if (entry.line2 != "") {

			var line2 = document.createElement("p");
			line2.setAttribute("class", "detailLine");
			line2.innerText = entry.line2;
			newDiv.appendChild(line2);

		}

		if (entry.line3 != "") {

			var line3 = document.createElement("p");
			line3.setAttribute("class", "detailLine");
			line3.innerText = entry.line3;
			newDiv.appendChild(line3);

		}

		var cityStateZipString = "";
		if (!entry.city) {
			cityStateZipString = entry.state + " " + entry.zip;
		} else if (entry.city) {
			cityStateZipString = entry.city + ", " + entry.state + " " + entry.zip;
		} else {
			cityStateZipString = "";
		}

		var cityStateZip = document.createElement("p");
		cityStateZip.setAttribute("class", "detailLine");
		cityStateZip.innerText = cityStateZipString;
		newDiv.appendChild(cityStateZip);

		entryDetails.appendChild(newHeader);
		entryDetails.appendChild(newDiv);

	}

}

function addPeople(entry) {

	var entryDetails = document.getElementById("entryDetails");

	var adults = [];
	var children = [];
	
	entry.people.forEach(function(person) {
		if (person.type == "Child") {
			children.push(person);
		} else {
			adults.push(person);
		}
	});

	var newAdultsHeader = document.createElement("p");
	newAdultsHeader.setAttribute("class", "boldHeader");
	newAdultsHeader.innerText = "Adults";
	entryDetails.appendChild(newAdultsHeader);

	adults.forEach(function(adult) {
		addPerson(adult);
	});

	if (children.length > 0) {
		var newChildrenHeader = document.createElement("p");
		newChildrenHeader.setAttribute("class", "boldHeader");
		newChildrenHeader.innerText = "Children";
		entryDetails.appendChild(newChildrenHeader);

		children.sort(compare);
	
		children.forEach(function(child) {
			addPerson(child);
		});
	}

}

function addPerson(person) {

	var newDiv = document.createElement("div");
	newDiv.setAttribute("class", "detailDiv");

	var name = document.createElement("p");
	name.setAttribute("class", "detailLine");
	name.innerText = person.name;
	newDiv.appendChild(name);

	if (person.phone != "") {

		var phone = document.createElement("p");
		phone.setAttribute("class", "detailLine");
		phone.innerText = person.phone;
		newDiv.appendChild(phone);

	}

	if (person.email != "") {

		var email = document.createElement("p");
		email.setAttribute("class", "detailLine");
		email.innerText = person.email;
		newDiv.appendChild(email);

	}

	entryDetails.appendChild(newDiv);

}

function getEntry(uid) {

  	var ref = firebase.database().ref("Directories").child(groupUID).child(uid);

  	ref.on("value", function(entry) {

        var people = [];
        entry.child('People').forEach(function(person) {
            var newPerson = {
              	name: person.child('name').val(), 
                type: person.child('type').val(), 
                phone: person.child('phone').val(),
                email: person.child('email').val(), 
                birthOrder: person.child('birthOrder').val(), 
             };
            people.push(newPerson);
        })

        var newEntry = {
            key: entry.key,
            name: entry.child('name').val(),
            phone: entry.child('phone').val(),
            email: entry.child('email').val(),
            street: entry.child('Address').child('street').val(),
            line2: entry.child('Address').child('line2').val(),
            line3: entry.child('Address').child('line3').val(),
            city: entry.child('Address').child('city').val(),
            state: entry.child('Address').child('state').val(),
            zip: entry.child('Address').child('zip').val(),
            people: people
        };

     	currentEntry = newEntry;
     	console.log(currentEntry);
     	localStorage.setItem("currentEntry", JSON.stringify(currentEntry));

 		var entryName = document.getElementById("entryName");
		entryName.innerText = getEntryName(currentEntry);

		addPhone(currentEntry);
		addEmail(currentEntry);
		addAddress(currentEntry);
		addPeople(currentEntry);

		document.body.style.display = "";

	});

}