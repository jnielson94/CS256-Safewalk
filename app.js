
function initMap() {
// Create a map object and specify the DOM element for display.
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 40.2501, lng: -111.649},
//    scrollwheel: false,
    zoom: 14
  });
  myMap = map;

  map.addListener('click', function(e) {
  	addMarker(e.latLng, map);
  });
}

// Initialize Firebase
var config = {
  apiKey: "AIzaSyBZrlFM-UWvijdFWL6aBYWaARHvAbd8Yeo",
  authDomain: "safewalk-4c340.firebaseapp.com",
  databaseURL: "https://safewalk-4c340.firebaseio.com",
  storageBucket: "safewalk-4c340.appspot.com",
  messagingSenderId: "680615541265"
};
firebase.initializeApp(config);

var modal = document.getElementById('addAlertModal');
var btn = document.getElementById('myBtn');
var close = document.getElementsByClassName('close')[0];

//Opens modal when user clicks on the button (for now)
btn.onclick = function() {
  modal.style.display = "block";
}
//Closes modal when user clicks on close
close.onclick = function() {
  modal.style.display = "none";
}
//Closes modal when user clicks elsewhere
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

function addMarker(var myLatLng, var map){ // myLatLng: {lat: 40.2501, lng: -111.649}
	var marker = new google.maps.Marker({
		position: myLatLng,
		map: map,
		title: 'Hello World!'
	});
}
