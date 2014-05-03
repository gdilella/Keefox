// variable which will hold the database connection
var db;

function initializeDB() {
if (window.indexedDB) {
console.log("IndexedDB support is there");
}
else {
alert("Indexed DB is not supported. Where are you trying to run this ? ");
}

// open the database
// 1st parameter : Database name. We are using the name 'notesdb'
// 2nd parameter is the version of the database.
var request = indexedDB.open('db', 1);

request.onsuccess = function (e) {
// e.target.result has the connection to the database
db = e.target.result;
//Alternately, if you want - you can retrieve all the items
}

request.onerror = function (e) {
console.log(e);
};

// this will fire when the version of the database changes
// We can only create Object stores in a versionchange transaction.
request.onupgradeneeded = function (e) {
// e.target.result holds the connection to database
db = e.target.result;

if (db.objectStoreNames.contains("password")) {
db.deleteObjectStore("password");
}

// create a store named 'notes'
// 1st parameter is the store name
// 2nd parameter is the key field that we can specify here. Here we have opted for autoIncrement but it could be your
// own provided value also.
var objectStore = db.createObjectStore('password', { keyPath: 'id', autoIncrement: true });

console.log("Object Store has been created");
};
