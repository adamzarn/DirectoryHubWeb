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

var groupLogo = document.getElementById("groupLogo");
var groupJSON = localStorage.getItem("group");
if (groupJSON) {
	var groupToEdit = JSON.parse(groupJSON);
	groupLogo.style.display = "none";
} else {
	groupLogo.src = "ImageThumbnail.png";
}

var arrayOfAdmins = [];
var arrayOfUsers = [];

var user = JSON.parse(localStorage.getItem("currentUser"));
var userUID = "";
var userDisplayName = "";
var userGroups = user.groups;
var imageToUpload = null;
var imageChanged = false;

var uniqueID = document.getElementById("uniqueID");
var groupBox = document.getElementById("groupNameBox");
var cityBox = document.getElementById("cityBox");
var stateBox = document.getElementById("stateBox");
var passwordBox = document.getElementById("groupPasswordBox");

var state = document.getElementById("stateBox");
var stateArray = ["", "IL", "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID",
                        "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT",
                        "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI",
                        "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"];

for (var i = 0; i < stateArray.length; i++) {
    var option = document.createElement("option");
    option.value = stateArray[i];
    option.text = stateArray[i];
    state.appendChild(option);
}

var areYouSureModal = document.getElementById("areYouSureModal");
var areYouSureTitle = document.getElementById("areYouSureTitle");

var cancelButton = document.getElementById("cancelCreateGroupButton");
cancelButton.onclick = function() {
	window.location.href = "myGroups.html";
}

var submitButton = document.getElementById("submitCreateGroupButton");
submitButton.onclick = function() {
	createGroup();
}

var deleteButton = document.getElementById("deleteGroupButton");
deleteButton.onclick = function() {
	areYouSureModal.style.display = "block";
	areYouSureTitle.innerText = "Delete Group";
}

var cancelDeleteButton = document.getElementById("no");
cancelDeleteButton.onclick = function() {
	areYouSureModal.style.display = "none";
}

var submitDeleteButton = document.getElementById("yes");
submitDeleteButton.onclick = function() {
	areYouSureModal.style.display = "none";
	deleteGroup(groupToEdit.uid);
}

function deleteGroup(uid) {

	const groupRef = firebase.database().ref().child("Groups").child(uid)
    const directoryRef = firebase.database().ref().child("Directories").child(uid)
    const imageRef = firebase.storage().ref(uid + ".jpg");
        
    groupRef.remove(function(error) { 
        if (error) {
        	return;
        } else {
            directoryRef.remove(function(error) {
                if (error) {
                    return;
                } else {
                	imageRef.delete(function(error) {
                		if (error) {
                			return;
                		} else {
                			console.log("successfully deleted")
                		}
                	});
                }
            });
        }
    });
}

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
  	userUID = firebase.auth().currentUser.uid;
	userDisplayName = firebase.auth().currentUser.displayName;
  	setUpView();
  } else {
    console.log("No user is signed in.");
  }
});

function setUpView() {

	if (groupToEdit) {

		var header = document.getElementById("createGroupHeader");
		header.innerText = "Edit Group";

		submitButton.innerText = "Submit Changes";

		uniqueID.innerText = groupToEdit.uid;
		groupBox.value = groupToEdit.name;
		cityBox.value = groupToEdit.city;
		stateBox.selectedIndex = stateArray.indexOf(groupToEdit.state);
		passwordBox.value = groupToEdit.password;

		addRows(groupToEdit.admins, groupToEdit.users);
		addRowHandlers();

    	firebase.storage().ref(groupToEdit.uid + ".jpg").getDownloadURL().then(function(url) {

    		groupLogo.style.display = "";
    		groupLogo.src = url;

    	}).catch(function(error) {
    		groupLogo.style.display = "";
      		console.log(error);
    	});

	} else {
		var admins = {};
		admins[userUID] = userDisplayName;
		addRows(admins, []);
	}

}

function addRows(admins, users) {

	arrayOfAdmins = [];
  	var position = 0;
  	var localPosition = 0;
  	for (var key in admins) {
    	addRow(admins[key], position, localPosition, "Administrators");
    	var newAdmin = {};
    	newAdmin[key] = admins[key];
    	arrayOfAdmins.push(newAdmin);
    	position++;
    	localPosition++;
  	}

	arrayOfUsers = [];
  	localPosition = 0;
  	for (var key in users) {
      	addRow(users[key], position, localPosition, "Members");
      	var newUser = {};
      	newUser[key] = users[key];
      	arrayOfUsers.push(newUser);
      	position++;
      	localPosition++;
  	}

}

