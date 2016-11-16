
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

function addMarker(myLatLng, map){ // myLatLng: {lat: 40.2501, lng: -111.649}
	var marker = new google.maps.Marker({
		position: myLatLng,
		map: map,
		title: 'Hello World!'
	});
}

var database = firebase.database();
var comments = database.ref("comments/");

function addAlert(Location, Comment){ // params given by modal
  console.log(Location, Comment);
  
  chattyref.push({
    location: Location,
    comment: Comment
  })
}

function resetDB(){ // if we ever want to reset data - maybe put a button in for this during testing?
  database.ref('comments/').set({ // replace whatever was there
    location: null,
    comment: null
  });
  console.log("DB IS RESET");
}

function deleteTweet(key){ // deleting comments - work on this later
  conole.log("delete");
  //getelementbyid('key').delete(); --- or however we set that up in the html
  //then delete out of database 
}

chattyref.on('child_added',function(data){ // when alert is added to DB
  var Alert = data.val();
  console.log(data.val().location); // checking that it saved to database correctly
  console.log(data.val().comment);

  //note: get the timestamp also

  $("#thecomments").append("<p class = \"comment\"> User: " + data.val().location +  "<br></br>Comment: " + data.val().message + "<button class = \"button\" onclick=\"delete\">X</button></p>")
  //(postElement,data.key, data.val().text)}
});