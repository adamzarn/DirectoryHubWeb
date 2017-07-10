var currentFamily = JSON.parse(localStorage.getItem("currentFamily"));
var editFamilyName = document.getElementById("editFamilyName");
var people = [];

editFamilyName.innerText = "Edit Family";
if (currentFamily.key == "") {
	var submitChangesButton = document.getElementById("submitChangesButton");
	submitChangesButton.innerText = "Submit";
	editFamilyName.innerText = "Add Family";
}

setUpModal();

var addPersonButton = document.createElement("button");
addPersonButton.setAttribute("id", "addPersonButton");
addPersonButton.setAttribute("class", "button");
addPersonButton.innerText = "Add Person";

addPersonButton.onclick = function() {
	var modal = document.getElementById("personModal");
	modal.style.display = "block";
}

setUpPage(currentFamily);

function setUpModal() {

	var modal = document.getElementById("personModal");
	var cancelPersonButton = document.getElementById("cancelPersonButton");
	var submitPersonButton = document.getElementById("submitPersonButton");

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
  		modal.style.display = "none";
  		var newPerson = {
            name: addPersonName.value, 
            type: addPersonType.value, 
            phone: addPersonPhone.value,
            email: addPersonEmail.value, 
            birthOrder: addPersonBirthOrder.value, 
        };
        people.push(newPerson);
        currentFamily.people = people;
        $(".personDiv").remove();
        addPeople(currentFamily);
        jumpToPageBottom()
        addPersonName.value = "";
        addPersonType.value = "Husband";
        addPersonPhone.value = "0";
        addPersonEmail.value = "";
        addPersonBirthOrder = "";
  	}
}

function jumpToPageBottom() {
    $('html, body').scrollTop( $(document).height() - $(window).height() );
}

function setUpPage(currentFamily) {
	addHeader("Basic Info");

	addInputBox(currentFamily.name, "Last Name", "text", "100");
	addInputBox(currentFamily.phone, "Home Phone", "phone_num", "12");
	addInputBox(currentFamily.email, "Family Email", "text", "100");
	addAddress(currentFamily);

	editFamilyDetails.appendChild(addPersonButton);

	var space = document.createElement("br");
	editFamilyDetails.appendChild(space);

	addHeader("People");
	addPeople(currentFamily);
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
	var editFamilyDetails = document.getElementById("editFamilyDetails");

	var newHeader = document.createElement("p");
	newHeader.setAttribute("class", "boldHeader");
	newHeader.setAttribute("id", text);
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

function addInputBox(value, placeholder, name, maxlength) {

	var editFamilyDetails = document.getElementById("editFamilyDetails");

	inputBox = document.createElement("input");
	inputBox.setAttribute("type", "text");
	inputBox.setAttribute("class", "edit");
	inputBox.setAttribute("name", name)
	inputBox.setAttribute("maxlength", maxlength);
	inputBox.value = value;
	inputBox.placeholder = placeholder;
    editFamilyDetails.appendChild(inputBox);

}

function addAddress(family) {

	var editFamilyDetails = document.getElementById("editFamilyDetails");

	addHeader("Address");

	addInputBox(family.street, "Street", "text", "100");
	addInputBox(family.line2, "Line 2", "text", "100");
	addInputBox(family.line3, "Line 3", "text", "100");

	var cityStateZip = document.createElement("div");
	cityStateZip.setAttribute("class", "cityStateZip");

	var city = document.createElement("input");
	city.setAttribute("type", "text");
	city.setAttribute("id", "city");
	city.placeholder = "City";
	city.value = family.city;
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

	if (adults.length > 0) {

		adults.forEach(function(adult) {
			addPerson(adult);
		});
	}

	if (children.length > 0) {

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

	firstName = document.createElement("p");
	firstName.setAttribute("type", "text");
	firstName.setAttribute("class", "personLine");
	firstName.innerText = person.name + ", " + person.type;
    personDiv.appendChild(firstName);

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

	editFamilyDetails.appendChild(personDiv);

}