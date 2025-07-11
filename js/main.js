// Using Leaflet for creating the map and adding controls for interacting with the map
//
//--- Part 1: adding base maps ---
var map = L.map('map', {
  center: [47.8095, 13.0550],
  zoom: 15
});
// cancel the double-click to zoom in
map.doubleClickZoom.disable();

// adding base maps

// add open street map as base layer
var osmap = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var imagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
  attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});

var opentopo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
  maxZoom: 17,
  attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});

// for using the two base maps in the layer control, I defined a baseMaps variable
var baseMaps = {
  "Open Street Map": osmap,
  "world imagery": imagery,
  "open topomap": opentopo
};

// add a layer control for basemap.
L.control.layers(baseMaps).addTo(map);
// // Add a scale bar to the map in the bottom right corner.
// The scale bar shows distances using only metric units (meters and kilometers),
// helping users estimate real-world distances on the map.
L.control.scale({ position: 'bottomright', imperial: false }).addTo(map);
//

// different icons （Use different icons for different features）
var stationIcon = L.icon({
  iconUrl: 'css/images/A1.png',
  iconSize: [15, 15],
  iconAnchor: [10, 5], // Bottom center of the icon
  popupAnchor: [0, -10] // determines where the popup will open relative to the icon’s anchor point.
});

var highlightIcon = L.icon({
  iconUrl: 'css/images/A1.png',
  iconSize: [30, 30],
  iconAnchor: [10, 10],
  popupAnchor: [0, -50]
});

var hangoverIcon = L.icon({
  iconUrl: 'css/images/A1.png',
  iconSize: [20, 20],
  iconAnchor: [15, 15] // Centered (15 / 2)
});

var landmarksIcon = L.icon({
  iconUrl: 'css/images/landmarks.png',
  iconSize: [30, 30],
  iconAnchor: [15, 30]
});

var Biglandmarks = L.icon({
  iconUrl: 'css/images/landmarks.png',
  iconSize: [50, 50],
  iconAnchor: [25, 50]
});

const myLocationIcon = L.icon({
  iconUrl: 'css/images/location.png', // make sure this path is correct
  iconSize: [30, 30],
  iconAnchor: [15, 15],
  popupAnchor: [0, -15]
});

// Defining Data Layers
// busline features
var busline = L.geoJson(busline, {
  style: {
    color: '#2196F3',
    weight: 3,
    opacity: 0.85
  },
    onEachFeature: function (feature, layer) {
    if (feature.properties && feature.properties.name) {
      layer.bindPopup("Line Name: " + feature.properties.name);
    }
// Add an event that highlights the target when the mouse hovers over it.
// Note that the highlingtfeature and resetHighlight functions are defined at the very bottom (in Part 4: adding some events to the map).
    layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight
    });
  }
});
// bikeway features
var bikeway = L.geoJson(bikeway, {
  style:{
  color: '#8A2BE2',
  weight: 3,
  opacity: 0.85
}
});

//For boundary use some different (Combined lines).
var boundaryOuter = L.geoJson(SBGboundary, {
  style: {
    color: 'black',
    weight: 8,
    opacity: 0.5
  }
});

