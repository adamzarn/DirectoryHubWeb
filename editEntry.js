var config = {
  apiKey: "AIzaSyDS6zch98V15uvpqsbKqnRrMnv3Ha_vMcA",
  authDomain: "valleybrookcommunitychur-77604.firebaseapp.com",
  databaseURL: "https://valleybrookcommunitychur-77604.firebaseio.com",
  projectId: "valleybrookcommunitychur-77604",
  storageBucket: "valleybrookcommunitychur-77604.appspot.com",
  messagingSenderId: "301967649981"
};

firebase.initializeApp(config);

var currentEntry = JSON.parse(localStorage.getItem("currentEntry"));
console.log(currentEntry);
console.log(currentEntry["name"]);

if (!currentEntry) {
	console.log("Here")
	currentEntry["key"] = "";
	currentEntry["name"] = "";
	currentEntry["phone"] = "";
	currentEntry["email"] = "";
	currentEntry["street"] = "";
	currentEntry["line2"] = "";
	currentEntry["line3"] = "";
	currentEntry["city"] = "";
	currentEntry["state"] = "";
	currentEntry["zip"] = "";
	currentEntry["people"] = [];
}

var editEntryName = document.getElementById("editEntryName");
var people = [];
var personDivIdToDelete = 0;
var group = JSON.parse(localStorage.getItem("group"));

editEntryName.innerText = "Edit Entry";
if (currentEntry.key == "") {
	var submitChangesButton = document.getElementById("submitChangesButton");
	submitChangesButton.innerText = "Submit";
	editEntryName.innerText = "Add Entry";
} else {
	people = currentEntry.people;

}

$(document).on('change','#addPersonType', function() {
    if (document.getElementById("addPersonType").value == "Child") {
		document.getElementById("addPersonBirthOrder").disabled = false;
    } else {
    	document.getElementById("addPersonBirthOrder").disabled = true;
    	document.getElementById("addPersonBirthOrder").value = "0";
    }
});

setUpModal();

var addPersonButton = document.createElement("button");
addPersonButton.setAttribute("id", "addPersonButton");
addPersonButton.setAttribute("class", "button");
addPersonButton.innerText = "Add Person";

addPersonButton.onclick = function() {
	var addPersonLabel = document.getElementById("addPersonLabel");
	addPersonLabel.innerText = "Add Person";

	var addPersonName = document.getElementById("addPersonName");
	var addPersonType = document.getElementById("addPersonType");
	var addPersonBirthOrder = document.getElementById("addPersonBirthOrder");
	var addPersonPhone = document.getElementById("addPersonPhone");
	var addPersonEmail = document.getElementById("addPersonEmail");

	addPersonName.value = "";
    addPersonType.value = "Husband";
    addPersonPhone.value = "";
    addPersonEmail.value = "";
    addPersonBirthOrder = "0";
    document.getElementById("addPersonBirthOrder").disabled = true;

	var modal = document.getElementById("personModal");
	modal.style.display = "block";
}

var submitChangesButton = document.getElementById("submitChangesButton");
submitChangesButton.onclick = function() {

	var lastNameInputBox = document.getElementById("lastNameInputBox");
	var phoneNumberInputBox = document.getElementById("phoneNumberInputBox");
	var emailInputBox = document.getElementById("emailInputBox");

	if (lastNameInputBox.value == "") {
		alert("An entry must have a last name.");
		return
	}

	if (people.length == 0) {
		alert("An entry must contain at least 1 person.");
		return
	}

	var personTypes = getPersonTypes(people);
	if (!personTypes.includes("Husband") && !personTypes.includes("Wife") && !personTypes.includes("Single")) {
		alert("An entry must contain at least 1 adult.");
		return
	} 
	if (personTypes.includes("Husband") && !personTypes.includes("Wife")) {
		alert("If an entry has a husband, it must also have a wife.");
		return
	}
	if (personTypes.includes("Wife") && !personTypes.includes("Husband")) {
		alert("If an entry has a wife, it must also have a husband.");
		return
	}

	var modal = document.getElementById('loadingModal');
	var status = document.getElementById('status');
	status.innerText = "Uploading Changes...";

	var entryRef = "";

	if (currentEntry.key == "") {
		entryRef = firebase.database().ref().child("Directories").child(group.uid).push();
		status.innerText = "Adding Entry...";
	} else {
		entryRef = firebase.database().ref().child("Directories").child(group.uid).child(currentEntry.key);
	}

	var uid = entryRef.getKey();
	
	modal.style.display = "block";

	entryRef.set({
		name: lastNameInputBox.value,
		phone: phoneNumberInputBox.value,
		email: emailInputBox.value,
		Address: createAddress(currentEntry)}
	);
	var peopleRef = entryRef.child("People");
	var i = 0;
	var count = people.length;
	people.forEach(function(person) {
		peopleRef.push().set({
			birthOrder: person.birthOrder,
			name: person.name,
			email: person.email,
			phone: person.phone,
			type: person.type},
			function(error) {
				if (i == count) {
					if (error) {
						alert("Data could not be saved." + error.meessage);
  					} else {
  						localStorage.setItem("currentEntryKey", uid)
  						localStorage.setItem("currentEntry", "null");
  						window.location.href = "entry.html";
					}
				}
			}
		);
		i++;
	});
}

