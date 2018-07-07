$(window).on('load', function() {
  $('#myModal').modal('show');
});

if (!('remove' in Element.prototype)) {
  Element.prototype.remove = function() {
    if (this.parentNode) {
      this.parentNode.removeChild(this);
    }
  };
}

mapboxgl.accessToken = 'pk.eyJ1IjoieWN6b2xpIiwiYSI6IjJkRURjVW8ifQ.VGeQDfYcDPlFWrr_1vD3cg';

// OGLC = open-government-licence-canada
var attribution_OGLC = '<a href="http://open.canada.ca/en/open-government-licence-canada" target="_blank">Open Government Licence - Canada</a>';
var attribution_wikipedia = '<a href="https://en.wikipedia.org/wiki/List_of_highest_points_of_Canadian_provinces_and_territories" target="_blank">Wikipedia</a>';

var map_center = [-65, 71];

if ($(window).width() === 768) {
  map_center = [-80, 71];
} else if ($(window).width() < 768) {
  map_center = [-95, 71];
}

var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/yczoli/cj8gk73m01arj2rplm6owne9p',
  center: map_center,
  zoom: 2,
  maxZoom: 11,
  minZoom: 2
});

var nav = new mapboxgl.NavigationControl();
map.addControl(nav, 'top-right');

map.on('load', function() {
  map.addLayer({
    'id': 'cdem',
    'type': 'raster',
    'source': {
      'type': 'raster',
      'attribution': attribution_OGLC + ' | ' + attribution_wikipedia,
      'tiles': [
        'http://maps.geogratis.gc.ca/wms/elevation_en?&service=WMS&request=GetMap&layers=cdem.color-shaded-relief&styles=&format=image%2Fpng&transparent=true&version=1.1.1&height=256&width=256&srs=EPSG%3A3857&bbox={bbox-epsg-3857}'
      ],
      'tileSize': 256
    },
    'paint': {}
  }, 'water');
});

map.on('load', function(e) {
  map.addSource("places", {
    "type": "geojson",
    "data": elevation_places
  });
  buildLocationList(elevation_places);
});

elevation_places.features.forEach(function(marker, i) {
  var el = document.createElement('div');
  el.id = "marker-" + i;
  el.className = 'marker';
  new mapboxgl.Marker(el, {})
    .setLngLat(marker.geometry.coordinates)
    .addTo(map);

  el.addEventListener('click', function(e) {
    flyToPeak(marker);

    createPopUp(marker);

    var activeItem = document.getElementsByClassName('active');

    e.stopPropagation();
    var activeDetails = document.getElementById('active_details');
    if (activeDetails) {
      activeDetails.outerHTML = '';
    }
    if (activeItem[0]) {
      activeItem[0].classList.remove('active');
    }

    var listing = document.getElementById('listing-' + i);
    listing.classList.add('active');
    var details = listing.appendChild(document.createElement('div'));
    details.setAttribute('id', 'active_details');
    details.innerHTML = marker.properties.description;
  });

  el.addEventListener('mouseenter', function(e) {
    map.getCanvas().style.cursor = 'pointer';
    createPopUp(marker);
  });

  el.addEventListener('mouseleave', function(e) {
    map.getCanvas().style.cursor = '';
  });

});

function flyToPeak(currentFeature) {
  map.flyTo({
    center: currentFeature.geometry.coordinates,
    zoom: currentFeature.properties.zoom || 9,
    offset: [-180, 0]
  });
}

function createPopUp(currentFeature) {
  var popUps = document.getElementsByClassName('mapboxgl-popup');
  if (popUps[0]) popUps[0].remove();

  var popup = new mapboxgl.Popup({
      closeOnClick: false
    })
    .setLngLat(currentFeature.geometry.coordinates)
    .setHTML('<h3>' + currentFeature.properties.name + '</h3>' +
      '<div>Elevation: ' + currentFeature.properties.elevation + ' m</div>')
    .addTo(map);
}

function buildLocationList(data) {
  for (i = 0; i < data.features.length; i++) {
    var currentFeature = data.features[i];
    var prop = currentFeature.properties;

    var listings = document.getElementById('listings');
    var listing = listings.appendChild(document.createElement('div'));
    listing.className = 'item';
    listing.id = "listing-" + i;

    var link = listing.appendChild(document.createElement('a'));
    link.href = '#';
    link.className = 'title';
    link.dataPosition = i;
    link.innerHTML = prop.provterr;

    link.addEventListener('click', function(e) {
      var clickedListing = data.features[this.dataPosition];

      flyToPeak(clickedListing);

      createPopUp(clickedListing);

      var activeItem = document.getElementsByClassName('active');
      if (activeItem[0]) {
        activeItem[0].classList.remove('active');
      }

      var activeDetails = document.getElementById('active_details');
      if (activeDetails) {
        activeDetails.outerHTML = '';
        this.parentNode.classList.add('active');
      }

      var details = this.parentNode.insertBefore(document.createElement('div'), this.nextSibling);
      details.setAttribute('id', 'active_details');
      details.innerHTML = clickedListing.properties.description;

    });
  }
}
