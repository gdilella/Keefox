var sdcard = navigator.getDeviceStorage('sdcard');

$( "#btnAddFile" ).click(function() {

var test = sdcard.addNamed("pswkp.txt");

test.onsuccess = function () {
  var file = this.result;
  alert("funziona");
}

test.onerror = function () {
  alert("errore"+ this.error);
}

});

$( "#btnAddPsw" ).click(function() {

var request = sdcard.get("pswkp.txt");

request.onsuccess = function () {
  var file = this.result;
  alert("File ottenuto");
}

request.onerror = function () {
  alert("file non ottenuto"+ this.error);
}

});