function createAddress(currentEntry) {

	var street = document.getElementById("street");
	var line2 = document.getElementById("line2");
	var line3 = document.getElementById("line3");
	var city = document.getElementById("city");
	var state = document.getElementById("state");
	var zip = document.getElementById("zip");

	return {
		street: street.value,
		line2: line2.value,
		line3: line3.value,
		city: city.value,
		state: state.value,
		zip: zip.value,
	}
}

setUpPage(currentEntry);

function setUpModal() {

	var modal = document.getElementById("personModal");
	var cancelPersonButton = document.getElementById("cancelPersonButton");
	var submitPersonButton = document.getElementById("submitPersonButton");

	var addPersonLabel = document.getElementById("addPersonLabel");
	var addPersonName = document.getElementById("addPersonName");
	var addPersonType = document.getElementById("addPersonType");
	var addPersonBirthOrder = document.getElementById("addPersonBirthOrder");
	var addPersonPhone = document.getElementById("addPersonPhone");
	var addPersonEmail = document.getElementById("addPersonEmail");

	var typeArray = ["Type","Husband","Wife","Single","Child"];

		for (var i = 0; i < typeArray.length; i++) {
	    	var option = document.createElement("option");
	    	option.value = typeArray[i];
	    	option.text = typeArray[i];
	    	if (i == 0) {
	    		option.disabled = true;
	    	}
	    	addPersonType.appendChild(option);
		}

	var birthOrderArray = ["Birth Order","0","1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20"];

		for (var i = 0; i < birthOrderArray.length; i++) {
	    	var option = document.createElement("option");
	    	option.value = birthOrderArray[i];
	    	option.text = birthOrderArray[i];
	    	if (i == 0) {
	    		option.disabled = true;
	    	}
    		addPersonBirthOrder.appendChild(option);
		}

	cancelPersonButton.onclick = function() {
    	modal.style.display = "none";
	}

  	window.onclick = function(event) {
      	if (event.target == modal) {
          	modal.style.display = "none";
      	}
  	}

  	submitPersonButton.onclick = function() {

  		if (addPersonName.value == "") {
  			alert("A new person must have a first name.");
  			return
  		}

  		var personTypes = getPersonTypes(people);
  		if (addPersonType.value != "Child") {
  			if (addPersonLabel.innerText == "Add Person") {
	  			if (personTypes.includes(addPersonType.value)) {
	  				alert("This entry already has a " + addPersonType.value + ". Please change the person's type.")
	  				return
	  			} 
	  			if (addPersonType.value == "Single" && (personTypes.includes("Husband") || personTypes.includes("Wife"))) {
	  				alert("A Single cannot be in the same entry as a Husband or Wife.");
	  				return
	  			}
	  			if ((addPersonType.value == "Husband" || addPersonType.value == "Wife") && personTypes.includes("Single")) {
	  				alert("A Husband or Wife cannot be in the same entry as a Single.");
	  				return
	  			}
	  		}
  		} else {
  			if (addPersonBirthOrder.value == 0) {
  				alert("A child's birth order can't be 0. Please change this child's birth order.");
  				return
  			}
  			if (addPersonLabel.innerText == "Add Person") {
	  			if (getBirthOrders(people).includes(addPersonBirthOrder.value)) {
	  				alert("This entry already has a child with birth order " + addPersonBirthOrder.value + ". Please change this child's birth order.")
	  				return
	  			}
  			}	
  		}

  		var newPerson = {
	        name: addPersonName.value, 
	        type: addPersonType.value, 
	        phone: addPersonPhone.value,
	        email: addPersonEmail.value, 
	        birthOrder: addPersonBirthOrder.value 
	    };

  		if (addPersonLabel.innerText == "Add Person") {
	  		modal.style.display = "none";
	        people.push(newPerson);
	        currentEntry.people = people;
	    } else {
	    	modal.style.display = "none";
	    	people[editingIndex] = newPerson;
	    	currentEntry.people = people;
	    }

	    $(".personDiv").remove();
	    addPeople(currentEntry);
	    if (addPersonLabel.innerText == "Add Person") {
			jumpToPageBottom();
		}
	    addPersonName.value = "";
	    addPersonType.value = "Husband";
	    addPersonPhone.value = "";
	    addPersonEmail.value = "";
	    addPersonBirthOrder.value = "0";
	    addPersonBirthOrder.display = true;

  	}
}