var boundaryInner = L.geoJson(SBGboundary, {
  style: {
    color: '#DC143C',
    weight: 4,
    dashArray: '8, 8',
    opacity: 0.85
  }
});
// group boundary.
var boundary = L.layerGroup([boundaryOuter, boundaryInner]);
// footpath features
var footpath = L.geoJson(footpath,{
  style: {
  color: 'darkorange',
  weight: 3,
  opacity: 0.85
  }
});
// bus station features
var station = L.geoJson(busstation, {
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, { icon: stationIcon });
  },
  onEachFeature: function (feature, layer) {
    if (feature.properties && feature.properties.name) {
      layer.bindPopup("Station Name: " + feature.properties.name);
    }
    // Highlight on hover
    layer.on({
      mouseover: function () {
        layer.setIcon(hangoverIcon); // change icon on hover
      },
      mouseout: function () {
        layer.setIcon(stationIcon); // revert on mouse out
      }
    });
  }
});
// landmark features
var landmarks = L.geoJson(landmarks, {
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, { icon: landmarksIcon });
  },
  onEachFeature: function (feature, layer) {
    if (feature.properties && feature.properties.NAME) {
      // Popup on click
      layer.bindPopup("Landmark: " + feature.properties.NAME);
      // Tooltip label (always visible above the marker)
      layer.bindTooltip(feature.properties.NAME, {
        permanent: true,
        direction: 'top',
        offset: [0, -25],
        className: 'landmark-label' // optional custom style
      });
    }
    // Hover effect for icon
    layer.on({
      mouseover: function () {
        layer.setIcon(Biglandmarks);
      },
      mouseout: function () {
        layer.setIcon(landmarksIcon);
      }
    });
  }
});

// Define the data layer and place the layer under the layer control button
var layers = {
    "Bus line": busline,
    "Bikeway": bikeway,
    "Salzbure boundary": boundary,
    "Stations": station,
    "Footpath": footpath,
    "Landmarks": landmarks
}

//Creat another layer control for datalayers
L.Control.Control2Layers = L.Control.extend({
  options: {
    position: 'bottomright',
    overlays: {}
  },

  onAdd: function (map) {
    //Create a container, using the styles in css
    const container = L.DomUtil.create('div', 'leaflet-control2-layers'); // No "collapsed" or "expanded"
    // Create the toggle button
    const toggle = L.DomUtil.create('div', 'leaflet-control2-layers-toggle', container);
    // Create the list container
    const list = L.DomUtil.create('div', 'leaflet-control2-layers-list', container);
    // Clicking or double-clicking inside a container will have no effect on the map (disable click events inside the container.)
    L.DomEvent.disableClickPropagation(container);
    // Toggle icon click shows/hides the list
    L.DomEvent.on(toggle, 'click', function () {
    });
    // Displays the name of each feature layer in a list.
    const overlays = this.options.overlays;
    for (let name in overlays) {
      const layer = overlays[name];

      // Checkbox
      const input = L.DomUtil.create('input', 'leaflet-control2-layers-selector');
      input.type = 'checkbox';
      // Select the layer to display it in the map.
      input.onchange = function () {
        if (this.checked) {
          map.addLayer(layer);
        } else {
          map.removeLayer(layer);
        }
      };
      // Label (Add the name of each layer after the selection box.)
      const label = L.DomUtil.create('label', '', list);
      label.appendChild(input);
      label.appendChild(document.createTextNode(' ' + name));
    }

    return container;
  },
});

// Factory function for creating a new instance of the custom control.
L.control2 = function (options) {
  return new L.Control.Control2Layers(options);
};
// Adds the entirety of the control button to the map, which is used to display the data layers in the layers collection.
L.control2({
  overlays: layers
}).addTo(map);


//
//Adding some events to the map
//
//Event 1: dbClick to zoom to feature
map.on('dblclick', function(e) {
  let nearest = null;
  let minDist = Infinity;

// Find the nearest station to the clicked location and calculate the straight-line distance of the station from the clicked location.
station.eachLayer(function(layer) {
    const latlng = layer.getLatLng();
    const dist = e.latlng.distanceTo(latlng); // in meters
    if (dist < minDist) {
      minDist = dist;
      nearest = layer;
    }
  });
// Zoom to the nearest station and display a pop-up window.
  if (nearest) {
    map.setView(nearest.getLatLng(), 18); // zoom to the feature
    nearest.openPopup(); // optional: show popup
  }
})

