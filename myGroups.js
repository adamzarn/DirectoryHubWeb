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
    window.location.href = "searchGroups.html";
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
var deletedGroups = 0;

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    loadGroups();
  } else {
    console.log("No user is signed in.");
  }
});

function searchMyGroups() {
    var search = document.getElementById("searchBox");
    var filter = search.value.toLowerCase();
    console.log(filter);
    table = document.getElementById("groupsTable");
    rows = table.getElementsByTagName("tr");
    for (i = 0; i < rows.length; i++) {
        var cell = rows[i].getElementsByTagName("td")[1];
        var header = cell.getElementsByTagName("p")[0];
        console.log(header.innerText.toLowerCase());
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
	const query = users.child(firebase.auth().currentUser.uid).child("groups");

	query.once('value', function(snapshot) {
		groupUIDs = snapshot.val();

		for (var i = 0; i < groupUIDs.length; i++) {
			getGroup(groupUIDs[i]);
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

        this.groups.push(group);

        if (this.groups.length == this.groupUIDs.length - deletedGroups) {
	        addRows();
	      	addRowHandlers();

	      	localStorage.setItem("groups", JSON.stringify(groups));
	      	loader.style.display = "none"
        }

    }, function(error) {
    	deletedGroups = deletedGroups + 1;
    });

}

function addRows() {

  var g = this.groups;
  for (i = 0; i < g.length; i++) {
      addRow(g[i].uid, g[i].name, g[i].city, g[i].state, g[i].createdBy, i);
  }

}

function addRow(uid, name, city, state, createdBy, position) {

  if (!document.getElementsByTagName) return;

    tabBody=document.getElementsByTagName("tbody").item(0);

    row=document.createElement("tr");

    var pathReference = storage.ref(uid + ".jpg");
    imageCell = document.createElement("td");
    imageCell.setAttribute("class", "imageCell");
    imageElement = document.createElement("img");
    imageElement.setAttribute("id", "imageElement" + position);
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

    deleteCell = document.createElement("td");
    deleteCell.setAttribute("class", "deleteCell");
    deleteElement = document.createElement("button");
    deleteElement.setAttribute("class", "deleteButton");
    deleteElement.setAttribute("id", "delete" + position);
    deleteElement.innerText = "X";
    deleteCell.appendChild(deleteElement);

    row.appendChild(imageCell);
    row.appendChild(textCell);
    row.appendChild(deleteCell);

    tabBody.appendChild(row);

}

function deleteGroup(uid) {

	const groupRef = firebase.database().ref().child("Groups").child(uid)
    const directoryRef = firebase.database().ref().child("Directories").child(uid)
    const imageRef = firebase.storage().child("\(uid).jpg")
        
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

function updateUserGroups(userUID, groups) {
	const userRef = firebase.database().ref().child("Users").child(userUID);
    userRef.child("groups").set(groups, function(error) {
    	if (error) {
    		console.log(error);
    	} else {
    		console.log("success");
    		var table = document.getElementById("groupsTable");
    		while(table.rows.length > 0) {
  				table.deleteRow(0);
			}
    		loadGroups();
    	}
    });

}

function addRowHandlers() {

  var table = document.getElementById("groupsTable");
  var rows = table.getElementsByTagName("tr");

  for (i = 0; i < rows.length; i++) {
    
    var currentRow = table.rows[i];
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

    
    var deleteClickHandler = function(row) {
    	return function(ev) {
    		
    		ev.stopPropagation();
        	var position = row.rowIndex;

        	var groupToDeleteUID = groups[position].uid;
        	var index = groupUIDs.indexOf(groupToDeleteUID);

        	if (index > -1) {
        		groupUIDs.splice(position, 1);
        	};

    		updateUserGroups(firebase.auth().currentUser.uid, groupUIDs);

    	}

    }
     
    currentRow.onclick = clickHandler(currentRow);
    currentDeleteButton.onclick = deleteClickHandler(currentRow);

  }

}

$("#groupsTable").on('click', 'tr', function () {
    $(this).toggleClass('selected');
});

$('#groupsTable').on('click','.deleteButton', function(e) {
    alert('test')
     e.stopPropagation();
});