function addRow(name, position, localPosition, headerText) {

  if (!document.getElementsByTagName) return;

    tabBody=document.getElementsByTagName("tbody").item(0);

    if (localPosition == 0) {
	    header=document.createElement("th");
	    headerElement = document.createElement("p");
	    headerNode = document.createTextNode(headerText);
	    headerElement.appendChild(headerNode);
	    header.appendChild(headerElement);
	    tabBody.appendChild(header);
	}

    row=document.createElement("tr");

    cell = document.createElement("td");
    cell.setAttribute("class", "cell");

    nameElement = document.createElement("p");
    nameElement.setAttribute("class", "personName");
    nameNode = document.createTextNode(name);
    nameElement.appendChild(nameNode);
    cell.appendChild(nameElement);

    adminElement = document.createElement("button");
    adminElement.setAttribute("class", "adminButton");
    adminElement.setAttribute("id", "adminButton" + position);

    if (headerText == "Members") {
	    adminElement.innerText = "Make Admin";
    } else {
    	adminElement.innerText = "Remove";
	}

	if (groupToEdit) {
		if (Object.keys(groupToEdit.admins).length != 1 || headerText == "Members") {
			cell.appendChild(adminElement);
		}
	}	

    row.appendChild(cell);
    tabBody.appendChild(row);

}

function addRowHandlers() {

	var localPosition = 0;
	var position = 0;
  	for (i = 0; i < arrayOfAdmins.length; i++) {
  		addRowHandler(localPosition, position);
  		localPosition++;
  		position++;
  	}

  	localPosition = 0;
  	for (i = 0; i < arrayOfUsers.length; i++) {
  		addRowHandler(localPosition, position);
  		localPosition++;
  		position++;
  	}

}

function addRowHandler(localPosition, position) {

	var table = document.getElementById("manageAdminsTable");
	var currentRow = table.rows[position];

   	var currentAdminButton = document.getElementById("adminButton" + position);

    var adminButtonClickHandler = function(row) {
    	return function() {

    		position = row.rowIndex;

    		if (currentAdminButton.innerText == "Remove") {
    			var personToMove = arrayOfAdmins[localPosition];
    			arrayOfAdmins.splice(localPosition, 1);
    			if (arrayOfUsers) {
    				arrayOfUsers.push(personToMove);
    			} else {
    				arrayOfUsers = [];
    				arrayOfUsers.push(personToMove);
    			}
    		} else {
    			var personToMove = arrayOfUsers[localPosition];
    			arrayOfUsers.splice(localPosition, 1);
    			if (arrayOfAdmins) {
    				arrayOfAdmins.push(personToMove);
    			} else {
    				arrayOfAdmins = [];
    				arrayOfAdmins.push(personToMove);
    			} 
    		}

    		var newAdmins = {};
    		for (i = 0; i < arrayOfAdmins.length; i++) {
    			var currentAdmin = arrayOfAdmins[i];
    			var key = Object.keys(currentAdmin)[0];
    			var value = currentAdmin[key];
    			newAdmins[key] = value;
  			}

  			var newUsers = {};
 			for (i = 0; i < arrayOfUsers.length; i++) {
 				var currentUser = arrayOfUsers[i];
    			var key = Object.keys(currentUser)[0];
    			var value = currentUser[key];
    			newUsers[key] = value;
  			}

  			groupToEdit.admins = newAdmins;
  			groupToEdit.users = newUsers;

    		reloadTable();

    	};
    };

    if (currentAdminButton) {
  		currentAdminButton.onclick = adminButtonClickHandler(currentRow);
  	}

}

function reloadTable() {
	var table = document.getElementById("manageAdminsTable");
	while(table.rows.length > 0) {
  		table.deleteRow(0);
	}
	var headers = document.getElementsByTagName("th"), index;
	for (index = headers.length - 1; index >= 0; index--) {
    	headers[index].parentNode.removeChild(headers[index]);
	}
	addRows(groupToEdit.admins, groupToEdit.users);
	addRowHandlers();
}

function uploadImage() {
	var x = document.getElementById("uploadImageButton");
    var txt = "";
    if ('files' in x) {
        if (x.files.length == 0) {
            txt = "Choose your image.";
        } else {
            for (var i = 0; i < x.files.length; i++) {
                txt += "<br><strong>" + (i+1) + ". file</strong><br>";
                var file = x.files[i];
                if ('name' in file) {
                    txt += "name: " + file.name + "<br>";
                }
                if ('size' in file) {
                    txt += "size: " + file.size + " bytes <br>";
                }
            }
        }
    } 
    else {
        if (x.value == "") {
            txt += "Select one or more files.";
        } else {
            txt += "The files property is not supported by your browser!";
            txt  += "<br>The path of the selected file: " + x.value; // If the browser does not support the files property, it will return the path of the selected file instead. 
        }
    }
    document.getElementById("demo").innerHTML = txt;
}