//Event 2: Click on the landmarks to display the nearest station （Show straight line distance）.
// removes all polylines from the Leaflet map, but leaves polygons untouched.
function clearLines() {
  map.eachLayer(function (layer) {
    if (layer instanceof L.Polyline && !(layer instanceof L.Polygon)) {
      map.removeLayer(layer);
    }
  });
}
// Reset function that resets the station's icon and rebinds the popup.
function resetStationIcons() {
  station.eachLayer(function (layer) {
    const name = layer.feature?.properties?.name || 'Station';
    layer.setIcon(stationIcon);
    layer.bindPopup("Station Name: " + name); // Rebind after reset
  });
}
//
// Click on landmarks to show nearest stations and display popup with landmark info
function setupLandmarkClick() {
  landmarks.eachLayer(function (layer) {
    layer.isActive = false; // Flag to track active state
    //Add a click command，click for latitude and longitude.
    layer.on('click', function (e) {
      const clickedLatLng = e.latlng;

      // Toggle off if already active
      if (layer.isActive) {
        clearLines();
        resetStationIcons();
        map.closePopup();
        layer.isActive = false;
        return;
      }

      // Deactivate all landmarks first
      landmarks.eachLayer(l => l.isActive = false);
      layer.isActive = true;

      // Clear lines and reset icons
      clearLines();
      resetStationIcons();

      // Find distances to all stations
      const distances = [];

      station.eachLayer(function (stationLayer) {
        const stopLatLng = stationLayer.getLatLng(); // Get coordinates of current bus station
        // getDistance() is a function using the Haversine formula (in km) (This function is defined later).
        const distance = getDistance(
          clickedLatLng.lat,
          clickedLatLng.lng,
          stopLatLng.lat,
          stopLatLng.lng
        );
        // Add this object to the distances array:
        distances.push({
          layer: stationLayer,
          name: stationLayer.feature?.properties?.name || 'Station', // Get station name with fallback to 'Station'
          latlng: stopLatLng,
          distance: distance
        });
      });

      // Sort and pick nearest 5
      distances.sort((a, b) => a.distance - b.distance);
      const nearest = distances.slice(0, 5); // Get the 5 closest stations

      // Get landmark properties
      const props = layer.feature?.properties || {};
      const landmarkName = props.NAME || 'Selected Landmark';
      const introduction = props.brief_intr || 'No introduction available.';
      const imageURL = props.picture_UR || null;
      const linkURL = props.link || null;

// Start building popup content with landmark name and description
let popupContent = `
    <div class="landmark-popup-content">
    <h4>${landmarkName}</h4>
    <p>${introduction}</p>
`;

// Add image if present
if (imageURL) {
  popupContent += `<img src="${imageURL}" alt="${landmarkName}" style="width:100%;height:auto;border-radius:4px;margin-bottom:8px;">`; // Add landmark image with responsive styling and rounded corners
}

// Add link if present
if (linkURL) {
  popupContent += `<p><a href="${linkURL}" target="_blank">More Info</a></p>`;
}

// Nearest stations list (Display the five most recent stations in the pop-up window.)
popupContent += `<strong>Nearest Stations:</strong><ul>`;

      nearest.forEach(stop => {
        popupContent += `<li>${stop.name}: ${stop.distance.toFixed(2)} km</li>`; // Display the station name and distance to the landmark.

        // Highlight the station
        stop.layer.setIcon(highlightIcon);

        // Rebind popup
        stop.layer.bindPopup("Station Name: " + stop.name);

        // Draw connection line
        L.polyline([clickedLatLng, stop.latlng], {
          color: 'blue',
          weight: 2,
          dashArray: '4,6'
        }).addTo(map);
      });
      popupContent += `</ul>`; // Close the stations list

      // Show landmark popup
  className: 'landmark-popup',
      L.popup({ className: 'landmark-popup', offset: [0, -20] })  //  custom class for CSS
      .setLatLng(clickedLatLng)
      .setContent(popupContent)
      .openOn(map);
    });
  });
}

