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

var entries = [];
var group = JSON.parse(localStorage.getItem("group"));

localStorage.setItem("groupUID", group.uid);
var myGroupsButton = document.getElementById("myGroupsButton");

var searchBox = document.getElementById("searchBoxDirectory");

var loader = document.getElementById("loader");
loader.style.display = "";

document.getElementById("downloadPDFButton").onclick = function() {
    generatePDF(group.name, entries);
}

myGroupsButton.onclick = function() {
  searchBox.value = "";
  window.location.href = "myGroups.html";
}

function search() {
    filter = searchBox.value.toLowerCase();
    table = document.getElementById("directoryTable");
    rows = table.getElementsByTagName("tr");
    for (i = 0; i < rows.length; i++) {
        var cell = rows[i].getElementsByTagName("td")[0];
        var header = cell.getElementsByTagName("p")[0];
        if (header.innerText.toLowerCase().indexOf(filter) > -1) {
            rows[i].style.display = "";
        } else {
            rows[i].style.display = "none";
        }
    }
}

var addEntryButton = document.getElementById("addEntryButton");
addEntryButton.style.display = "none";

var admins = group.admins;
var adminKeys = Object.keys(admins);

firebase.auth().onAuthStateChanged(function(user) {
  if (adminKeys.includes(user.uid)) {
    addEntryButton.style.display = "";
  }
});

addEntryButton.onclick = function() {

    localStorage.setItem("currentEntry", "");
    window.location.href = "editEntry.html";

}

if (group == null) {
  searchBox.value = "";
  window.location.href = "index.html"
}

getDirectory();

function header(name, people) {
  var husband = "";
  var wife = "";
  var single = "";
  people.forEach(function(person) {
    if (person.type == "Husband") {
      husband = person.name;
    } else if (person.type == "Wife") {
      wife = person.name;
    } else if (person.type == "Single") {
      single = person.name;
    }
  })
  if (husband != "") {
    return name + ", " + husband + " & " + wife;
  } else {
    return name + ", " + single;
  }
}

function childrenString(people) {
  people.sort(compareBirthOrders);
  children = [];
  people.forEach(function(person) {
    if (person.type == "Child") {
      children.push(person.name);
    }
  })
  if (children.length == 1) {
    return children[0];
  } else if (children.length == 2) {
    return children[0] + " & " + children[1];
  } else if (children.length > 2) {
    var childrenString = children[0];
    for (i = 1; i < children.length; i++) {
      if (i < children.length - 1) {
        childrenString = childrenString + ", " + children[i];
      } else {
        childrenString = childrenString + ", & " + children[i];
      }
    }
    return childrenString;
  } else {
    return "";
  }
  return "";
}

function compareBirthOrders(a, b) {
  if (a.birthOrder < b.birthOrder)
    return -1;
  if (a.birthOrder > b.birthOrder)
    return 1;
  return 0;
}

function compareHeaders(a, b) {
  var headerA = header(a.name, a.people)
  var headerB = header(b.name, b.people)
  console.log(headerA)
  console.log(headerB)
  if (headerA < headerB)
    return -1;
  if (headerA > headerB)
    return 1;
  return 0;
}

