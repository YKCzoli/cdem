if (!('remove' in Element.prototype)) {
  Element.prototype.remove = function() {
    if (this.parentNode) {
      this.parentNode.removeChild(this);
    }
  };
}

mapboxgl.accessToken = 'pk.eyJ1IjoiZXhhbXBsZXMiLCJhIjoiY2lqbmpqazdlMDBsdnRva284cWd3bm11byJ9.V6Hg2oYJwMAxeoR9GEzkAA';

var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v9',
  center: [-97.451180, 60],
  zoom: 3,
  maxZoom: 12
});

map.on('load', function() {
    map.addLayer({
        'id': 'cdem',
        'type': 'raster',
        'source': {
            'type': 'raster',
            'tiles': [
              'http://maps.geogratis.gc.ca/wms/elevation_en?&service=WMS&request=GetMap&layers=cdem.color-shaded-relief&styles=&format=image%2Fpng&transparent=true&version=1.1.1&height=256&width=256&srs=EPSG%3A3857&bbox={bbox-epsg-3857}'
            ],
            'tileSize': 256
        },
        'paint': {}
    }, 'water');
});

var elevation_places = {
  "type": "FeatureCollection",
  "features": [{
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [-115.587158203125,
          51.18967256411778
        ]
      },
      "properties": {
        "name": "Banff",
        "provterr": "Alberta",
        "elevation": 344,
        "description": "Banff is a city in Alberta"
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [-73.588889,
          45.506389
        ]
      },
      "properties": {
        "name": "Mount Royal",
        "provterr": "Quebec",
        "elevation": 233,
        "description": "Mount Royal is a large volcanic-related hill or small mountain in the city of Montreal, immediately west of downtown Montreal, the city to which it gave its name."
      }
    }
  ]
};
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
  new mapboxgl.Marker(el, {
    })
    .setLngLat(marker.geometry.coordinates)
    .addTo(map);

  el.addEventListener('click', function(e) {
    flyToStore(marker);

    createPopUp(marker);

    var activeItem = document.getElementsByClassName('active');

    e.stopPropagation();
    if (activeItem[0]) {
      activeItem[0].classList.remove('active');
    }

    var listing = document.getElementById('listing-' + i);
    listing.classList.add('active');

  });
});


function flyToStore(currentFeature) {
  map.flyTo({
    center: currentFeature.geometry.coordinates,
    zoom: 11
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
    '<div>Latitude: ' + currentFeature.geometry.coordinates[0] + '</div>' +
    '<div>Longitude: ' + currentFeature.geometry.coordinates[1] + '</div>' +
    '<div>Elevation: ' + currentFeature.properties.elevation + 'm</div>')
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
    link.innerHTML = prop.name + ', ' + prop.provterr;

    var details = listing.appendChild(document.createElement('div'));
    details.innerHTML = 'location_details';

    link.addEventListener('click', function(e) {
      var clickedListing = data.features[this.dataPosition];

      flyToStore(clickedListing);

      createPopUp(clickedListing);

      var activeItem = document.getElementsByClassName('active');

      if (activeItem[0]) {
        activeItem[0].classList.remove('active');
      }
      this.parentNode.classList.add('active');

    });
  }
}