// Function to calculate distance between two points using Haversine formula.
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of Earth in km
  // Converts degrees to radians.
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  // Part (a) of the formula.
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
    // Part (c) of the formula
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  // Return distance
  return R * c;
}
// Correct place to call it (): Execute the setupLandmarkClick() function.
setupLandmarkClick();


// Add a Find function
document.getElementById('searchButton').addEventListener('click', function() { // Add search functionality for stations and landmarks
  const query = document.getElementById('searchBox').value.trim().toLowerCase(); // Get search query and convert to lowercase

  if (!query) { // Check if search query is empty
    alert("Please enter a name.");
    return;
  }

  let found = false; // Flag to track if search result was found

  // Search stations
  station.eachLayer(layer => {
    const name = layer.feature?.properties?.name?.toLowerCase();
    if (name && name === query) { // Check if station name matches search query exactly
      map.setView(layer.getLatLng(), 17); // Zoom to the station
      layer.openPopup();// open popup window
      found = true; // set found to true.
    }
  });

  // If not found, search landmarks
  if (!found) { // if not found, search landmarks
    landmarks.eachLayer(layer => {
      const name = layer.feature?.properties?.NAME?.toLowerCase(); // Get landmark name and convert to lowercase
      if (name && name === query) { // check if landmark name matches search query exactly
        map.setView(layer.getLatLng(), 17); //zoom to the landmark
        layer.openPopup();
        found = true;
      }
    });
  }

  if (!found) { // if not found, show alert
    alert("No matching station or landmark found.");
  }
});


// Add a My Location feature
const locateControl = L.control({ position: 'topleft' }); // creat a control button for my location

locateControl.onAdd = function(map) { // Define the control button creation function 
  const btn = L.DomUtil.create('button', 'leaflet-bar leaflet-control leaflet-control-custom'); // Create the location button element 
  btn.title = 'Show my location'; // set the title of the button

  // Style the button
  btn.style.width = '34px';
  btn.style.height = '34px';
  btn.style.backgroundColor = 'white';
  btn.style.border = 'none';
  btn.style.cursor = 'pointer';
  btn.style.padding = '0';

  // Add your location icon
  const img = document.createElement('img'); // Create image element for location icon 
  img.src = 'css/images/location.png'; // path to your icon
  img.style.width = '100%';
  img.style.height = '100%';
  img.style.objectFit = 'cover'; // ensure the image cover the button area
  img.alt = 'My Location'; // set the alt text for the image.

  btn.appendChild(img); // Add the image element as a child of the button to display the location icon 

  // Prevent map clicks from triggering
  L.DomEvent.disableClickPropagation(btn);

      // When clicked, locate the user
    btn.onclick = function() {
      // Locate the user's location and zoom to the location
      // Uses HTML5 Geolocation API, requires user permission, accuracy varies by device (GPS/WiFi/cell towers)
      map.locate({ setView: true, maxZoom: 17 }); 
    };

  return btn; // return the button element to be added to the map
};

locateControl.addTo(map); // add the control button to the map.

// event: show the nearest stations and landmarks to the user's location popup window
map.on('locationfound', function(e) { // when the user's location is found.
  if (map.myLocationMarker) { // remove any existing location marker if needed.
    map.removeLayer(map.myLocationMarker); // remove the existing marker.
  }

  // Add the marker at the user's location
  map.myLocationMarker = L.marker(e.latlng, { icon: myLocationIcon })
    .addTo(map)
    .bindPopup("You are here.")
    .openPopup();
});

// handle errors
map.on('locationerror', function(e) {
  alert("Could not get your location: " + e.message); // show an alert if the user's location is not found.
});


