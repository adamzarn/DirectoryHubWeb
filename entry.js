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

var deleteEntryButton = document.getElementById("deleteEntryButton");
var editEntryButton = document.getElementById("editEntryButton");
var directoryButton = document.getElementById("directoryButton");
var loader = document.getElementById("entryLoader");
deleteEntryButton.style.display = "none";
editEntryButton.style.display = "none";
directoryButton.style.display = "none";
loader.style.display = "block";

var groupUID = localStorage.getItem("groupUID");
var currentEntryKey = localStorage.getItem("currentEntryKey");
getEntry(currentEntryKey);

var editingEntry = true;

editEntryButton.onclick = function() {
    window.location.href = "editEntry.html";
}
directoryButton.onclick = function() {
	window.location.href = "directory.html";
}

var group = JSON.parse(localStorage.getItem("group"));
var admins = group.admins;
var adminKeys = Object.keys(admins);
firebase.auth().onAuthStateChanged(function(user) {
  if (adminKeys.includes(user.uid)) {
    editEntryButton.style.display = "";
    deleteEntryButton.style.display = "";
  } else {
    editEntryButton.style.display = "none";
    deleteEntryButton.style.display = "none";
  }
});

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

  	ref.once("value", function(entry) {

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
     	localStorage.setItem("currentEntry", JSON.stringify(currentEntry));

 		var entryName = document.getElementById("entryName");
		entryName.innerText = getEntryName(currentEntry);

		addPhone(currentEntry);
		addEmail(currentEntry);
		addAddress(currentEntry);
		addPeople(currentEntry);

		directoryButton.style.display = "";
		loader.style.display = "none";

	});

}

deleteEntryButton.onclick = function() {

	var areYouSureModal = document.getElementById("areYouSureModal");
    areYouSureModal.style.display = "block";
    var areYouSure = document.getElementById("areYouSure");
    var noButton = document.getElementById("no");
    var yesButton = document.getElementById("yes");
    areYouSure.innerText = "This can't be undone. Are you sure you want to delete this entry?"
    noButton.innerText = "No";
    yesButton.innerText = "Yes";

    noButton.onclick = function() {
    	areYouSureModal.style.display = "none";
    }
    	
    yesButton.onclick = function() {
    	deleteEntry()
    	areYouSureModal.style.display = "none";
    }

}

function deleteEntry() {

	var successModal = document.getElementById('successModal');
	var successTitle = document.getElementById('successTitle');
	var message = document.getElementById('message');

	document.getElementById("loadingModal").style.display = "block";

	const entryRef = firebase.database().ref().child("Directories").child(groupUID).child(currentEntryKey);
	entryRef.remove(function(error) {
		if (error) {
			document.getElementById("loadingModal").style.display = "none";
			successModal.style.display = "block";
			successTitle.innerText = "Failure";
			mesesage.innerText = "There was a problem deleting this entry. Please try again."
		} else {
			document.getElementById("loadingModal").style.display = "none";
			successModal.style.display = "block";
			successTitle.innerText = "Success";	
			message.innerText = "This entry was successfully deleted."
		}
	});

}

var okButton = document.getElementById("ok");
okButton.onclick = function() {
	successModal.style.display = "none";
	if (successTitle.innerText == "Success") {
		window.location.href = "directory.html";
	}
}