function jumpToPageBottom() {
    $('html, body').scrollTop( $(document).height() - $(window).height() );
}

function setUpPage(currentEntry) {
	addHeader("Basic Info");

	console.log(currentEntry.name);
	console.log(currentEntry["name"]);
	addInputBox(currentEntry.name, "Last Name", "text", "100", "lastNameInputBox");
	addInputBox(currentEntry.phone, "Home Phone", "phone_num", "12", "phoneNumberInputBox");
	addInputBox(currentEntry.email, "Email", "text", "100", "emailInputBox");
	addAddress(currentEntry);

	editEntryDetails.appendChild(addPersonButton);

	var space = document.createElement("br");
	editEntryDetails.appendChild(space);

	addHeader("People");
	addPeople(currentEntry);
}

$("input[name='phone_num']").keyup(function() {
  var val_old = $(this).val();
  var val = val_old.replace(/\D/g, '');
  var len = val.length;
  if (len >= 4)
    val = val.substring(0, 3) + '-' + val.substring(3);
  if (len >= 7)
    val = val.substring(0, 7) + '-' + val.substring(7);
  if (val != val_old)
    $(this).focus().val('').val(val);
});

function addHeader(text) {
	var editEntryDetails = document.getElementById("editEntryDetails");

	var newHeader = document.createElement("p");
	newHeader.setAttribute("class", "boldHeader");
	newHeader.setAttribute("id", text);
	newHeader.innerText = text;
	editEntryDetails.appendChild(newHeader);
}

function compare(a, b) {
  if (a.birthOrder < b.birthOrder)
    return -1;
  if (a.birthOrder > b.birthOrder)
    return 1;
  return 0;
}

function addInputBox(value, placeholder, name, maxlength, id) {

	var editEntryDetails = document.getElementById("editEntryDetails");

	inputBox = document.createElement("input");
	inputBox.setAttribute("type", "text");
	inputBox.setAttribute("class", "edit");
	inputBox.setAttribute("name", name);
	inputBox.setAttribute("id", id);
	inputBox.setAttribute("maxlength", maxlength);
	inputBox.value = value;
	inputBox.placeholder = placeholder;
    editEntryDetails.appendChild(inputBox);

}

function addAddress(entry) {

	var editEntryDetails = document.getElementById("editEntryDetails");

	addHeader("Address");

	addInputBox(entry.street, "Street", "text", "100", "street");
	addInputBox(entry.line2, "Line 2", "text", "100", "line2");
	addInputBox(entry.line3, "Line 3", "text", "100", "line3");

	var cityStateZip = document.createElement("div");
	cityStateZip.setAttribute("class", "cityStateZip");

	var city = document.createElement("input");
	city.setAttribute("type", "text");
	city.setAttribute("id", "city");
	city.placeholder = "City";
	city.value = entry.city;
	cityStateZip.appendChild(city);

	var stateArray = ["State", "IL", "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID",
                        "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT",
                        "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI",
                        "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"];
	var state = document.createElement("select");

	for (var i = 0; i < stateArray.length; i++) {
    	var option = document.createElement("option");
    	option.value = stateArray[i];
    	option.text = stateArray[i];
    	if (i == 0) {
    		option.disabled = true;
    	}
    	state.appendChild(option);
	}

	state.setAttribute("id", "state");
	state.value = entry.state;
	cityStateZip.appendChild(state);

	var zip = document.createElement("input");
	zip.setAttribute("type", "text");
	zip.setAttribute("id", "zip");
	zip.placeholder = "Zip";
	zip.value = entry.zip;
	cityStateZip.appendChild(zip);

	editEntryDetails.appendChild(cityStateZip);

}

