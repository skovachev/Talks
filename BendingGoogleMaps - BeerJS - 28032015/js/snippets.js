// markers
var betahaus = new google.maps.LatLng(42.680282, 23.3252689);
var marker = new google.maps.Marker({
    position: betahaus,
    map: map
});

// symbol
var marker = new google.maps.Marker({
    position: betahaus,
    icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 10
    },
    map: map
});

// custom symbol
var goldStar = {
    path: 'M 125,5 155,90 245,90 175,145 200,230 125,180 50,230 75,145 5,90 95,90 z',
    fillColor: 'yellow',
    fillOpacity: 0.8,
    scale: 1,
    strokeColor: 'gold',
    strokeWeight: 14
};
var marker = new google.maps.Marker({
    position: betahaus,
    icon: goldStar,
    map: map
});

// shape
var triangleCoords = [
    new google.maps.LatLng(25.774252, -80.190262),
    new google.maps.LatLng(18.466465, -66.118292),
    new google.maps.LatLng(32.321384, -64.75737),
    new google.maps.LatLng(25.774252, -80.190262)
];
bermudaTriangle = new google.maps.Polygon({
    paths: triangleCoords,
    strokeColor: '#FF0000',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#FF0000',
    fillOpacity: 0.35,
    map: map
});

// custom marker
CustomOverlay.prototype = new google.maps.OverlayView();
CustomOverlay.prototype.draw = function() {
    var self = this;
    var div = this.div;

    if (!div) {
        div = this.div = document.createElement('div');

        // create html and append to div

        var panes = this.getPanes();
        panes.overlayImage.appendChild(div);
    }
};

// map
var mapOptions = {
    zoom: 15,
    center: betahaus,
};
var map = new google.maps.Map(document.getElementById('map'), mapOptions);

// map style + add to controls bar
var mapStyleName = 'BeerJS';
// define map style options
var mapStyle = [{
    "featureType": "landscape.man_made",
    "stylers": [{
        "color": "#b5cee4"
    }]
}];
// create map style object
var styledMapType = new google.maps.StyledMapType(mapStyle, {
    name: mapStyleName
});
// set default map style
mapOptions.mapTypeId = mapStyleName;
// add to map types selection control
mapOptions.mapTypeControlOptions = {
    mapTypeIds: [google.maps.MapTypeId.ROADMAP, google.maps.MapTypeId.HYBRID, mapStyleName]
};

// directions

var rendererOptions = {
    panel: document.getElementById('directions')
};

var directionsRenderer = new google.maps.DirectionsRenderer(rendererOptions);
var directionsService = new google.maps.DirectionsService();
directionsRenderer.setMap(map);

var request = {
    origin: hackbulgaria,
    destination: betahaus,
    travelMode: google.maps.TravelMode.DRIVING
};

directionsService.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
        directionsRenderer.setDirections(response);
    }
});

// styling map directions

// hide default markers
rendererOptions.suppressMarkers = true;
// update polyline styles
rendererOptions.polylineOptions = {
    strokeColor: "black",
    strokeWeight: 5,
    strokeOpacity: 0.5
};
// create custom starting point marker
var startMarker = new google.maps.Marker({
    position: hackbulgaria,
    map: map,
    icon: '/img/car.png'
});

// example directions response
{
    "status": "OK",
    "routes": [{
        "summary": "I-40 W",
        "legs": [{
            "steps": [{
                "travel_mode": "DRIVING",
                "start_location": {
                    "lat": 41.8507300,
                    "lng": -87.6512600
                },
                "end_location": {
                    "lat": 41.8525800,
                    "lng": -87.6514100
                },
                "polyline": {
                    "points": "a~l~Fjk~uOwHJy@P"
                },
                "duration": {
                    "value": 19,
                    "text": "1 min"
                },
                "html_instructions": "Head \u003cb\u003enorth\u003c/b\u003e on \u003cb\u003eS Morgan St\u003c/b\u003e toward \u003cb\u003eW Cermak Rd\u003c/b\u003e",
                "distance": {
                    "value": 207,
                    "text": "0.1 mi"
                }
            }]
        }]
    }]
}