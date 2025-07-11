	**bold**For a detailed report on this project, please download and check the detailed report PDF file in the document.
This readme file explains some key code, although detailed comments are already included in the code. This document mainly explains the code for displaying some data and basic interactive functions on the map.
Some code explanations：
1. Here, a new Leaflet map object is created and bound to the element with the ID ‘map’ in the HTML page. The centre point of the map is set to [47.8095, 13.0550], the initial zoom level is set to 15, and the double-click zoom feature is disabled.
```js
var map = L.map('map', {
  center: [47.8095, 13.0550],
  zoom: 15
});
// cancel the double-click to zoom in
map.doubleClickZoom.disable();
```

2. Several different base maps provided by OpenStreetMap are used here, and a base map collection object is defined to facilitate the addition of layer switching controls to the map, allowing users to freely switch between different base maps.
```js
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
```

3. Here, a layer control button is defined to switch between different base maps, and the position of the button and the scale control are set.
```js
L.control.layers(baseMaps).addTo(map);
//
L.control.scale({ position: 'bottomright', imperial: false }).addTo(map);
```

4. The following series of code defines all the map icons that will be used, including the images, sizes, positions, etc. Here is a small selection; the rest are similar.
```js
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
```

5. The next part is to display the data that will be used on the map. Here, the style of the bus route is defined and displayed on the map, with a pop-up window and its contents bound to it. An event is defined to display a larger icon when the mouse hovers over it, and the icon is reset when the mouse is moved away.
```js
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
```

6.Defining bicycle routes
```js
var bikeway = L.geoJson(bikeway, {
  style:{
  color: '#8A2BE2',
  weight: 3,
  opacity: 0.85
}
});
```

7. Different line icons are used for city boundaries. Here, overlapping lines are used, and two line elements are combined into one to display symbols of different styles.
```js
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
```

8. Defining bicycle routes
```js
var footpath = L.geoJson(footpath,{
  style: {
  color: 'darkorange',
  weight: 3,
  opacity: 0.85
  }
});
```

9. This defines how bus stations features are displayed, showing each point feature as a predefined icon and binding a pop-up window to it. It also defines an event that highlights the icon when the mouse hovers over it.
```js
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
```

10. Define landmark elements and display them on the map using predefined icons. Bind a pop-up window to display content, and subsequently define other pop-up window content. Set labels to always display on the map. Also set mouse hover events.

```js
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
```

11. Defined a layers object to store all data layers, and defined another layer control button to switch data layers.
```js
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
```

12 (1). This section make some settings for custom layer control buttons. The purpose here is to first define a container, then define a toggle button, and finally define a display list. All of these use styles from CSS. Cancel the double-click zoom event in the container. Display each layer by name in the list.
```js
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
```

12 (2). Define a checkbox that can be used to show or hide data by selecting different data layers. Create a label element and add it to the list. Each row of labels contains a checkbox and the corresponding layer name. Finally, return the content to the container.
```js
      const label = L.DomUtil.create('label', '', list);
      label.appendChild(input);
      label.appendChild(document.createTextNode(' ' + name));
    }

    return container;
  },
});
```

12 (3). A factory function that returns a new control when L.control2() is called. Add the complete control to the map.
```js
L.control2 = function (options) {
  return new L.Control.Control2Layers(options);
};
// Adds the entirety of the control button to the map, which is used to display the data layers in the layers collection.
L.control2({
  overlays: layers
}).addTo(map);
```

13. Double-click to zoom in on the station closest to the click location.
```js
map.on('dblclick', function(e) {
  let nearest = null;
  let minDist = Infinity;
```

14. Iterate through all bus stop coordinates. When a click event is triggered, calculate the straight-line distance between the two points. Determine whether the currently calculated distance is less than the currently known minimum distance. If it is less, update the minimum distance and mark it as the nearest stop. Zoom in on that station and display the station pop-up window.
```js
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
```

15 (1). This section displays a pop-up window with a brief introduction when the user clicks on any landmark icon, and also showing the five stations closest to that landmark. The first step is to clear all lines on the map, but without clearing the polygons. This is equivalent to a reset function, because the nearest stations here need to be connected by lines.
```js
function clearLines() {
  map.eachLayer(function (layer) {
    if (layer instanceof L.Polyline && !(layer instanceof L.Polygon)) {
      map.removeLayer(layer);
    }
  });
}
```

15 (2). A reset function that resets all bus stop icons to the default station icons and rebinds the pop-up window content. Since the icon for the nearest station is highlighted, clicking on a new landmark resets the station icon to prevent multiple stations from being highlighted.
```js
function resetStationIcons() {
  station.eachLayer(function (layer) {
    const name = layer.feature?.properties?.name || 'Station';
    layer.setIcon(stationIcon);
    layer.bindPopup("Station Name: " + name); // Rebind after reset
  });
}
```