function addRow(key, name, phone, email, street, line2, line3, city, state, zip, people) {

  if (!document.getElementsByTagName) return;

    tabBody=document.getElementsByTagName("tbody").item(0);

    row=document.createElement("tr");

    cell = document.createElement("td");
    cell.setAttribute("class", "cell");
      nameElement = document.createElement("p");
      nameElement.setAttribute("class", "nameHeader");
      nameNode = document.createTextNode(header(name, people));
      nameElement.appendChild(nameNode);
      cell.appendChild(nameElement);

      if (phone != "") {
        phoneElement = document.createElement("p");
        phoneElement.setAttribute("class", "line");
        phoneNode = document.createTextNode(phone);
        phoneElement.appendChild(phoneNode);
        cell.appendChild(phoneElement);
      }

      if (email != "") {
        emailElement = document.createElement("p");
        emailElement.setAttribute("class", "line");
        emailNode = document.createTextNode(email);
        emailElement.appendChild(emailNode);
        cell.appendChild(emailElement);
      }

      if (street != "") {
        streetElement = document.createElement("p");
        streetElement.setAttribute("class", "line");
        streetNode = document.createTextNode(street);
        streetElement.appendChild(streetNode);
        cell.appendChild(streetElement);
      }

      if (line2 != "") {
        line2Element = document.createElement("p");
        line2Element.setAttribute("class", "line");
        line2Node = document.createTextNode(line2);
        line2Element.appendChild(line2Node);
        cell.appendChild(line2Element);
      }

      if (line3 != "") {
        line3Element = document.createElement("p");
        line3Element.setAttribute("class", "line");
        line3Node = document.createTextNode(line3);
        line3Element.appendChild(line3Node);
        cell.appendChild(line3Element);
      }

      var cityStateZip = "";
      if (city != "") {
          cityStateZip = city + ", " + state + " " + zip;
      }

      if (cityStateZip != "") {
        cityStateZipElement = document.createElement("p");
        cityStateZipElement.setAttribute("class", "line");
        cityStateZipNode = document.createTextNode(cityStateZip);
        cityStateZipElement.appendChild(cityStateZipNode);
        cell.appendChild(cityStateZipElement);
      }

      var children = childrenString(people);
      if (children != "") {
        childrenStringElement = document.createElement("p");
        childrenStringElement.setAttribute("class", "line");
        childrenStringNode = document.createTextNode(children);
        childrenStringElement.appendChild(childrenStringNode);
        cell.appendChild(childrenStringElement);
      }

    if (children != "") {
      childrenStringElement.setAttribute("class", "lastLine");
    } else if (cityStateZip != "") {
      cityStateZipElement.setAttribute("class", "lastLine");
    } else if (line3 != "") {
      line3Element.setAttribute("class", "lastLine");
    } else if (line2 != "") {
      line2Element.setAttribute("class", "lastLine");
    } else if (street != "") {
      streetElement.setAttribute("class", "lastLine");
    } else if (email != "") {
      emailElement.setAttribute("class", "lastLine");
    } else if (phone != "") {
      phoneElement.setAttribute("class", "lastLine");
    }

    row.appendChild(cell);

    tabBody.appendChild(row);

}

function addRowHandlers() {

  var table = document.getElementById("directoryTable");
  var rows = table.getElementsByTagName("tr");

  for (i = 0; i < rows.length; i++) {

    var currentRow = table.rows[i];
    var createClickHandler = function(row) {
      return function() {

          var cell = row.getElementsByTagName("td")[0];
          var position = row.rowIndex;
          var name = cell.innerHTML;

          var entry = entries[position];

          localStorage.setItem("currentEntryKey", entry.key);
          searchBox.value = "";
          window.location.href = "entry.html";

        };
    };
    currentRow.onclick = createClickHandler(currentRow);
  }
}

function getDirectory() {

  var ref = firebase.database().ref("Directories").child(group.uid);

  var groupName = document.getElementById('groupName');
  groupName.innerHTML = group.name;

    ref.once("value", function(snapshot) {
        entries = [];
        snapshot.forEach(function(entry) {

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

            entries.push(newEntry);
  })

  entries.sort(compareHeaders);

  entries.forEach(function(newEntry) {
    addRow(newEntry.key, newEntry.name, newEntry.phone, newEntry.email, newEntry.street, newEntry.line2, newEntry.line3, newEntry.city, newEntry.state, newEntry.zip, newEntry.people);
  });

  addRowHandlers();
  loader.style.display = "none";

});

}

