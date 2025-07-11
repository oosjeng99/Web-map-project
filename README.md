For a detailed report on this project, please download and check the detailed report PDF file in the document.
This readme file explains some key code, although detailed comments are already included in the code. This document mainly explains the code for displaying some data and basic interactive functions on the map.
Some code explanations：
1. Here, a new Leaflet map object is created and bound to the element with the ID ‘map’ in the HTML page. The centre point of the map is set to [47.8095, 13.0550], the initial zoom level is set to 15, and the double-click zoom feature is disabled.
```var map = L.map('map', {
  center: [47.8095, 13.0550],
  zoom: 15
});
// cancel the double-click to zoom in
map.doubleClickZoom.disable();
```

2. Several different base maps provided by OpenStreetMap are used here, and a base map collection object is defined to facilitate the addition of layer switching controls to the map, allowing users to freely switch between different base maps.
```
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
```L.control.layers(baseMaps).addTo(map);
//
L.control.scale({ position: 'bottomright', imperial: false }).addTo(map);
```

4. The following series of code defines all the map icons that will be used, including the images, sizes, positions, etc. Here is a small selection; the rest are similar.
```
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

5. 
