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
map.addControl(mapboxGeocoder);



geolocate = function() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var marker = new mapboxgl.Marker()
                .setLngLat([position.coords.longitude, position.coords.latitude])
                .addTo(map);
            map.flyTo({center: [position.coords.longitude, position.coords.latitude], zoom: 15});
        }, function(error) {
            console.log(error);
            alert('We aren\'t authorized to get your position.');
        });
    } else {
        alert('Unable to get position');
    }
};

geolocate();