function generatePDF(groupName, entries) {

  //require dependencies
  var PDFDocument = require('pdfkit');
  var blobStream  = require('blob-stream');

  //create a document the same way as above
  var doc = new PDFDocument({
    margin:36
  });

  doc.fontSize(20);

  var today = new Date();
  var months = ["January", "Feburary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  var date = months[today.getMonth()] + " " + today.getFullYear();
  doc.text(groupName + " Directory" + " - " + date, {
    align: 'center'
  });
  doc.moveDown();

  //pipe the document to a blob
  var stream = doc.pipe(blobStream());

  var directoryText = "";
  var columnLines = 72;
  var columnNumber = 1;
  var pageNumber = 1;
  var columnLinesUsed = 0
  entries.forEach(function(entry) {
    var lines = getNumberOfLines(entry);
    if (pageNumber > 1) {
      columnLines = 77;
    }
    if (columnLines - columnLinesUsed < lines) {
      while (columnLinesUsed < columnLines) {
        directoryText = directoryText + "\n";
        columnLinesUsed = columnLinesUsed + 1;
      }
      columnLinesUsed = 0;
      columnNumber = columnNumber + 1;
      if (columnNumber % 3 == 1) {
        pageNumber = pageNumber + 1;
      }
    }
    directoryText = directoryText + header(entry.name, entry.people) + "\n";
    if (entry.phone != "") {
      directoryText = directoryText + entry.phone + "\n";
    }
    entry.people.forEach(function(person) {
      if (person.phone != "") {
        if (entry.people.length > 1) {
          directoryText = directoryText + person.name + ": " + person.phone + "\n";
        } else {
          directoryText = directoryText + person.phone + "\n";
        }
      }
    });
    if (entry.street != "") {
      directoryText = directoryText + entry.street + "\n";
    }
    if (entry.line2 != "") {
      directoryText = directoryText + entry.line2 + "\n";
    }
    if (entry.line3 != "") { 
      directoryText = directoryText + entry.line3 + "\n";
    }
    if (entry.city != "") {
      directoryText = directoryText + entry.city + ", " + entry.state + " " + entry.zip + "\n";
    }
    if (entry.email != "") {
      directoryText = directoryText + entry.email + "\n";
    }
    entry.people.forEach(function(person) {
      if (person.email != "") {
        if (entry.people.length > 1) {
          var personEmail = person.email + " - " + person.name;
          if (personEmail.length < 40) {
            directoryText = directoryText + personEmail + "\n";
          } else {
            directoryText = directoryText + person.email + "\n";
          }
        } else {
          directoryText = directoryText + person.email + "\n";
        }
      }
    });
    var children = childrenString(entry.people);
    if (children != "") {
      if (children.length < 40) {
        directoryText = directoryText + children + "\n";
      } else {
        directoryText = directoryText + children.substring(0,36) + "..." + "\n";
      }
    }
    if (columnLinesUsed + lines == columnLines) {
      columnLinesUsed = columnLinesUsed + lines;
    } else {
      directoryText = directoryText + "\n" ;
      columnLinesUsed = columnLinesUsed + lines + 1;
    }
    console.log(columnLinesUsed);
  });

  doc.fontSize(8);
  doc.text(directoryText, {
    columns: 3
  });

  doc.end()

  stream.on('finish', () => {
      //get a blob you can do whatever you like with

      blob = stream.toBlob(groupName + ".pdf");
      blobUrl = URL.createObjectURL(blob);

      var element = document.createElement('a');
      element.setAttribute('href', blobUrl);
      element.setAttribute('download',  groupName + ' Directory.pdf');

      element.style.display = 'none';
      document.body.appendChild(element);

      element.click();

      document.body.removeChild(element);

  });

}

function getNumberOfLines(entry) {
    var lines = 0;
    lines = lines + 1;
    if (entry.phone != "") {
      lines = lines + 1;
    }
    entry.people.forEach(function(person) {
      if (person.phone != "") {
        if (entry.people.length > 1) {
          lines = lines + 1;
        } else {
          lines = lines + 1;
        }
      }
    });
    if (entry.street != "") {
      lines = lines + 1;
    }
    if (entry.line2 != "") {
      lines = lines + 1;
    }
    if (entry.line3 != "") { 
      lines = lines + 1;
    }
    if (entry.city != "") {
      lines = lines + 1;
    }
    if (entry.email != "") {
      lines = lines + 1;
    }
    entry.people.forEach(function(person) {
      if (person.email != "") {
        if (entry.people.length > 1) {
          lines = lines + 1;
        } else {
          lines = lines + 1;
        }
      }
    });
    if (childrenString(entry.people) != "") {
      lines = lines + 1;
    }
    return lines;
}




