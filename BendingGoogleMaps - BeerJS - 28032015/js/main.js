$(function() {

    var options = {
        styleMarkers: false,
        styleDirections: false,
        styleMap: false,
        showDirections: false
    };

    var betahaus = new google.maps.LatLng(42.680282, 23.325268999999935);

    // add custom map styles
    var mapStyleName = 'BeerJS';
    // define map style options
    var mapStyle = [{
        "featureType": "landscape.man_made",
        "stylers": [{
            "color": "#b5cee4"
        }]
    }, {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [{
            "color": "#f9eb90"
        }]
    }];

    // create map style object
    var styledMapType = new google.maps.StyledMapType(mapStyle, {
        name: mapStyleName
    });

    var mapOptions = {
        zoom: 15,
        center: betahaus,
    };

    // add map style to map type controls and select base map type
    if (options.styleMap) {
        mapOptions.mapTypeId = mapStyleName;
        mapOptions.mapTypeControlOptions = {
            mapTypeIds: [google.maps.MapTypeId.ROADMAP, google.maps.MapTypeId.HYBRID, mapStyleName]
        };
    }

    var map = new google.maps.Map(document.getElementById('map'), mapOptions);

    // add new map style
    if (options.styleMap) {
        map.mapTypes.set(mapStyleName, styledMapType);
    }

    // styling marker -------------------------------
    var createMarker = function() {
        if (options.styleMarkers) {
            var styledMarker = new google.maps.Marker({
                position: betahaus,
                map: map,
                icon: '/img/beerjs_small.png'
            });
        } else {
            var marker = new google.maps.Marker({
                position: betahaus,
                map: map
            });
        }
    };

    createMarker();

    // styling directions ----------------------------
    var renderCustomDirections = function(data) {
        var source = $("#directions-template").html();
        var template = Handlebars.compile(source);
        var html = template(data);
        $('#directions').html(html);
    };
    var showDirections = function() {
        var rendererOptions = {};

        // show directions in panel
        if (!options.styleDirections) {
            rendererOptions.panel = document.getElementById('directions');
        }

        var hackbulgaria = new google.maps.LatLng(42.64774, 23.384747);

        // add custom directions styling to map
        if (options.styleDirections) {
            rendererOptions.suppressMarkers = true;
            rendererOptions.polylineOptions = {
                strokeColor: "black",
                strokeWeight: 5,
                strokeOpacity: 0.5
            };
            var startMarker = new google.maps.Marker({
                position: hackbulgaria,
                map: map,
                icon: '/img/car.png'
            });
        }

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
                $('#map').removeClass('full');
                google.maps.event.trigger(map, 'resize');
                $('#directions-holder').removeClass('hidden');

                directionsRenderer.setDirections(response);

                // use custom styling for directions panel
                if (options.styleDirections) {
                    renderCustomDirections(response.routes[0].legs[0]);
                }
            }
        });
    };

    if (options.showDirections) {
        showDirections();
    }

    // make map fullscreen height
    $(window).resize(function() {
        $('#map').height($(window).height());
        google.maps.event.trigger(map, 'resize');
    });

    $(window).trigger('resize');

});