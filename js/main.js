var flyToZoom = {
  "Northwest Territories": 4,
  "Nunavut": 4,
  "New Brunswick": 6,
  "Nova Scotia": 6,
  "Prince Edward Island": 8
};

function flyToAdmin(admin_name) {
  for (i = 0; i < Object.keys(topo_provterr._layers).length; i++) {
    if (topo_provterr._layers[Object.keys(topo_provterr._layers)[i]].feature.geometry.properties.name == admin_name) {
      map.flyTo(topo_provterr._layers[Object.keys(topo_provterr._layers)[i]].getBounds().getCenter(), (flyToZoom[admin_name] || 5));
    }
  }
}

// OGLC = open-government-licence-canada
var attribution_OGLC = '<a href="http://open.canada.ca/en/open-government-licence-canada">Open Government Licence - Canada</a>';
var attribution_NE = '<a href="http://www.naturalearthdata.com/">Made with Natural Earth</a>';

function onEachProvTerr(feature, layer) {
  layer.on('click', function() {
    console.log('clicked polygon');
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

var provterrPolyOptions = {
  "color": "#1C1C1C",
  "weight": 0.4,
  "fillOpacity": 0.0
};

var topo_provterr = L.geoJson(null, {
  style: provterrPolyOptions,
  onEachFeature: onEachProvTerr
});

topo_provterr.getAttribution = function() {
  return attribution_NE;
};

queue()

  .defer(d3.json, 'data/provterrito_topo.json')
  .await(addToMap);

function addToMap(error, provterr) {
  var provterr_layer = topojson.object(provterr, provterr.objects.provterrNEAdmin1).geometries;
  topo_provterr.addData(provterr_layer);
  topo_provterr.addTo(map);
  map.spin(false);
}

var baseMaps = {
  "Carto": CartoDB_DarkMatterNoLabels,
  "OpenStreetMap": OpenStreetMap,
  "Esri_WorldImagery": Esri_WorldImagery
};

var overlayMaps = {
  "Provinces and Territories": topo_provterr,
  "Canadian Digital Elevation Relief": cdem,
};

L.control.layers(baseMaps, overlayMaps).addTo(map);

var sidebar = L.control.sidebar('sidebar').addTo(map);

sidebar.open('info');

// some hack to avoid delay of bootstrap-select render
// found at: https://stackoverflow.com/questions/23251488/bootstrap-select-plugin-how-to-avoid-flickering
$('.selectpicker').selectpicker({
});

// Dynamic sidebar  and map zoom with selection
document
    .getElementById('adminpicker')
    .addEventListener('change', function () {
        'use strict';
        flyToAdmin(this.value);
        var vis = document.querySelector('.vis'),
            target = document.getElementById(this.value);
        if (vis !== null) {
            vis.className = 'inv';
        }
        if (target !== null ) {
            target.className = 'vis';
        }
});

function changeOverlay(overlay) {

    $('#basemaps .side-view-content .side-element .link-on').each(function () {
        $(this).removeClass('on');
    });
    console.log(overlay)
    console.log(baseMaps);
    baseMaps[overlay].addTo(map);

    // $('#' + overlay + ' .link-on').addClass('on');
    // setStyle(overlay);
}

function update_basemaps() {
    overlay = document.getElementsByClassName('link-on on')[0].parentElement.getAttribute('id');
    setStyle(overlay);
}
