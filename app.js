
var drectionsDisplay;
var directionsService;
var map = '';
var polylines = [];
var routeMarkers = [] 
function initMap() {
  directionsDisplay = new google.maps.DirectionsRenderer();
  directionsService = new google.maps.DirectionsService();
// Create a map object and specify the DOM element for display.
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 40.2501, lng: -111.649},
    //    scrollwheel: false,
    zoom: 14,
    mapTypeControl: true,
    mapTypeControlOptions: {
        style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
        position: google.maps.ControlPosition.LEFT_BOTTOM
    }
  })

  directionsDisplay.setMap(map);

  var origin_input = document.getElementById('originbox');
  var destination_input = document.getElementById('destinationbox');

  // map.controls[google.maps.ControlPosition.TOP_CENTER].push(origin_input);
  // map.controls[google.maps.ControlPosition.TOP_CENTER].push(destination_input);
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(mapControls);

  // adding autocomplete to the starting point and destination boxes
  var origin_autocomplete = new google.maps.places.Autocomplete(origin_input);
  origin_autocomplete.bindTo('bounds', map);
  var destination_autocomplete = new google.maps.places.Autocomplete(destination_input);
  destination_autocomplete.bindTo('bounds', map);

  function expandViewportToFitPlace(map, place) {
    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
    } 
    else {
      map.setCenter(place.geometry.location);
      map.setZoom(15);
    }
  }

  origin_autocomplete.addListener('place_changed', function() {
    var place = origin_autocomplete.getPlace();
      if (!place.geometry) {
        window.alert("Autocomplete's returned place contains no geometry");
        return;
      }
      expandViewportToFitPlace(map, place);

      // If the place has a geometry, store its place ID and route if we have
      // the other place ID
      origin_place_id = place.place_id;
      calcRoute();
  });

  destination_autocomplete.addListener('place_changed', function() {
    var place = destination_autocomplete.getPlace();
    if (!place.geometry) {
      window.alert("Autocomplete's returned place contains no geometry");
      return;
    }
    expandViewportToFitPlace(map, place);

    // If the place has a geometry, store its place ID and route if we have
    // the other place ID
    destination_place_id = place.place_id;
    calcRoute();
  });

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

  google.maps.Polyline.prototype.getBounds = function(startBounds) {
    if(startBounds) {
      var bounds = startBounds;
    }
    else {
      var bounds = new google.maps.LatLngBounds();
    }

    this.getPath().forEach(function(item, index) {
      bounds.extend(new google.maps.LatLng(item.lat(), item.lng()));
    });
    return bounds;
  };
}

function calcRoute() {
  var start = $("#originbox").val();
  var end = $("#destinationbox").val();

  if(start != '' && end != '') {
    for(mark in routeMarkers) {
      routeMarkers[mark].setMap(null);
    }
    routeMarkers = [];
    var request = {
      origin: start,
      destination: end,
      travelMode: 'WALKING',
      provideRouteAlternatives: true
    };
    directionsService.route(request, function(result, status) {
      // clear polylines
      for(var j in  polylines ) {
        polylines[j].setMap(null);
      }
      polylines = [];
      if (status == 'OK') {
        for(var i in  result.routes ) {
          var bounds = new google.maps.LatLngBounds();
          // draw the lines in reverse orde, so the first one is on top (z-index)
          for(var i=result.routes.length - 1; i>=0; i-- ) {
          // let's make the first suggestion highlighted;
            if(i==0) {
              var color = '#0088ff';
	    }
            else {
              var color = '#999999';
            }
            var line = drawPolyline(result.routes[i].overview_path, color);
            polylines.push(line);
            bounds = line.getBounds(bounds);
            google.maps.event.addListener(line, 'click', function() {
              // detect which route was clicked on
              var index = polylines.indexOf(this);
              highlightRoute(index);
            });
          }
          map.fitBounds(bounds);
	}
  var originMarker = new google.maps.Marker({ 
    position: result.routes[0].legs[0].start_location,
    map: map,
    label: "A",
    title: "Origin"
  })
  routeMarkers.push(originMarker);
  var destinationMarker = new google.maps.Marker({
    position: result.routes[0].legs[0].end_location,
    map: map,
    label: "B",
    color: "Green",
    title: "Origin"
  })
  routeMarkers.push(destinationMarker);
  
      }
    });
  }
}

function highlightRoute(index) {
  for(var j in  polylines ) {
    if(j==index) {
      var color = '#0088ff';
    }
    else {
      var color = '#999999';
    }
    polylines[j].setOptions({strokeColor: color});
  }
}

function drawPolyline(path, color) {
  var line = new google.maps.Polyline({
    path: path,
    strokeColor: color,
    strokeOpacity: 0.4,
    strokeWeight: 6
  });
  line.setMap(map);
  return line;
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

var markers = [];
var labelIndex = 0

function addMarker (myLatLng, map, comment, labelText) { // myLatLng: {lat: 40.2501, lng: -111.649}
  console.log('Adding a marker: ')
  console.log(myLatLng, comment)
  var latLng = JSON.parse(myLatLng)
  console.log('Parsed! ', latLng)
  // var marker = new google.maps.Marker({
  //   position: latLng,
  //   icon: 'alert.png',
  //   label: labelText,
  //   labelOrigin: new google.maps.Point(10, -10),
  //   map: map
  // })
  var marker = new google.maps.Marker({
    position: latLng,
    icon: {url: 'alert.png', labelOrigin: new google.maps.Point(10, 10)},
    label: {text: labelText, color: 'white', fontWeight: '400'},
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
  markers.push(marker);
  return marker; 
}

var database = firebase.database()
var alerts = database.ref('alerts/')

function addAlert (Location, Alerts) { // params given by modal
  alerts.push({
    location: Location,
    alertText: Alerts
  })
}

function resetDB () { // if we ever want to reset data - maybe put a button in for this during testing?
  database.ref('alerts/').set({ // replace whatever was there
    location: null,
    alertText: null
  })
  console.log('DB IS RESET')
}

function deleteAlert (key, markerLabel) { // deleting comments - work on this later
  document.getElementById(key).remove();// --- or however we set that up in the html
  alerts.child(key).remove();

  var theMarker = {}; //Find marker in array using label to determine match
  theMarker.visible=false;
  theMarker.clickable=false;
}

alerts.on('child_added', function (data) { // when alert is added to DB
  var Alert = data.val()
  console.log('Child Added Messages: ')
  console.log(data.val().location) // checking that it saved to database correctly
  console.log(data.val().alertText)

  // note: get the timestamp also
  var labelText;
  var theMarker 
  if (map !== '') {
    labelText = "" + labelIndex++;
    theMarker = addMarker(data.val().location, map, data.val().alertText,labelText);
    console.log(theMarker);
  }

  $('#thecomments').append('<p class = "alerts" id =\"'+ data.key +
    '\" >'+labelText+ ". " + data.val().alertText +
    '  <button class="button btn btn-danger" onclick="deleteAlert(\''+data.key+
    '\',\'' + theMarker.label + '\')">X</button></p>')
// (postElement,data.key, data.val().text)}
//' Location: ' + data.val().location + -- for when we put in geolocation- if we ever get to that
});