map.on('locationfound', function(e) { // when the user's location is found.
  const userLatLng = e.latlng;

  // Remove any previous marker if needed
  if (map.myLocationMarker) {
    map.removeLayer(map.myLocationMarker);
  }

  // Remove previous lines if needed (so they don't pile up)
  if (map.myLocationLines) {
    map.myLocationLines.forEach(line => map.removeLayer(line)); //remove the previous lines.
  }
  map.myLocationLines = []; //reset the line array.

  // Create marker
  map.myLocationMarker = L.marker(userLatLng, { icon: myLocationIcon }).addTo(map);

  // Collect stations
  const stationFeatures = []; // create an array to store the station features.
  station.eachLayer(layer => { // iterate through each station layer.
    const latlng = layer.getLatLng(); // get the coordinates of the stations.
    const name = layer.feature?.properties?.name || "Station"; // get the name of the station.
    // calculate the distance between the user's location and the station.
    const distance = getDistance(userLatLng.lat, userLatLng.lng, latlng.lat, latlng.lng); 

    stationFeatures.push({ // add the station features to the array.
      type: "Station",
      layer: layer,
      name: name,
      latlng: latlng,
      distance: distance
    });
  });

  // Collect landmarks
  const landmarkFeatures = []; // create an array to store the landmarks features.
  landmarks.eachLayer(layer => { // iterate through each landmark layer.
    const latlng = layer.getLatLng(); // get the coordinates of the landmarks.
    const name = layer.feature?.properties?.NAME || "Landmark"; // get the name of the landmark.
    // calculate the distance between the user's location and the landmark.
    const distance = getDistance(userLatLng.lat, userLatLng.lng, latlng.lat, latlng.lng);

    landmarkFeatures.push({ // add the landmark features to the array.
      type: "Landmark",
      layer: layer,
      name: name,
      latlng: latlng,
      distance: distance
    });
  });

  // Sort and select top 3 stations
  stationFeatures.sort((a, b) => a.distance - b.distance); // sort the stations by distance.
  const nearestStations = stationFeatures.slice(0, 3); // select the top 3 stations.

  // Sort and select top 2 landmarks
  landmarkFeatures.sort((a, b) => a.distance - b.distance); // sort the landmarks by distance.
  const nearestLandmarks = landmarkFeatures.slice(0, 2); // select the top 2 landmarks.

  // Build popup content
let popupContent = "<strong>Nearest Stations:</strong><ul>"; // create a popup content string.
nearestStations.forEach(f => { // iterate through each station.
  popupContent += `<li>${f.name} (${f.distance.toFixed(2)} km)</li>`; // add the station name and distance to the popup content.
  f.layer.setIcon(highlightIcon);  // set the icon of the station.
});
popupContent += "</ul>"; // close the stations list.


  popupContent += "<strong>Nearest Landmarks:</strong><ul>"; // create a popup content string.
  nearestLandmarks.forEach(f => { // iterate through each landmark.
    popupContent += `<li>${f.name} (${f.distance.toFixed(2)} km)</li>`; // add the landmark name and distance to the popup content.
  });
  popupContent += "</ul>"; // close the landmarks list.

  // Draw lines to nearest stations
  nearestStations.forEach(f => { // iterate through each station.
    const line = L.polyline([userLatLng, f.latlng], { // draw a line to the station.
      color: 'blue',
      weight: 2,
      dashArray: '4,6'
    }).addTo(map);
    map.myLocationLines.push(line); // add the line to the array.
  });

  // Draw lines to nearest landmarks
  nearestLandmarks.forEach(f => { // iterate through each landmark.
    const line = L.polyline([userLatLng, f.latlng], { // draw a line to the landmark.
      color: 'green',
      weight: 2,
      dashArray: '4,6'
    }).addTo(map);
    map.myLocationLines.push(line); // add the line to the array.
  });

  // Bind popup to location marker
  map.myLocationMarker.bindPopup(popupContent).openPopup(); // bind the popup content to the location marker.
});
map.on("click", function() { // when the user clicks on the map.
  // Remove the location marker if it exists
  if (map.myLocationMarker) { // if the location marker exists.
    map.removeLayer(map.myLocationMarker); // remove the location marker.
    map.myLocationMarker = null; // reset the location marker.
  }

  // Remove the lines if they exist
  // if (map.myLocationLines) {
  //   map.myLocationLines.forEach(line => map.removeLayer(line)); // remove the lines.
  //   map.myLocationLines = []; // reset the line array.
  // }
});

