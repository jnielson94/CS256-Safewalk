var drectionsDisplay;
var directionsService;
var map = '';

function initMap() {
  directionsDisplay = new google.maps.DirectionsRenderer();
  directionsService = new google.maps.DirectionsService();
// Create a map object and specify the DOM element for display.
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 40.2501, lng: -111.649},
    //    scrollwheel: false,
    zoom: 14
  })

  directionsDisplay.setMap(map);


  // if the client's geolocation is available, center the map on that location
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      map.setCenter(initialLocation);
    });
  }

  map.addListener('click', function (e) {
    document.getElementById('addAlertModal').style.display = 'block'
    document.getElementById('locationText').value = JSON.stringify(e.latLng.toJSON())
  })
}

$("#calcroutebtn").click(function(){
  calcRoute();
});

function calcRoute() {
  var start = $("#originbox").val();
  var end = $("#destinationbox").val();
  var request = {
    origin: start,
    destination: end,
    travelMode: 'WALKING'
  };
  directionsService.route(request, function(result, status) {
    if (status == 'OK') {
      directionsDisplay.setDirections(result);
    }
  });
}

// Initialize Firebase
var config = {
  apiKey: 'AIzaSyBZrlFM-UWvijdFWL6aBYWaARHvAbd8Yeo',
  authDomain: 'safewalk-4c340.firebaseapp.com',
  databaseURL: 'https://safewalk-4c340.firebaseio.com',
  storageBucket: 'safewalk-4c340.appspot.com',
  messagingSenderId: '680615541265'
}
firebase.initializeApp(config)

var modal = document.getElementById('addAlertModal')
var submit = document.getElementById('submitAlert')
var close = document.getElementsByClassName('close')[0]

// Closes modal when user clicks on close
close.onclick = function () {
  modal.style.display = 'none'
}
// Closes modal when user clicks elsewhere
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = 'none'
  }
}

submit.onclick = function () {
  var location = document.getElementById('locationText').value
  var comment = document.getElementById('commentText').value
  console.log(comment)
  addAlert(location, comment)
  document.getElementById('locationText').value = ''
  document.getElementById('commentText').value = ''
  modal.style.display = 'none'
}
var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
var labelIndex = 0

function addMarker (myLatLng, map, comment) { // myLatLng: {lat: 40.2501, lng: -111.649}
  console.log('Adding a marker: ')
  console.log(myLatLng, comment)
  var latLng = JSON.parse(myLatLng)
  console.log('Parsed! ', latLng)
  var marker = new google.maps.Marker({
    position: latLng,
    icon: 'exclamation.png',
    label: labels[labelIndex++ % labels.length],
    map: map
  })
  var commentText = comment || 'No Comment was given'; // Sets default text to the comment, or if no comment is passed in the empty string
  var contentString = '<div id="markerInfo">' +
    '<div id="siteNotice">' + '</div>' +
    '<h1 id="firstHeading" class="firstHeading">Alert</h1>' +
    '<div id="bodyContent">' +
    commentText +
    '</div></div>'
  var infowindow = new google.maps.InfoWindow({
    content: contentString,
    maxWidth: 200
  })
  marker.addListener('click', function () {
    infowindow.open(map, marker)
    setTimeout(function() {
      infowindow.close();
    }, 3000)
  })
  
}

var database = firebase.database()
var comments = database.ref('comments/')

function addAlert (Location, Comment) { // params given by modal
  comments.push({
    location: Location,
    comment: Comment
  })
}

function resetDB () { // if we ever want to reset data - maybe put a button in for this during testing?
  database.ref('comments/').set({ // replace whatever was there
    location: null,
    comment: null
  })
  console.log('DB IS RESET')
}

function deleteTweet (key) { // deleting comments - work on this later
  conole.log('delete')
// getelementbyid('key').delete(); --- or however we set that up in the html
// then delete out of database 
}

comments.on('child_added', function (data) { // when alert is added to DB
  var Alert = data.val()
  console.log('Child Added Messages: ')
  console.log(data.val().location) // checking that it saved to database correctly
  console.log(data.val().comment)

  // note: get the timestamp also

  if (map !== '') {
    addMarker(data.val().location, map, data.val().comment)
  }
  $('#thecomments').append('<p class = "comment"> User: ' + data.val().location + '<br></br>Comment: ' + data.val().comment + '<button class = "button" onclick="delete">X</button></p>')
// (postElement,data.key, data.val().text)}
})
