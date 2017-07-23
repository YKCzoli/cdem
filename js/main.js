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
  maxZoom: 12,
  minZoom: 2
});

var nav = new mapboxgl.NavigationControl();
map.addControl(nav, 'bottom-right');

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
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [-140.402778,
          60.567222
        ]
      },
      "properties": {
        "name": "Mount Logan",
        "provterr": "Yukon",
        "elevation": 5956,
        "description": "Mount Logan is the highest mountain in Canada and the second-highest peak in North America, after Denali. The mountain was named after Sir William Edmond Logan, a Canadian geologist and founder of the Geological Survey of Canada (GSC)."
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [-137.526667,
          58.907222
        ]
      },
      "properties": {
        "name": "Mount Fairweather",
        "provterr": "British Columbia",
        "elevation": 4663,
        "description": "Mount Fairweather (officially gazetted as Fairweather Mountain in Canada but referred to as Mount Fairweather), is one of the world's highest coastal mountains at 4,671 metres (15,325 feet.)"
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [-117.436111,
          52.147222
        ]
      },
      "properties": {
        "name": "Mount Columbia",
        "provterr": "Alberta",
        "elevation": 3747,
        "description": "Mount Columbia is the highest point in Alberta, Canada. It is second only to Mount Robson for height and topographical prominence in the Canadian Rockies. It is located on the border between Alberta and British Columbia on the northern edge of the Columbia Icefield. Its highest point, however, lies within Jasper National Park in Alberta."
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [-127.683056,
          61.875
        ]
      },
      "properties": {
        "name": "Mount Nirvana",
        "provterr": "Northwest Territories",
        "elevation": 2773,
        "description": "Mount Nirvana, at 2,773 m (9,098 ft) is the unofficial name of the highest mountain in the Northwest Territories, Canada."
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [-75.025,
          81.908333
        ]
      },
      "properties": {
        "name": "Barbeau Peak",
        "provterr": "Nunavut",
        "elevation": 2616,
        "description": "Barbeau Peak is a mountain in Qikiqtaaluk, Nunavut, Canada. Located on Ellesmere Island within Quttinirpaaq National Park, it is the highest mountain in Nunavut and the Canadian Arctic. The mountain was named in 1969 for Dr. Marius Barbeau (1883-1969), a Canadian anthropologist whose research into First Nations and Inuit cultures gained him international acclaim."
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [-63.716667,
          58.883333
        ]
      },
      "properties": {
        "name": "Mount Caubvick",
        "provterr": "Newfoundland and Labrador",
        "elevation": 1652,
        "description": "Mount Caubvick (known as Mont D'Iberville in Quebec) is a mountain located on the border between Labrador and Quebec in the Selamiut Range of the Torngat Mountains. Mount Caubvick is the highest point in mainland Canada east of Alberta. The mountain contains a massive peak that rises sharply from nearby sea level. Craggy ridges, steep cirques and glaciers are prominent features of the peak."
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [-109.983333,
          49.55
        ]
      },
      "properties": {
        "name": "Cypress Hills",
        "provterr": "Saskatchewan",
        "elevation": 1392,
        "description": "The Cypress Hills are a geographical region of hills in southwestern Saskatchewan and southeastern Alberta, Canada."
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [-100.716667,
          51.466667
        ]
      },
      "properties": {
        "name": "Baldy Mountain",
        "provterr": "Manitoba",
        "elevation": 832,
        "description": "Baldy Mountain is the highest peak in Manitoba, Canada. It is located in the Duck Mountain Provincial Park, northwest of Dauphin. It is 832 m (2,730 ft) tall, making it the highest mountain in the 563 km (350 mi) long Manitoba Escarpment."
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [-66.883333,
          47.383333
        ]
      },
      "properties": {
        "name": "Mount Carleton",
        "provterr": "New Brunswick",
        "elevation": 817,
        "description": "Mount Carleton, in Mount Carleton Provincial Park, is at 817m the highest elevation in the Canadian province of New Brunswick, and is also the highest peak in the Canadian Maritime Provinces. It is one of the highlights of the Canadian portion of the International Appalachian Trail."
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [-80.75,
          47.316667
        ]
      },
      "properties": {
        "name": "Ishpatina Ridge",
        "provterr": "Ontario",
        "elevation": 693,
        "description": "Ishpatina Ridge is the highest point of land in the Canadian province of Ontario, at an estimated 693 m (2,274 ft) above sea level. Ishpatina Ridge rises approximately 300 m (984 ft) above the immediate area. It was only truly recognized as Ontario's highest point after federal government topographical mapping revealed this fact in the 1970s. Before then, the more popular Maple Mountain was thought to be higher."
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [-60.6,
          46.7
        ]
      },
      "properties": {
        "name": "White Hill",
        "provterr": "Nova Scotia",
        "elevation": 535,
        "description": "White Hill is a Canadian peak in the Cape Breton Highlands and is the highest elevation point in the province of Nova Scotia."
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [-63.416667,
          46.333333
        ]
      },
      "properties": {
        "name": "Glen Valley",
        "provterr": "Prince Edward Island",
        "elevation": 142,
        "description": "Glen Valley is the highest point in Prince Edward Island."
      }
    },

    ///////////////
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
    },
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
    var activeDetails = document.getElementById('active_details');
    if (activeDetails) {
      activeDetails.outerHTML= '';
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

    link.addEventListener('click', function(e) {
      var clickedListing = data.features[this.dataPosition];

      flyToStore(clickedListing);

      createPopUp(clickedListing);

      var activeItem = document.getElementsByClassName('active');
      if (activeItem[0]) {
        activeItem[0].classList.remove('active');
      }

      var activeDetails = document.getElementById('active_details');
      if (activeDetails) {
        activeDetails.outerHTML= '';
        this.parentNode.classList.add('active');
      }

      var details = this.parentNode.insertBefore(document.createElement('div'), this.nextSibling);
      details.setAttribute('id', 'active_details');
      details.innerHTML = clickedListing.properties.description;

    });
  }
}
