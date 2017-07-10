var currentFamily = JSON.parse(localStorage.getItem("currentFamily"));
console.log(currentFamily);

var familyName = document.getElementById("familyName");
familyName.innerText = getFamilyName(currentFamily);

addPhone(currentFamily);
addEmail(currentFamily);
addAddress(currentFamily);
addPeople(currentFamily);

var editFamilyButton = document.getElementById("editFamilyButton");
editFamilyButton.onclick = function() {
	window.location.href = "editFamily.html";
}

function getFamilyName(family) {
	var people = family.people;
	var familyName = "The " + family.name + " Family";
	people.forEach(
		function(person) {	
			if (person.type == "Single") {
				familyName = person.name + " " + family.name;
			}
		}
	);
	return familyName;
}

function compare(a, b) {
  if (a.birthOrder < b.birthOrder)
    return -1;
  if (a.birthOrder > b.birthOrder)
    return 1;
  return 0;
}

function addPhone(family) {

	var familyDetails = document.getElementById("familyDetails");

	if (family.phone != "") {

		var newHeader = document.createElement("p");
		newHeader.setAttribute("class", "boldHeader");
		newHeader.innerText = "Home Phone";

		var newDiv = document.createElement("div");
		newDiv.setAttribute("class", "detailDiv");
		homePhone = document.createElement("p");
		homePhone.setAttribute("class", "detailLine");
		homePhone.innerText = family.phone;
    	newDiv.appendChild(homePhone);
    	familyDetails.appendChild(newHeader);
    	familyDetails.appendChild(newDiv);

	}

}

function addEmail(family) {

	var familyDetails = document.getElementById("familyDetails");

	if (family.email != "") {

		var newHeader = document.createElement("p");
		newHeader.setAttribute("class", "boldHeader");
		newHeader.innerText = "Family Email";

		var newDiv = document.createElement("div");
		newDiv.setAttribute("class", "detailDiv");
		familyEmail = document.createElement("p");
		familyEmail.setAttribute("class", "detailLine");
		familyEmail.innerText = family.email;
    	newDiv.appendChild(familyEmail);
    	familyDetails.appendChild(newHeader);
    	familyDetails.appendChild(newDiv);
    	
	}

}

function addAddress(family) {

	var familyDetails = document.getElementById("familyDetails");

	if (family.street != "") {

		var newHeader = document.createElement("p");
		newHeader.setAttribute("class", "boldHeader");
		newHeader.innerText = "Address";

		var newDiv = document.createElement("div");
		newDiv.setAttribute("class", "detailDiv");

		var street = document.createElement("p");
		street.setAttribute("class", "detailLine");
		street.innerText = family.street;
		newDiv.appendChild(street);

		if (family.line2 != "") {

			var line2 = document.createElement("p");
			line2.setAttribute("class", "detailLine");
			line2.innerText = family.line2;
			newDiv.appendChild(line2);

		}

		if (family.line3 != "") {

			var line3 = document.createElement("p");
			line3.setAttribute("class", "detailLine");
			line3.innerText = family.line3;
			newDiv.appendChild(line3);

		}

		var cityStateZipString = family.city + ", " + family.state + " " + family.zip;

		var cityStateZip = document.createElement("p");
		cityStateZip.setAttribute("class", "detailLine");
		cityStateZip.innerText = cityStateZipString;
		newDiv.appendChild(cityStateZip);

		familyDetails.appendChild(newHeader);
		familyDetails.appendChild(newDiv);

	}

}

function addPeople(family) {

	var familyDetails = document.getElementById("familyDetails");

	var adults = [];
	var children = [];
	
	family.people.forEach(function(person) {
		if (person.type == "Child") {
			children.push(person);
		} else {
			adults.push(person);
		}
	});

	var newAdultsHeader = document.createElement("p");
	newAdultsHeader.setAttribute("class", "boldHeader");
	newAdultsHeader.innerText = "Adults";
	familyDetails.appendChild(newAdultsHeader);

	adults.forEach(function(adult) {
		addPerson(adult);
	});

	if (children.length > 0) {
		var newChildrenHeader = document.createElement("p");
		newChildrenHeader.setAttribute("class", "boldHeader");
		newChildrenHeader.innerText = "Children";
		familyDetails.appendChild(newChildrenHeader);

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

	familyDetails.appendChild(newDiv);

}