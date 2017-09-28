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

var loader = document.getElementById('loader');
loader.style.display = "none"

var addGroupButton = document.getElementById('addGroupButton');
addGroupButton.onclick = function() {
	var modal = document.getElementById("addGroupModal");
	modal.style.display = "block";

	window.onclick = function(event) {
    	if (event.target == modal) {
        	modal.style.display = "none";
    	}
	}

	var createGroupButton = document.getElementById("createGroupButton");
	createGroupButton.onclick = function() {
		localStorage.setItem("group", "");
		window.location.href = "createGroup.html";
	}

	var searchGroupsButton = document.getElementById("searchGroupsButton");
	searchGroupsButton.onclick = function() {
		window.location.href = "searchGroups.html";
	}

    
}

var logoutButton = document.getElementById('logoutButton');
logoutButton.onclick = function() {

	firebase.auth().signOut().then(function() {
		window.location.href = "index.html";
	}).catch(function(error) {
		alert("There was a problem logging you out. Please try again.");
	});

}

var storage = firebase.storage();
var title = document.getElementById('title');
var search = document.getElementById('searchBox');
var groups = [];
var groupUIDs = [];
var previousGroupUIDs = [];
var deletedGroups = 0;

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
  	var welcomeLabel = document.getElementById("welcomeLabel");
  	welcomeLabel.innerText = "Welcome " + firebase.auth().currentUser.displayName + "!";
    loadGroups();
  } else {
    console.log("No user is signed in.");
  }
});