15 (3). Define a function to bind click events to each landmark and mark the current landmark as active. When clicked, obtain the landmark coordinates, calculate the distance, find the nearest station, and pop up a window with information. When a station that has already been marked as active is clicked again, clear all connections and highlights, close the pop-up window, and cancel the active status.
```js
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
```

15 (4).Preparation: First, deactivate all stations, clear all lines, reset the icons, and set a variable to store the distance.
```js
      // Deactivate all landmarks first
      landmarks.eachLayer(l => l.isActive = false);
      layer.isActive = true;

      // Clear lines and reset icons
      clearLines();
      resetStationIcons();

      // Find distances to all stations
      const distances = [];
```

15 (5). Iterate through all bus stops, obtain their coordinates and names, and calculate the distance between the clicked landmark and the bus stops. Add the stop information and distance to the array.
```js
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
```

15 (6).Sort by distance from smallest to largest and select the top five. Obtain landmark data attributes, name, description, image link, and detailed information link.
```js
      // Sort and pick nearest 5
      distances.sort((a, b) => a.distance - b.distance);
      const nearest = distances.slice(0, 5); // Get the 5 closest stations

      // Get landmark properties
      const props = layer.feature?.properties || {};
      const landmarkName = props.NAME || 'Selected Landmark';
      const introduction = props.brief_intr || 'No introduction available.';
      const imageURL = props.picture_UR || null;
      const linkURL = props.link || null;
```

15 (7). Bind a new pop-up window to store HTML content, use pop-up window styles in CSS, set titles, introductions, insert images, and links.
```js
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
```

15 (8). Display the five nearest stations in a pop-up window, with the display style set as follows. Highlight the icons and link them with lines to complete the pop-up window content. Finally, display the pop-up window on the map after a click event occurs.
```js
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
```

15 (9). Define the distance calculation function. Then call the click function.
```js
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

setupLandmarkClick();
```

16 (1). Add a search function, add a search button, a click event, and a search box for entering text. Check if the search box is empty and define a variable to mark whether the target is found.
```js
document.getElementById('searchButton').addEventListener('click', function() { // Add search functionality for stations and landmarks
  const query = document.getElementById('searchBox').value.trim().toLowerCase(); // Get search query and convert to lowercase

  if (!query) { // Check if search query is empty
    alert("Please enter a name.");
    return;
  }

  let found = false; // Flag to track if search result was found
```

16 (2). Search for stations and landmarks, as the search is based on the name entered. First, iterate through each station and store all station names in an array. Check if the entered name is in the array. If it is, zoom in on the target station and open a pop-up window, marking the search as true. If it is not found, repeat the above process for all landmarks. If there is still no matching name, display a alert indicating that there is no match.
```js
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
```

17 (1). Add my location function. Set up a button, define the button's position, title, style, and icon.
```js
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
```

17 (2). Disable map click events. When the user clicks on the My Location icon, locate and zoom in on the user's location. Add control buttons to the map.
```js
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
```

17 (3). When the user clicks the ‘My Location’ button, the map zooms in to the user's current location and displays a pop-up window showing the nearest station and landmarks to the user's location. After finding the user's location, first remove any existing icons and display the defined ‘My Location’ icon at the found location, and bind the pop-up window. If the user's location cannot be found, an alert will pop up.
```js
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
```

17 (4). Delete all previous markers and lines, and reset the array that stores the lines. Iterate through each station, obtain the station's coordinates and name, and calculate the distance between the station and the user's location. Store all of this attribute information in the corresponding array. Perform exactly the same work for landmark data.
```js
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
```

17 (5). Sort the distances from smallest to largest, select the top three stations and the top two landmarks. Rebuild the pop-up window to display the names and distances of the three closest stations and two closest landmarks.
```js
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
```

17 (6). Use lines to connect the user's location with landmarks and stations. Bind pop-up windows to my location icons.
```js
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
});
```

18. Add a button to return to the initial view of the map. Set the initial position and zoom level, set the buttons and styles. Set a single-click event to return the view to the initial position and add the buttons to the map.
```js
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
```

19. When the mouse is on a bus route, the symbol is replaced with a highlighted display (the activated element is moved to the top of the layer).
```js
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
```

20 (1). Create an information window to display relevant information. Similar to the layer control button created earlier, a scroll wheel function has been added here. The content of the information window is defined using HTML mode （For specific details, please refer to the full version of the code）.
```js
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
    list.innerHTML =
```

20 (2). Set up some events: click the button to expand the window, disable click events within the information window, click outside the window to collapse it, and prevent the window from closing accidentally. Display the control button and information window on the map.
```js
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
```