// Event: add a home function
const defaultCenter = [47.8095, 13.0550]; // set the default center of the map.
const defaultZoom = 15; // set the default zoom of the map.

const homeControl = L.control({ position: 'topleft' }); // create a control button for home.

homeControl.onAdd = function(map) { // define the control button creation function.
  const btn = L.DomUtil.create('button', 'leaflet-bar leaflet-control leaflet-control-custom'); // create the home button element.
  btn.title = 'Go to Home'; // set the title of the button.

  // Style it like a Leaflet button
  btn.style.width = '34px';
  btn.style.height = '34px';
  btn.style.backgroundColor = 'white';
  btn.style.border = 'none'; // set the border of the button
  btn.style.cursor = 'pointer'; // set the cursor of the button.
  btn.style.padding = '0'; // set the padding of the button.

  // Add the icon.
  const img = document.createElement('img');
  img.src = 'css/images/house.png'; 
  img.style.width = '100%';
  img.style.height = '100%';
  img.style.objectFit = 'cover'; // ensure the image cover the button area.
  img.alt = 'Home'; // set the alt text for the image.

  btn.appendChild(img); // add the image element as a child of the button to display the home icon.

  // Prevent clicks from affecting map
  L.DomEvent.disableClickPropagation(btn);

  // Click action: go back to center
  btn.onclick = function() {
    map.setView(defaultCenter, defaultZoom); // set the view to the default center and zoom.
  };

  return btn; // return the button element to be added to the map. 
};

homeControl.addTo(map); // add the control button to the map.
//

// Event: highlight the feature
function highlightFeature(e) {
  var activefeature = e.target; // get the active feature.

  activefeature.setStyle({ // set the style of the active feature.
    weight: 7,              
    color: '#9C27B0',       
    dashArray: '',          
    opacity: 0.8              
  });

  if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) { // if the browser is not ie, opera or edge
    activefeature.bringToFront(); // bring the active feature to the front.
  }
}

function resetHighlight(e) {
  busline.resetStyle(e.target);  // Make sure 'busline' matches the layer name
}

