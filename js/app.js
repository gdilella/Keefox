var sdcard = navigator.getDeviceStorage('sdcard');
var fileName = null;

var displayDetails = function(details) {
	var title = document.querySelector('#details-title');
	if (title.firstChild) {
		title.removeChild(title.firstChild);
	}
	title.appendChild(document.createTextNode(details["Title"]));
	var list = document.querySelector('#details-list');
	while (list.firstChild) {
		list.removeChild(list.firstChild);
	}
	for (var key in details) {
		if (details[key] != '') {
			var li = document.createElement("li");
			list.appendChild(li);
			
			var pKey = document.createElement("p");
			pKey.appendChild(document.createTextNode(key));
			
			var pValue = document.createElement("p");
			pValue.appendChild(document.createTextNode(details[key]));
			
			if (key == "URL") {
				var a = document.createElement('a');
				a.href = details[key];
				a.target = "_black";
				a.appendChild(pKey);
				a.appendChild(pValue);
				li.appendChild(a);
			}
			else {
				li.appendChild(pKey);
				li.appendChild(pValue);
			}
		}
	}
}

var displayEntriesTitles = function(entries) {
	var title = document.querySelector('#file-entries-title');
	if (title.firstChild) {
		title.removeChild(title.firstChild);
	}
	title.appendChild(document.createTextNode(fileName));
	var list = document.querySelector('#file-entries-list');
	while (list.firstChild) {
		list.removeChild(list.firstChild);
	}
	for (var i in entries) {
		var entry = entries[i];
		var headerText = entry["Title"];
		headerText = document.createTextNode(headerText);
		var p = document.createElement('p');
		p.appendChild(headerText);
		var li = document.createElement('li');
		list.appendChild(li);
		var a = document.createElement('a');
		li.appendChild(a);
		a.appendChild(p);
		a.href = '#';
		a.addEventListener ('click', (function (entry) { return function (e) {
			displayDetails(entry);
			document.querySelector('#file-entries').className = 'currentToLeft';
			document.querySelector('#details').className = 'current';
		}})(entry));
	}
	document.querySelector('#enter-password').className = 'currentToLeft';
	document.querySelector('#file-entries').className = 'current';
}

var passwordEntered = function() {
	document.querySelector('#spinner').hidden = false;
	var reader = new FileReader();
	reader.onload = function(e) {
		var data = e.target.result;
		data = new jDataView(data, 0, data.length, true);
		var password = document.querySelector('#password').value;
		var passes = [readPassword(password)];
		try {
			var entries = readKeePassFile(data, passes);
			displayEntriesTitles(entries);
		} catch (e) {
			console.log(e);
		}
	};
	reader.onerror = function(e) {
		bp_alert("Cannot load local file " + file.name);
	};
	
	var request = sdcard.get(fileName);
	
	request.onsuccess = function () {
		reader.readAsArrayBuffer(this.result);
	}
	
	request.onerror = function () {
		console.warn('Unable to get the file: ' + this.error);
	}
}

var kdbxSelected = function (e) {
	fileName = e.target.parentElement.dataset.name;
	document.querySelector('#spinner').hidden = true;
	document.querySelector('#password').value = '';
	document.querySelector('#enter-password').className = 'current';
	document.querySelector('#select-file').className = 'currentToLeft';
}

var files = sdcard.enumerate();

// Loop through the kdbx files and create a list entry for each.
files.onsuccess = function(e) {
	var file = this.result;
	if (file != null && file.name.split('.').pop() === 'kdbx') {
		var li = document.createElement('li');
		var a = document.createElement('a');
		a.href = '#';
		a.dataset.name = file.name.replace(/^.*[\\\/]/, '');
		var p = document.createElement('p');
		p.appendChild(document.createTextNode(a.dataset.name));
		a.appendChild(p);
		li.appendChild(a);

		// We'll list the kdbx files inside this element
		var container = document.getElementById('kdbx-files');
		container.appendChild(li);
		// Each entry has this event handler.
		a.addEventListener ('click', kdbxSelected);
	}
	this.done = false;

	if (!this.done) {
		this.continue();
	}
};

files.onerror = function() {
	console.log(this.error);
};

//file select
document.querySelector('#btn-open-file').addEventListener ('click', function () {
	document.querySelector('#select-file').className = 'current';
	document.querySelector('[data-position="current"]').className = 'left';
});
document.querySelector('#btn-select-file-back').addEventListener ('click', function () {
	document.querySelector('#select-file').className = 'right';
	document.querySelector('[data-position="current"]').className = 'current';
});

//enter password
document.querySelector('#btn-password-done').addEventListener ('click', passwordEntered);
document.querySelector('#btn-password-close').addEventListener ('click', function () {
	document.querySelector('#enter-password').className = 'right';
	document.querySelector('#select-file').className = 'leftToCurrent';
});

//file entries
document.querySelector('#btn-file-entries-back').addEventListener ('click', function () {
	document.querySelector('#select-file').className = 'leftToCurrent';
	document.querySelector('#file-entries').className = 'right';
});

//details
document.querySelector('#details-back').addEventListener ('click', function () {
	document.querySelector('#file-entries').className = 'leftToCurrent';
	document.querySelector('#details').className = 'right';
});

//help
document.querySelector('#btn-help').addEventListener ('click', function () {
	document.querySelector('#help').className = 'current';
	document.querySelector('[data-position="current"]').className = 'left';
});
document.querySelector('#btn-help-back').addEventListener ('click', function () {
	document.querySelector('#help').className = 'right';
	document.querySelector('[data-position="current"]').className = 'current';
});

//about
document.querySelector('#btn-about').addEventListener ('click', function () {
	document.querySelector('#about').className = 'current';
	document.querySelector('[data-position="current"]').className = 'left';
});
document.querySelector('#btn-about-back').addEventListener ('click', function () {
	document.querySelector('#about').className = 'right';
	document.querySelector('[data-position="current"]').className = 'current';
});