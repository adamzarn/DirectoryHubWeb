var currentFamily = JSON.parse(localStorage.getItem("currentFamily"));

var editFamilyName = document.getElementById("editFamilyName");
editFamilyName.innerText = "Edit Family";

addHeader("Basic Info");

addInputBox(currentFamily.name, "Last Name");
addInputBox(currentFamily.phone, "Home Phone");
addInputBox(currentFamily.email, "Family Email");
addAddress(currentFamily);
addPeople(currentFamily);

function addHeader(text) {
	var editFamilyDetails = document.getElementById("editFamilyDetails");

	var newHeader = document.createElement("p");
	newHeader.setAttribute("class", "boldHeader");
	newHeader.innerText = text;
	editFamilyDetails.appendChild(newHeader);
}

function compare(a, b) {
  if (a.birthOrder < b.birthOrder)
    return -1;
  if (a.birthOrder > b.birthOrder)
    return 1;
  return 0;
}

function addInputBox(value, placeholder) {

	var editFamilyDetails = document.getElementById("editFamilyDetails");

	inputBox = document.createElement("input");
	inputBox.setAttribute("type", "text");
	inputBox.setAttribute("class", "edit");
	inputBox.value = value;
	inputBox.placeholder = placeholder;
    editFamilyDetails.appendChild(inputBox);

}

function addAddress(family) {

	var editFamilyDetails = document.getElementById("editFamilyDetails");

	addHeader("Address");

	addInputBox(family.street, "Street");
	addInputBox(family.line2, "Line 2");
	addInputBox(family.line3, "Line 3");

	var cityStateZip = document.createElement("div");
	cityStateZip.setAttribute("class", "cityStateZip");

	var city = document.createElement("input");
	city.setAttribute("type", "text");
	city.setAttribute("id", "city");
	city.placeholder = "City";
	city.value = family.city;
	cityStateZip.appendChild(city);

	var state = document.createElement("input");
	state.setAttribute("type", "text");
	state.setAttribute("id", "state");
	state.placeholder = "State";
	state.value = family.state;
	cityStateZip.appendChild(state);

	var zip = document.createElement("input");
	zip.setAttribute("type", "text");
	zip.setAttribute("id", "zip");
	zip.placeholder = "Zip";
	zip.value = family.zip;
	cityStateZip.appendChild(zip);

	editFamilyDetails.appendChild(cityStateZip);

}

function addPeople(family) {

	var editFamilyDetails = document.getElementById("editFamilyDetails");

	var adults = [];
	var children = [];
	
	family.people.forEach(function(person) {
		if (person.type == "Child") {
			children.push(person);
		} else {
			adults.push(person);
		}
	});

	addHeader("Adults");

	adults.forEach(function(adult) {
		addPerson(adult);
	});

	if (children.length > 0) {
		addHeader("Children");

		children.sort(compare);
	
		children.forEach(function(child) {
			addPerson(child);
		});
	}

}

function addPerson(person) {

	var editFamilyDetails = document.getElementById("editFamilyDetails");
	var personDiv = document.createElement("div");
	personDiv.setAttribute("class", "personDiv");

	firstName = document.createElement("input");
	firstName.setAttribute("type", "text");
	firstName.setAttribute("class", "edit");
	firstName.value = person.name;
	firstName.placeholder = "First Name";
    personDiv.appendChild(firstName);

    var twoBoxDiv = document.createElement("div");
    twoBoxDiv.setAttribute("class", "twoBoxDiv");

    var typeArray = ["Type","Husband","Wife","Single","Child"];
	personType = document.createElement("select");

	for (var i = 0; i < typeArray.length; i++) {
    	var option = document.createElement("option");
    	option.value = typeArray[i];
    	option.text = typeArray[i];
    	if (i == 0) {
    		option.disabled = true;
    	}
    	personType.appendChild(option);
	}

	personType.setAttribute("class", "personType");
	personType.value = person.type;
	twoBoxDiv.appendChild(personType);

	var birthOrderArray = ["Birth Order","0","1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20"];
	birthOrder = document.createElement("select");

	for (var i = 0; i < birthOrderArray.length; i++) {
    	var option = document.createElement("option");
    	option.value = birthOrderArray[i];
    	option.text = birthOrderArray[i];
    	if (i == 0) {
    		option.disabled = true;
    	}
    	birthOrder.appendChild(option);
	}

	birthOrder.setAttribute("class", "birthOrder");
	birthOrder.value = person.birthOrder;
	twoBoxDiv.appendChild(birthOrder);

	personDiv.appendChild(twoBoxDiv);

    phone = document.createElement("input");
	phone.setAttribute("type", "text");
	phone.setAttribute("class", "edit");
	phone.value = person.phone;
	phone.placeholder = "Phone";
    personDiv.appendChild(phone);

    email = document.createElement("input");
	email.setAttribute("type", "text");
	email.setAttribute("class", "edit");
	email.value = person.email;
	email.placeholder = "Email";
    personDiv.appendChild(email);

	editFamilyDetails.appendChild(personDiv);

}