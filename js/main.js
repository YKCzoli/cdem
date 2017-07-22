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
  center: [-97.451180, 59],
  zoom: 1,
  minZoom: 3,
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
        "city": "Banff",
        "prov-terr": "B.C."
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [-73.59123229980469,
          45.50538444896976
        ]
      },
      "properties": {
        "city": "Montreal",
        "prov/terr": "Quebec"
      }
    }
  ]
};
map.on('load', function(e) {
  map.addSource("places", {
    "type": "geojson",
    "data": elevation_places
  });
  // Initialize the list
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
    zoom: 15
  });
}

function createPopUp(currentFeature) {
  var popUps = document.getElementsByClassName('mapboxgl-popup');
  if (popUps[0]) popUps[0].remove();


  var popup = new mapboxgl.Popup({
      closeOnClick: false
    })
    .setLngLat(currentFeature.geometry.coordinates)
    .setHTML('<h3>Elevation Name</h3>' +
      '<h4>' + currentFeature.properties.city + '</h4>')
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
    link.innerHTML = prop.city;

    var details = listing.appendChild(document.createElement('div'));
    details.innerHTML = prop.city;
    if (prop.phone) {
      details.innerHTML += ' &middot; ' + prop.phoneFormatted;
    }



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
