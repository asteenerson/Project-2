
// Bike Image
var BikeIcon = L.icon({
  iconUrl:'/images',
  iconSize:[35, 50] // size of the icon
});

//Traffic Image
var TrafficIcon = L.icon({
  iconUrl:'/images2',
  iconSize:[35, 35] // size of the icon
});

// Flask URL
var url = '/coords';

// Marker Layer
var clusterMarkers = new L.LayerGroup();

// Grab the data with d3
d3.json(url, function(response) {
  
  // Create a new marker cluster group
  var markers = L.markerClusterGroup();

  // Loop through data
  for (var i = 0; i < response.length; i++) {
  
    // Add a new marker to the cluster group and bind a pop-up
    markers.addLayer(L.marker([response[i][0], response[i][1]],{icon:BikeIcon})
        
      // Code for message popup
      .bindPopup(`<strong>Injury Type:</strong> ${response[i][2]}<br>
      <strong>Road Conditions: </strong>${response[i][3]}<br>
      <strong>Light Conditions: </strong>${response[i][4]}<br>
      <strong>Weather: </strong>${response[i][5]}<br>
      <strong>Day of Crash: </strong>${response[i][6]}<br>
      <strong>Hit and Run: </strong>${response[i][7]}<br>    
      `)).addTo(clusterMarkers);
  }
});

// Circle Layer
var circleMarkers = new L.LayerGroup();
// Increase size of cirlces on map
function markerSize(avglenmin) {
  if (avglenmin == 0) {
    return avglenmin = 25;
  }
  else {
    return avglenmin * 75;
  }
}

// Flask URL
var url2 = '/traffic';

// Perform a GET request to the query URL
d3.json(url2, function(response) { 

  var data = response.features

  // Loop through the data array
  for (var i = 0; i < data.length; i++) {          

    // Add circles to map based on lng and lat
    L.circle([data[i].geometry.coordinates[1], data[i].geometry.coordinates[0]], {

      // Conditionals for data points
      fillOpacity: 0.50,
      color: "null",
      fillColor: "red",
      weight: 1,
    
      // Adjust radius based on length of traffic signal
      radius: markerSize(data[i].properties.avglenmin)

      // Code for message popup
      }).bindPopup(`<strong> Signal Length (Min): </strong> ${data[i].properties.avglenmin}`).addTo(circleMarkers)
    }   
});


// Marker Layer
var trafficMarkers = new L.LayerGroup();

// Perform a GET request to the query URL
d3.json(url2, function(response) { 

  var data = response.features

   // Create a new marker cluster group
   var markers = L.markerClusterGroup();

  // Loop through the data array
  for (var i = 0; i < data.length; i++) {          

    // Add circles to map based on lng and lat
    markers.addLayer(L.marker([data[i].geometry.coordinates[1], data[i].geometry.coordinates[0]], 
      {icon:TrafficIcon}).addTo(trafficMarkers));
  }
});
 
// Add Map Layers
var streets = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
})

var dark = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
});

var hiking = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.run-bike-hike",
    accessToken: API_KEY
});



// Define basemaps
var baseMaps = {
  "Streets": streets,
  "Dark": dark,
  "Hiking": hiking
};
// Define map overlays
var overlayMaps = {
"Bike Crashes": clusterMarkers, 
"Traffic Circles": circleMarkers,
"Traffic Markers": trafficMarkers
};
// Creating map object
var myMap = L.map("map", {
  center: [35.91, -79.07],
  zoom:11,
  layers: [streets, clusterMarkers, circleMarkers]
});

// Add map layers
L.control.layers(baseMaps, overlayMaps, {collapsed: false}).addTo(myMap);