For a detailed report on this project, please download and check the detailed report PDF file in the document.
This readme file explains some key code, although detailed comments are already included in the code. This document mainly explains the code for displaying some data and basic interactive functions on the map.
Some code explanations：
```var map = L.map('map', {
  center: [47.8095, 13.0550],
  zoom: 15
});
// cancel the double-click to zoom in
map.doubleClickZoom.disable();```
