
function initMap() {
// Create a map object and specify the DOM element for display.
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 40.2501, lng: -111.649},
//    scrollwheel: false,
    zoom: 14
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
