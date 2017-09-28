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

document.getElementById("byGroup").checked = true;

localStorage.setItem("groups", "null");

var loader = document.getElementById('loader');
loader.style.display = "none"

var myGroupsButton = document.getElementById('myGroupsButton');
myGroupsButton.onclick = function() {
    window.location.href = "myGroups.html";
}

var storage = firebase.storage();
var title = document.getElementById('title');
var search = document.getElementById('searchBox');
var groups = [];
var currentUserGroups = [];
var currentUserName;

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    console.log("got user");
    getCurrentUserGroups();
  } else {
    console.log("No user is signed in.");
  }
});

function searchGroups() {

  this.groups = [];
  loader.style.display = ""

  var table = document.getElementById("groupsTable");
  while(table.rows.length > 0) {
      table.deleteRow(0);
  }

  var searchTerm = search.value.toLowerCase();

  if (searchTerm != "") {
    if (document.getElementById("byGroup").checked) {
      console.log("here");
      queryGroups("lowercasedName", searchTerm);
    } else if (document.getElementById("byCreator").checked) {
      console.log("there");
      queryGroups("lowercasedCreatedBy", searchTerm);
    } else if (document.getElementById("byUniqueID").checked) {
      getGroup(search.value);
    }
  } else {
    loader.style.display = "none"
    this.groups = [];
  }

}

function queryGroups(searchKey, searchTerm) {
    
    const groups = firebase.database().ref("Groups");
    const query = groups
                .orderByChild(searchKey)
                .startAt(searchTerm)
                .limitToFirst(20);

    query.once('value', function(snapshot) {

      snapshot.forEach(function(childSnapshot) {

        if (!currentUserGroups) {
          currentUserGroups = [];
        }

          if (!currentUserGroups.includes(childSnapshot.key)) {

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

        }

      });

      addRows();
      addRowHandlers();

      localStorage.setItem("groups", JSON.stringify(groups));
      loader.style.display = "none"

    }, function(err) {
      console.log(err)
    });

}

function getGroup(groupUID) {

    const groupRef = firebase.database().ref("Groups").child(groupUID);

    groupRef.once('value', function(childSnapshot) {

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

      console.log(group.name);
      if (group.name) {
        this.groups = [group];
        addRows();
        addRowHandlers();
        localStorage.setItem("groups", JSON.stringify(groups));
        loader.style.display = "none"
      } else {
        loader.style.display = "none"
      }



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
    imageElement.setAttribute("onerror", "this.style.display='none'");
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

    row.appendChild(imageCell);
    row.appendChild(textCell);

    tabBody.appendChild(row);

}

function addRowHandlers() {

  var table = document.getElementById("groupsTable");
  var rows = table.getElementsByTagName("tr");

  for (i = 0; i < rows.length; i++) {

    var currentRow = table.rows[i];
    var createClickHandler = function(row) {
      return function() {

        var cell = row.getElementsByTagName("td")[1];
        var position = row.rowIndex;
        
        var modal = document.getElementById('joinGroupModal');

        var joinGroupButton = document.getElementById('joinGroupButton');
        var cancelJoinGroupButton = document.getElementById('cancelJoinGroupButton');

        var passwordPrompt = document.getElementById('joinGroupPrompt');
        passwordPrompt.innerHTML = "A password is required to join the group \"" + groups[position].name + "\".";

        modal.style.display = "block";

  			joinGroupButton.onclick = function() {

          var password = groups[position].password;
          var passwordInput = document.getElementById("passwordInput");
          var input = passwordInput.value;

          if (password != input) {
            passwordPrompt.innerHTML = "A password is required to join the group \"" + groups[position].name + "\". Incorrect. Please try again.";
            return;
          }
          
          var selectedGroupUID = groups[position].uid;
          currentUserGroups.push(selectedGroupUID);

          var currentUserUID = firebase.auth().currentUser.uid;

          if (groups[position].users) {
            var updatedUserGroups = groups[position].users;
          } else {
            var updatedUserGroups = {};
          }
          
          updatedUserGroups[currentUserUID] = currentUserName;

          const userRef = firebase.database().ref("Users").child(currentUserUID).child("groups");
          const groupRef = firebase.database().ref("Groups").child(selectedGroupUID).child("users");

          userRef.set(currentUserGroups, function(error) { 
            if (error) {
              console.log(error);
            } else {
              groupRef.set(updatedUserGroups, function(error) {
                if (error) {
                  console.log(error);
                } else {
                  window.location.href = "myGroups.html"
                }
              });
            }
          });
        };

        cancelJoinGroupButton.onclick = function() {
          modal.style.display = "none";
        };
      };
    };
      
    currentRow.onclick = createClickHandler(currentRow);

  }

}

function getCurrentUserGroups() {
    
    var currentUserUID = firebase.auth().currentUser.uid;
    const query = firebase.database().ref("Users").child(currentUserUID);
          
    query.once('value', function(snapshot) {
        
        currentUserGroups = snapshot.child("groups").val();
        currentUserName = snapshot.child("name").val();

    });

}

var searchButton = document.getElementById("searchButton");
searchButton.onclick = function() {
    searchGroups();
}