var uploadImageButton = document.getElementById("uploadImageButton");

function handleFiles(event) {

    if (event.target.files[0].size > 2000000) {
    	alert("File sizes must be smaller than 2MB, please choose another image.");
    	uploadImageButton.value = null;
    } else {
    	imageToUpload = event.target.files[0];
    	imageChanged = true;

    	groupLogo.src = URL.createObjectURL(imageToUpload);
    }
    
}

function removeImage() {

	imageChanged = true;

    groupLogo.src = "ImageThumbnail.png";
    
    uploadImageButton.value = null;
    imageToUpload = new Blob([new Uint8Array(null)], { type: 'image/jpg' });

}

function createGroup() {

	if (groupBox.value == "") {
		alert("You must provide a group name.");
		return;
	}

	if (cityBox.value == "") {
		alert("You must provide a city.");
		return;
	}

	if (stateBox.value == "") {
		alert("You must provide a state.");
		return;
	}

	if (passwordBox.value == "") {
		alert("You must provide a password.");
		return;
	}

	if (groupToEdit) {

		var groupToUpload = {
			name: groupBox.value,
			lowercasedName: groupBox.value.toLowerCase(),
			city: cityBox.value,
			state: stateBox.value,
			password: passwordBox.value,
			admins: groupToEdit.admins,
			users: groupToEdit.users,
			createdBy: groupToEdit.createdBy,
			lowercasedCreatedBy: groupToEdit.lowercasedCreatedBy,
			createdByUid: groupToEdit.createdByUid
		}

	} else {

		var admins = {};
		admins[userUID] = userDisplayName;

		var groupToUpload = {
			name: groupBox.value,
			lowercasedName: groupBox.value.toLowerCase(),
			city: cityBox.value,
			state: stateBox.value,
			password: passwordBox.value,
			admins: admins,
			users: [],
			createdBy: userDisplayName,
			lowercasedCreatedBy: userDisplayName.toLowerCase(),
			createdByUid: userUID
		}

	}

	var modal = document.getElementById('loadingModal');

	var successModal = document.getElementById('successModal');
	var title = document.getElementById('title');
	var message = document.getElementById('message');

	var status = document.getElementById('status');
	if (groupToEdit) {
		status.innerText = "Uploading Changes...";
	} else {
		status.innerText = "Creating Group...";
	}
	
	var groupRef = "";

	if (groupToEdit) {
		groupRef = firebase.database().ref().child("Groups").child(groupToEdit.uid);
	} else {
		groupRef = firebase.database().ref().child("Groups").push();
	}

	console.log(userGroups);

	if (!groupToEdit) {
		if (userGroups) {
			userGroups[userGroups.length] = groupRef.getKey();
		} else {
			userGroups = [groupRef.getKey()];
		}
	}

	console.log(userGroups);

	if (groupToEdit) {
		title.innerText = "Success";
		message.innerText = "This group was successfully edited."
	} else {
		title.innerText = "Success";
		message.innerText = "This group was successfully created."
	}

	if (!groupToEdit) {
		if (!imageToUpload) {
			imageToUpload = new Blob([new Uint8Array(null)], { type: 'image/jpg' });
			imageChanged = true;
		}
	}
	
	modal.style.display = "block";

	groupRef.set(groupToUpload, function(error) {
		if (error) {
			modal.style.display = "none";
			successModal.style.display = "block";
			title.innerText = "Failure";
			message.innerText = "This group couldn't be edited."
		} else {
			const userRef = firebase.database().ref().child("Users").child(userUID).child("groups");
			userRef.set(userGroups, function(error) {
				if (error) {
					modal.style.display = "none";
					successModal.style.display = "block";
					title.innerText = "Failure";
					message.innerText = "Something went wrong.";
				} else {
					if (imageChanged) {
						firebase.storage().ref().child(groupRef.getKey() + ".jpg").put(imageToUpload)
						.then(function(success) {
							modal.style.display = "none";
							successModal.style.display = "block";
						}).catch(function(error) {
							modal.style.display = "none";
							successModal.style.display = "block";
							title.innerText = "Failure";
							message.innerText = "Something went wrong.";
						});
					} else {
						modal.style.display = "none";
						successModal.style.display = "block";
					}
				}
			});
		}
	});
}

var okButton = document.getElementById("ok");
okButton.onclick = function() {
	window.location.href = "myGroups.html"
}