function searchMyGroups() {
    var search = document.getElementById("searchBox");
    var filter = search.value.toLowerCase();
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

function loadGroups() {

  loader.style.display = ""
  this.groups = [];
  getMyGroups();

}

function getMyGroups() {
	const users = firebase.database().ref("Users");
	const query = users.child(firebase.auth().currentUser.uid);

	query.once('value', function(snapshot) {
		user = snapshot.val();

		localStorage.setItem("currentUser", JSON.stringify(user));

		if (snapshot.hasChild("groups")) {

			groupUIDs = user["groups"];

			for (var i = 0; i < groupUIDs.length; i++) {
				getGroup(groupUIDs[i]);
			}

		} else {
			loader.style.display = "none";
		}

	});
}

function getGroup(uid) {
    
    const groups = firebase.database().ref("Groups");
    const query = groups.child(uid);

    query.once('value', function(childSnapshot) {

        var group = {
         uid: childSnapshot.key,
         name: childSnapshot.child('name').val(),
         lowercasedName: childSnapshot.child('lowercasedName').val(),
         city: childSnapshot.child('city').val(),
         state: childSnapshot.child('state').val(),
         createdBy: childSnapshot.child('createdBy').val(),
         lowercasedCreatedBy: childSnapshot.child('lowercasedCreatedBy').val(),
         createdByUid: childSnapshot.child('createdByUid').val(),
         password: childSnapshot.child('password').val(),
         admins: childSnapshot.child('admins').val(),
         users: childSnapshot.child('users').val()
        };

      	if (group.name) {
        	this.groups.push(group);
    	} else {
    		deletedGroups = deletedGroups + 1;
    	}

        if (this.groups.length == this.groupUIDs.length - deletedGroups) {
        	if (this.groups.length > 0) {
		        addRows();
		      	addRowHandlers();
		      	localStorage.setItem("groups", JSON.stringify(groups));
		    }
	      	loader.style.display = "none"
        }

    }, function(error) {
    	deletedGroups = deletedGroups + 1;

    	if (this.groups.length == this.groupUIDs.length - deletedGroups) {
    		if (this.groups.length > 0) {
		        addRows();
		      	addRowHandlers();
		      	localStorage.setItem("groups", JSON.stringify(groups));
	      	}
	      	loader.style.display = "none"
        }

    });

}

function addRows() {

  var g = this.groups;
  for (i = 0; i < g.length; i++) {
      addRow(g[i].uid, g[i].name, g[i].city, g[i].state, g[i].createdBy, Object.keys(g[i].admins), i);
  }

}

function addRow(uid, name, city, state, createdBy, admins, position) {

  if (!document.getElementsByTagName) return;

    tabBody=document.getElementsByTagName("tbody").item(0);

    row=document.createElement("tr");

    var pathReference = storage.ref(uid + ".jpg");
    imageCell = document.createElement("td");
    imageCell.setAttribute("class", "imageCell");
    imageElement = document.createElement("img");
    imageElement.setAttribute("id", "imageElement" + position);
    imageElement.setAttribute("onerror", "this.style.display='none'");
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

    modifyCell = document.createElement("td");
    modifyCell.setAttribute("class", "modifyCell");
    
    if (admins.includes(firebase.auth().currentUser.uid)) {
	    editElement = document.createElement("button");
	    editElement.setAttribute("class", "editGroupButton");
	    editElement.setAttribute("id", "edit" + position);
	    editElement.innerText = "Edit";
	    modifyCell.appendChild(editElement);
	}

	deleteElement = document.createElement("button");
    deleteElement.setAttribute("class", "deleteGroupButton");
    deleteElement.setAttribute("id", "delete" + position);
   	deleteElement.innerText = "Delete";
   	modifyCell.appendChild(deleteElement);

    row.appendChild(imageCell);
    row.appendChild(textCell);
    row.appendChild(modifyCell);

    tabBody.appendChild(row);

}

function updateUserGroups(userUID, groups, previousGroupUIDs, groupUID) {
	
	const userRef = firebase.database().ref().child("Users").child(userUID).child("groups");
	const adminRef = firebase.database().ref().child("Groups").child(groupUID).child("admins").child(userUID);

	const usersRef = firebase.database().ref().child("Groups").child(groupUID).child("users").child(userUID);
	const adminsRef = firebase.database().ref().child("Groups").child(groupUID).child("admins");
	
	adminsRef.once('value', function(snapshot) {
		var admins = snapshot.val();
		var keys = Object.keys(admins)
		if (keys.length == 1 && keys[0] == userUID) {
			groupUIDs = previousGroupUIDs;
			alert("You are the only administrator for this group, so you cannot remove it from \"My Groups\".");
		} else {
			userRef.set(groups, function(error) {
		    	if (error) {
		    		alert(error.message);
		    	} else {
		    		adminRef.set(null, function(error) {
		    			if (error) {
		    				alert(error.message);
		    			} else {
		    				usersRef.set(null, function(error) {
		    					if (error) {
		    						alert(error.message);
		    					} else {
		    						var table = document.getElementById("groupsTable");
		    						while(table.rows.length > 0) {
		  								table.deleteRow(0);
									}
		    						loadGroups();
		    					}
		    				});
		    			}
		    		});
		    	}
		    });
		}
	});
}

function addRowHandlers() {

  var table = document.getElementById("groupsTable");
  var rows = table.getElementsByTagName("tr");

  for (i = 0; i < rows.length; i++) {
    
	    var currentRow = table.rows[i];
	    if (document.getElementById("edit" + i)) {
	    	currentEditButton = document.getElementById("edit" + i);
	    } else {
	    	currentEditButton = null;
	    }
	    var currentDeleteButton = document.getElementById("delete" + i);

	    var clickHandler = function(row) {
	      return function(ev) {

	      	ev.stopPropagation();
	        var position = row.rowIndex;
	        var selectedGroup = groups[position];

	        localStorage.setItem("group", JSON.stringify(selectedGroup));

	        window.location.href = "directory.html";

	      };

	    };

	    var editClickHandler = function(row) {
	    	return function(ev) {
	    		ev.stopPropagation();
	    		
	    		var position = row.rowIndex;
	    		var selectedGroup = groups[position];

	        	localStorage.setItem("group", JSON.stringify(selectedGroup));

	    		window.location.href = "createGroup.html";
	    	};
	    };
	    
	    var deleteClickHandler = function(row) {
	    	return function(ev) {
	    		
	    		ev.stopPropagation();
	        	var position = row.rowIndex;

	        	var groupToDeleteUID = groups[position].uid;
	        	var groupToDeleteName = groups[position].name;
	        	var index = groupUIDs.indexOf(groupToDeleteUID);

	        	var modal = document.getElementById("confirmDeleteModal");

	        	var confirmDeleteGroupButton = document.getElementById("confirmDeleteGroupButton");
	        	var cancelDeleteGroupButton = document.getElementById("cancelDeleteGroupButton");

	        	var passwordPrompt = document.getElementById('deleteGroupPrompt');
	        	passwordPrompt.innerHTML = "This will only remove \"" + groupToDeleteName + "\" from \"My Groups\". You will be able to add it back again later. Continue?";

	        	modal.style.display = "block";

	  			confirmDeleteGroupButton.onclick = function() {

	  				previousGroupUIDs = JSON.parse(JSON.stringify(groupUIDs));

					if (index > -1) {
	        			groupUIDs.splice(position, 1);
	        		};

	    			updateUserGroups(firebase.auth().currentUser.uid, groupUIDs, previousGroupUIDs, groupToDeleteUID,);
	    			modal.style.display = "none";

	    		}

	    		cancelDeleteGroupButton.onclick = function() {
	    			modal.style.display = "none";
	    		}
	    	};
	    };

	    currentRow.onclick = clickHandler(currentRow);
    	currentDeleteButton.onclick = deleteClickHandler(currentRow);
    	if (currentEditButton) {
    		currentEditButton.onclick = editClickHandler(currentRow);
    	}

  	}

}