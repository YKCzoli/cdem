'use strict';
var flyToZoom = {
  "Northwest Territories": 4,
  "Nunavut": 4,
  "New Brunswick": 6,
  "Nova Scotia": 6,
  "Prince Edward Island": 8
};

// OGLC = open-government-licence-canada
var attribution_OGLC = '<a href="http://open.canada.ca/en/open-government-licence-canada">Open Government Licence - Canada</a>';
var attribution_NE = '<a href="http://www.naturalearthdata.com/">Made with Natural Earth</a>';

function onEachFeature(feature, layer) {
  var mirror = 'http://ftp.geogratis.gc.ca/pub/nrcan_rncan/elevation/geobase_cded_dnec/';
  var data_dir = '50k_dem/';
  var img_dir = 'images_50k/';
  var name = feature.properties.NUMFEUILLE;

  var dir = name.slice(0, 3);
  var file = mirror + data_dir + dir + '/' + name.toLowerCase() + '.zip';
  var quicklook = mirror + img_dir + 'dnec_' + name.toLowerCase() + '.jpg';

  var html = '<div id="pop">' +
    '    You clicked tile <strong>' + name + '</strong>!<br>' +
    '    <img id="quicklook" src="' + quicklook + '" class="img-thumbnail" width="200" height="200">' +
    '    <div>' +
    '         <a id="tip_button" class="btn btn-small btn-success tip_button" href="' + file + '" target="_blank">Download DNEC Tile</a><br>' +
    '    </div>' +
    '</div>';
  var popup = L.popup({
      maxWidth: 512,
      maxHeight: 512
    })
    .setContent(html);
  layer.bindPopup(popup);
}

function onEachProvTerr(feature, layer) {
  layer.on('click', function() {
    map.flyTo(layer.getBounds().getCenter(), (flyToZoom[feature.properties.name] || 5));
  });
}

var bounds = L.latLngBounds([39, -142], [84, -52]);

var map = L.map('map', {
  center: [70.451180, -135.081963],
  zoom: 2,
  minZoom: 3,
  maxZoom: 12
});

map.spin(true);

var cardtodb_url = 'http://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png';
var attribution_carto = '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>';
var CartoDB_DarkMatterNoLabels = L.tileLayer(cardtodb_url, {
  attribution: attribution_carto
}).addTo(map);

var osm_url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
var attribution_osm = '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>';
var OpenStreetMap = L.tileLayer(osm_url, {
  attribution: attribution_osm
});

var opentopomap_url = 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
var attribution_opentopomap = 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)';
var OpenTopoMap = L.tileLayer(opentopomap_url, {
  attribution: attribution_opentopomap
});

var osm_blackwhite_url = 'http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png';
var OpenStreetMap_BlackAndWhite = L.tileLayer(osm_blackwhite_url, {
  attribution: attribution_osm
});

var esri_worldimagery_url = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
var attribution_esriworldimagery = 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community';
var Esri_WorldImagery = L.tileLayer(esri_worldimagery_url, {
  attribution: attribution_esriworldimagery
});

var cdem_url = 'http://maps.geogratis.gc.ca/wms/elevation_en?';
var cdem = L.tileLayer.wms(cdem_url, {
  id: 'MapID',
  attribution: attribution_OGLC,
  layers: 'cdem.color-shaded-relief',
  transparent: true,
  format: 'image/png'
}).addTo(map);

var dnecPolyOptions = {
  "color": "#1C1C1C",
  "weight": 0.2,
  "fillOpacity": 0.1
};

var provterrPolyOptions = {
  "color": "#1C1C1C",
  "weight": 0.4,
  "fillOpacity": 0.0
};

var topo_dnec = L.geoJson(null, {
  style: dnecPolyOptions,
  onEachFeature: onEachFeature
});

topo_dnec.getAttribution = function() {
  return attribution_OGLC;
};

var topo_provterr = L.geoJson(null, {
  style: provterrPolyOptions,
  onEachFeature: onEachProvTerr
});

topo_provterr.getAttribution = function() {
  return attribution_NE;
};

queue()

  .defer(d3.json, 'data/dnec.json')
  .defer(d3.json, 'data/provterrito_topo.json')
  .await(addToMap);

function addToMap(error, dnec, provterr) {
  var dnec_layer = topojson.object(dnec, dnec.objects.dnec).geometries;
  topo_dnec.addData(dnec_layer);
  // topo_dnec.addTo(map);
  var provterr_layer = topojson.object(provterr, provterr.objects.provterrNEAdmin1).geometries;
  topo_provterr.addData(provterr_layer);
  topo_provterr.addTo(map);
  map.spin(false);
}

var baseMaps = {
  "Carto": CartoDB_DarkMatterNoLabels,
  "OpenStreetMap": OpenStreetMap,
  "OpenStreetMap: Black & White": OpenStreetMap_BlackAndWhite,
  "OpenTopoMap": OpenTopoMap,
  "Esri World Imagery": Esri_WorldImagery
};

var overlayMaps = {
  "CDEC/DNEC Grid": topo_dnec,
  "Provinces and Territories": topo_provterr,
  "Canadian Digital Elevation Relief": cdem,
};

L.control.layers(baseMaps, overlayMaps).addTo(map);

var sidebar = L.control.sidebar('sidebar').addTo(map);

sidebar.open('home');