function addPeople(entry) {

	var editEntryDetails = document.getElementById("editEntryDetails");
	
	entry.people.sort(compare);
	var i = 0;
	entry.people.forEach(function(person) {
		addPerson(person, i);
		i++;
	});

}

function addPerson(person, i) {

	var editEntryDetails = document.getElementById("editEntryDetails");
	var personDiv = document.createElement("div");
	personDiv.setAttribute("class", "personDiv");
	personDiv.setAttribute("id", 
		i)

	var birthOrderString = person.type;
	if (person.type == "Child") {
		birthOrderString = "1st child";
        if (person.birthOrder == 2) {
            birthOrderString = "2nd child";
        } else if (person.birthOrder == 3) {
            birthOrderString = "3rd child";
        } else if (person.birthOrder > 3) {
            birthOrderString = person.birthOrder + "th child";
        }
	}

	firstName = document.createElement("p");
	firstName.setAttribute("type", "text");
	firstName.setAttribute("class", "personLine");
	firstName.innerText = person.name + ", " + birthOrderString;
    personDiv.appendChild(firstName);

    editButton = document.createElement("button");
    editButton.setAttribute("class", "editButton");
    editButton.innerText = "Edit";
    personDiv.appendChild(editButton);

    editButton.onclick = function() {
    	var modal = document.getElementById("personModal");
		modal.style.display = "block";

		var addPersonLabel = document.getElementById("addPersonLabel");
		var addPersonName = document.getElementById("addPersonName");
		var addPersonType = document.getElementById("addPersonType");
		var addPersonBirthOrder = document.getElementById("addPersonBirthOrder");
		var addPersonPhone = document.getElementById("addPersonPhone");
		var addPersonEmail = document.getElementById("addPersonEmail");

		addPersonLabel.innerText = "Edit Person";
		addPersonName.value = person.name;
		addPersonType.value = person.type;
		addPersonBirthOrder.value = person.birthOrder;
		addPersonPhone.value = person.phone;
		addPersonEmail.value = person.email;

		if (person.type == "Child") {
			document.getElementById("addPersonBirthOrder").disabled = false;
    	} else {
	    	document.getElementById("addPersonBirthOrder").disabled = true;
	    	document.getElementById("addPersonBirthOrder").value = "0";
    	}

		editingIndex = personDiv.id;
    }

    deleteButton = document.createElement("button");
    deleteButton.setAttribute("class", "deletePersonButton");
    deleteButton.innerText = "Delete";

    deleteButton.onclick = function() {
    	var areYouSureModal = document.getElementById("areYouSureModal");
    	areYouSureModal.style.display = "block";
    	var areYouSure = document.getElementById("areYouSure");
    	var noButton = document.getElementById("no");
    	var yesButton = document.getElementById("yes");
    	areYouSure.innerText = "This can't be undone. Are you sure you want to delete this person?"
    	noButton.innerText = "No";
    	yesButton.innerText = "Yes";

    	noButton.onclick = function() {
    		areYouSureModal.style.display = "none";
    	}
    	
    	yesButton.onclick = function() {
    		deletePerson(personDiv.id);
    		areYouSureModal.style.display = "none";
    	}
    }

    personDiv.appendChild(deleteButton);

    phone = document.createElement("p");
	phone.setAttribute("type", "text");
	phone.setAttribute("class", "personLine");
	phone.innerText = "Phone: " + person.phone;
    personDiv.appendChild(phone);

    email = document.createElement("p");
	email.setAttribute("type", "text");
	email.setAttribute("class", "personLine");
	email.innerText = "Email: " + person.email;
    personDiv.appendChild(email);

	editEntryDetails.appendChild(personDiv);

}

function deletePerson(personDivId) {
	people.splice(personDivId, 1);
    currentEntry.people = people;
    $(".personDiv").remove();
	addPeople(currentEntry);
}

function getPersonTypes(people) {
	var personTypes = [];
	people.forEach(function(person) {
		personTypes.push(person.type);
	});
	return personTypes;
}

function getBirthOrders(people) {
	var birthOrders = [];
	people.forEach(function(person) {
		if (person.type == "Child") {
			birthOrders.push(person.birthOrder);
		}
	});
	return birthOrders;
}