// Create a window that can display information.
L.Control.Info3 = L.Control.extend({ // extend the control class to create a new control.
  options: {
    position: 'topleft'  
  },

  // This function is called by Leaflet when the control is added to the map
  // It creates and returns the HTML elements that make up the custom control
  // The 'map' parameter is the Leaflet map instance that the control will be attached to
  onAdd: function (map) { // define the control button creation function.
    // Create the main container div for the information control
    // This will hold both the toggle button and the information panel
    const container = L.DomUtil.create('div', 'leaflet-control3-info leaflet-control');

    // Create the toggle button that users click to show/hide the information panel
    // This button will be visible on the map and act as the trigger for the info panel
    const toggle = L.DomUtil.create('div', 'leaflet-control3-info-toggle', container);

    // Create the information panel that contains all the Salzburg information
    // This panel will be hidden by default and shown when the toggle is clicked
    const list = L.DomUtil.create('div', 'leaflet-control3-info-list', container);
    list.style.display = 'none'; // hidden initially - the panel starts hidden
    L.DomEvent.disableScrollPropagation(list); // Prevent scrolling inside the panel from affecting the map


    // Set the HTML content for the information panel
    // This contains all the Salzburg tourist information, images, and links
    // The content includes welcome message, landmark descriptions, and external links
    list.innerHTML = `
<div style="font-family: Arial, sans-serif; font-size: 14px; line-height: 1.6;">
  <h2>🌟 Welcome to Salzburg!</h2>
  <p>
    Discover the most beautiful landmarks of this historic city. Use the map below to explore, click icons for details, and learn more from the links provided.
  </p>

  <p>
    <img style="border-radius:8px; margin-bottom:12px; max-width:100%;"
         src="https://www.hotelstein.at/content/uploads/blick-auf-festung-salzburg.jpg"
         alt="View of Salzburg Fortress">
    <img style="border-radius:8px; margin-bottom:12px; max-width:100%;"
         src="https://img3.oastatic.com/img2/82781519/2500x950r/variant.jpg"
         alt="Salzburg City">
  </p>

  <hr>
  <h2 style="margin-top:0;">🏰 Top 10 Landmarks in Salzburg</h2>
  <p>
    Explore Salzburg's most iconic sites! Click an attraction icon on the map to see more details in the pop-up window, or browse the links below for additional information.
  </p>
  <hr>

  <h3>🔗 Links to data sources</h3>
  <ul>
    <li>Landmark details: 🎒
      <a href="https://www.salzburg.info/en" target="_blank" rel="noopener noreferrer">
        Salzburg Tourist Information
      </a>
    </li>
    <li>Data sources: 🗺️
      <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">
        OpenStreetMap
      </a>
    </li>
    <li>More city transport information: 🚌
      <a href="https://salzburg-verkehr.at/" target="_blank" rel="noopener noreferrer">
        Salzburg Transport
      </a> and 🚆
      <a href="https://www.oebb.at/en/" target="_blank" rel="noopener noreferrer">
        Austrian Railways
      </a>
    </li>
    <li>Image source: 📷
      <a href="https://www.salzburg.info/en" target="_blank" rel="noopener noreferrer">
        Picture Sources
      </a>
    </li>
    <li>Image source in description: 🖼️
      <a href="https://www.hotelstein.at/de/sehenswertes/salzburgs-innenstadt-sights-tipps/" target="_blank" rel="noopener noreferrer">
        Hotel Stein Salzburg Sights
      </a>,
      <a href="https://www.outdooractive.com/de/stadtrundgaenge/salzburg-stadt/stadtrundgaenge-in-salzburg-stadt/10229787/" target="_blank" rel="noopener noreferrer">
        Outdooractive Salzburg Walks
      </a>
    </li>
  </ul>

  <hr>
  <p>✨ <strong>Map Authors:</strong> Yuao Mei</p>
</div>
`;

    // Add click event listener to the toggle button
    // When clicked, it shows or hides the information panel
    // Uses stopPropagation to prevent the map from receiving the click event
    toggle.addEventListener('click', function (e) {
      e.stopPropagation(); // Prevent map click closure - stops the click from affecting the map
      list.style.display = (list.style.display === 'block') ? 'none' : 'block'; // Toggle panel visibility
    });

    // Add global click listener to close the panel when clicking outside of it
    // This provides a better user experience by allowing users to close the panel by clicking elsewhere
    document.addEventListener('click', () => {
      list.style.display = 'none'; // Hide the panel when clicking outside
    });

    // Prevent the control container from closing when clicked
    // This ensures the panel stays open when users interact with the control itself
    container.addEventListener('click', function (e) {
      e.stopPropagation(); // Don't close when clicking the control itself
    });

    // Prevent map interactions when clicking on the control
    // This ensures the control doesn't interfere with map functionality
    L.DomEvent.disableClickPropagation(container);
    return container; // Return the container so Leaflet can add it to the map
  }
});

// Factory function to create instances of the Info3 control
// This follows Leaflet's convention for creating custom controls
// It allows users to create the control with optional parameters
L.control.info3 = function (opts) {
  return new L.Control.Info3(opts); // Create and return a new instance of the custom control
};

// Create an instance of the Info3 control and add it to the map
// This makes the information panel visible on the map interface
L.control.info3().addTo(map);