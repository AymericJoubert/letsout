mapboxgl.accessToken = 'pk.eyJ1IjoiYXlqb3UiLCJhIjoiY2pwMTE0Y3AzMGJpeTN2bXQzZnhvMHNmdiJ9.ZzGo1LAOFbn2DMp9pzSQ9w';

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v9',
    center: [3.066667, 50.633333],
    zoom: 15,
    attribution: 'Letsout - ayjou', /* set the map's caption */
    // zoomControl: false, // false = no zoom control buttons displayed
    scrollWheelZoom: false // false = scrolling zoom on the map is locked
});

var mapboxGeocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken
});
document.getElementById('geocoder').appendChild(mapboxGeocoder.onAdd(map));
// map.addControl(mapboxGeocoder);
map.addControl(new mapboxgl.GeolocateControl({
    positionOptions: {
        enableHighAccuracy: true
    },
    trackUserLocation: true
}));
map.on('load', function() {
    map.addSource('single-point', {
        "type": "geojson",
        "data": {
            "type": "FeatureCollection",
            "features": []
        }
    });
    map.addLayer({
        "id": "point",
        "source": "single-point",
        "type": "circle",
        "paint": {
            "circle-radius": 10,
            "circle-color": "#00b1ff"
        }
    });
});
mapboxGeocoder.on('result', function(ev) {
    map.getSource('single-point').setData(ev.result.geometry);
    updateFacebookMap(ev.result.geometry.coordinates[0], ev.result.geometry.coordinates[1]);
});


geolocate = function() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            map.flyTo({center: [position.coords.longitude, position.coords.latitude], zoom: 15});
            updateFacebookMap(position.coords.longitude, position.coords.latitude);
        }, function(error) {
            console.log(error);
        });
    }
};

geolocate();

$(document).ready(function() {
    $.ajaxSetup({ cache: true });
    $.getScript('https://connect.facebook.net/en_US/sdk.js', function(){
        FB.init({
            appId: '1121842227855497',
            version: 'v2.8'
        });
        $('#loginbutton,#feedbutton').removeAttr('disabled');
        FB.getLoginStatus(updateStatusCallback);
    });
});

updateStatusCallback = function(authResponse){
    updateFacebookMap();
};

updateFacebookMap = function(longitude, latitude) {
    var options = {
        version: 'v3.2',
        query: 'Lille France',
        latitude: latitude ? latitude : '50.633333',
        longitude: longitude ? longitude : '3.066667',
        distance: 10000,
        limit: 100,
        fields: 'location,description',
        accessToken: '1121842227855497|6j-cu70hs2X7usTTIjJowuqx3Js'
    };

    // https://graph.facebook.com/v3.2/search?type=place&center=50.633333,3.066667&fields=about&access_token=1121842227855497|6j-cu70hs2X7usTTIjJowuqx3Js
    var url = "https://graph.facebook.com/" + options.version + "/search" +
        "?type=place" +
        "&fields=" + options.fields +
        // "&q=" + options.query +
        "&center=" + options.latitude + "," + options.longitude +
        "&distance=" + options.distance +
        "&limit=" + options.limit +
        "&access_token=" + options.accessToken;

    $.ajax({
        url: url,

        success: function(events) {
            $.each(events.data, function(key, value) {
                if (value.description !== undefined) {
                    var popup = new mapboxgl.Popup()
                        .setHTML(value.description);

                    var marker = new mapboxgl.Marker()
                        .setLngLat([value.location.longitude, value.location.latitude])
                        .setPopup(popup)
                        .addTo(map);
                }
            });
        },
        error: function(e) {
            console.log(e);
        },
    });
};
