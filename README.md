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

2. 
