// JavaScript source code

//  set Leaflet
var map = L.mapbox.map('mapid', 'mapbox.street', {
    accessToken: '<pk.eyJ1IjoibWlhZGliZSIsImEiOiJjazVwOWw3ZXowdDhjM2xuc3U3cGN3NGxwIn0.aYf9qdTxNVl9igxiN-NnIA>'
})
    .setView([51.509865, -0.118092], 11);

L.tileLayer('https://api.mapbox.com/styles/v1/miadibe/ckaffoouw0d1y1il9m090hc52/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoibWlhZGliZSIsImEiOiJjazVwOWw3ZXowdDhjM2xuc3U3cGN3NGxwIn0.aYf9qdTxNVl9igxiN-NnIA', {
    maxZoom: 15,
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
        '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="http://mapbox.com">Mapbox</a>',

}).addTo(map);

//get data from API

var url_airbnb = "http://dev.spatialdatacapture.org:8707/data/airbnb_point";

// Heat Map for Point Data

var heatgeojsonmysql = [];

$.getJSON(url_airbnb, function (data) {

    // convert the json data with point data from mysql to become geoJSON    
    data.forEach(function (point) {
        var lat = point.latitude;
        var lon = point.longitude;
        var int = 0.5 // change it later!

        var feature = [lat, lon, int];

        heatgeojsonmysql.push(feature);

    });

});

var heat = L.heatLayer(heatgeojsonmysql, {
    radius: 15,
    blur: 15,
    maxZoom: 17,
}).addTo(map);


// Location Point Data

var url_pub = "http://dev.spatialdatacapture.org:8707/data/pubs_yelp";

var geojsonmysql = [];

$.getJSON(url_pub, function (data) {

    json = data;

// convert the json data with point data from mysql to become geoJSON    
    json.forEach(function (point) {
        var lat = point.latitude;
        var lon = point.longitude;

        var feature = {
            type: 'Feature',
            properties: point,
            geometry: {
                type: 'Point',
                coordinates: [lon, lat]
            }
        };

        geojsonmysql.push(feature);
    });

});

var testvar = { type: 'FeatureCollection', features: geojsonmysql };

//Marker Style

var geojsonMarkerOptions = {
        radius: 3,
        fillColor: "#6dff33",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
};

L.geoJson(testvar, {
        onEachFeature: function (feature, layer) {
            pointlayer.addLayer(layer)
        },
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, geojsonMarkerOptions);
        }
}).addTo(map);


var pointlayer = L.layerGroup().addTo(map)

// BUBBLE

var url2 = "http://dev.spatialdatacapture.org:8707/data/airbnb_borough";

var bubblejsonmysql = [];

$.getJSON(url2, function (data) {

    // convert the json data with point data from mysql to become geoJSON    

    data.forEach(function (point) {

        var lat = point.latitude;
        var lon = point.longitude;
        var listings = point.num_list;

        var feature = {
            type: 'Feature',
            properties: {
                'number_of_listings': Math.floor(listings),
            },

            geometry: {
                type: 'Point',
                coordinates: [lon, lat]

            }
        };

        bubblejsonmysql.push(feature);

    });


});

var bubblef = { type: 'FeatureCollection', features: bubblejsonmysql };

var bubbles_review_count = L.bubbleLayer(bubblef, {
    property: 'number_of_listings',
    legend: false,
    max_radius: 90,
    style: { radius: 1, fillColor: '#ADAD85', color: "#555", weight: 1, opacity: 0.8, fillOpacity: 0.5 },
    tooltip: true
})

bubbles_review_count.addTo(map);

// Add Airbnb Price Layer

$.getJSON('./geojson/airbnb_borough.geojson', function (json) {

    L.geoJSON(json, {

        onEachFeature: function (feature, layer) {

            var Initstyle = {
                fillColor: airbnb_price_getColor(feature.properties.price),
                weight: 2,
                opacity: 1,
                color: 'white',
                dashArray: '3',
                fillOpacity: 0.9
            }

            layer.bindPopup('Borough:' + feature.properties.neighbourhood + '<p>' + 'Price:' + Math.floor(feature.properties.price) + 'pounds' + '</p>'),

            airbnb_price.addLayer(layer)
        },

        style: function (feature) {
            return {
                fillColor: airbnb_price_getColor(feature.properties.price),
                weight: 2,
                opacity: 1,
                color: 'white',
                dashArray: '3',
                fillOpacity: 0.9
            }
        }

    })
})

var airbnb_price = L.layerGroup().addTo(map)

// Add Airbnb Rating Layer

$.getJSON('./geojson/airbnb_borough.geojson', function (json) {

    L.geoJSON(json, {

        onEachFeature: function (feature, layer) {

            var Initstyle = {
                fillColor: airbnb_review_scores_rating_getColor(feature.properties.review_scores_rating),
                weight: 2,
                opacity: 1,
                color: 'white',
                dashArray: '3',
                fillOpacity: 0.9
            }

            layer.bindPopup('Borough:' + feature.properties.neighbourhood + '<p>' + 'Rating:' + Math.floor(feature.properties.review_scores_rating) + '</p>'),

                airbnb_review_scores_rating.addLayer(layer)
        },

        style: function (feature) {
            return {
                fillColor: airbnb_review_scores_rating_getColor(feature.properties.review_scores_rating),
                weight: 2,
                opacity: 1,
                color: 'white',
                dashArray: '3',
                fillOpacity: 0.9
            }
        }

    })
})

var airbnb_review_scores_rating = L.layerGroup().addTo(map)

//Lengend

function airbnb_price_getColor(d) {
    return d > 220 ? '#000000' :
           d > 192 ? '#538CC6' :
           d > 164 ? '#6699CC' :
           d > 136 ? '#79A6D2' :
           d > 108 ? '#8CB3D9':
           d > 80 ? '#B3CCE6' :
                        '#ECF2F9';
}

var airbnb_price_legend = L.control({ position: 'bottomright' });

airbnb_price_legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [80, 108, 136, 164, 192, 220],
        labels = ['<strong>Average Price</strong>'];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        from = grades[i];
        to = grades[i + 1];

        labels.push(
            '<i style="background:' + airbnb_price_getColor(from + 0.01) + '"></i> ' +
            from + (to ? '&ndash;' + to + '<br>' : '+'));
    }

    div.innerHTML = labels.join('<br>');
    return div;
};

function airbnb_review_scores_rating_getColor(d) {
    return d > 95 ? '#000000' :
           d > 94 ? '#538CC6' :
           d > 93 ? '#6699CC' :
           d > 92 ? '#79A6D2' :
           d > 91 ? '#8CB3D9':
           d > 90 ? '#B3CCE6' :
                        '#ECF2F9';
}

var airbnb_review_scores_rating_legend = L.control({ position: 'bottomright' });

airbnb_review_scores_rating_legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [80, 108, 136, 164, 192, 220],
        labels = ['<strong>Average Review Rating</strong>'];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        from = grades[i];
        to = grades[i + 1];

        labels.push(
            '<i style="background:' + airbnb_review_scores_rating_getColor(from + 0.01) + '"></i> ' +
            from + (to ? '&ndash;' + to + '<br>' : '+'));
    }

    div.innerHTML = labels.join('<br>');
    return div;
};


// Text Box

L.Control.textbox = L.Control.extend({
    onAdd: function (map) {

        var text = L.DomUtil.create('div');
        text.id = "info_text";
        text.innerHTML = "<strong>Hi, We are JAMS</strong>"
        return text;
    },

    onRemove: function (map) {
        // Nothing to do here
    }
});

L.control.textbox = function (opts) { return new L.Control.textbox(opts); }
L.control.textbox({ position: 'bottomleft' }).addTo(map);

// Info Bar Chart

// Control layer

var baseMaps = {
    "Location Heat Map": heat,
    "Avg. Room Price": airbnb_price,
    "Avg. Review Rating": airbnb_review_scores_rating,
    "Number of Listings": bubbles_review_count

};

var overlayMaps = {
    "Location": pointlayer
};

L.control.layers(baseMaps, overlayMaps, { collapsed: false }).addTo(map);

map.on('baselayerchange', function (eventLayer) {

    if (eventLayer.name === 'Avg. Room Price') {
        this.removeControl(airbnb_review_scores_rating_legend);
        airbnb_price_legend.addTo(this);
    } else if (eventLayer.name === 'Avg. Review Rating') {
        this.removeControl(airbnb_price_legend);
        airbnb_review_scores_rating_legend.addTo(this);
    } else if (eventLayer.name === 'Location Heat Map') {
        this.removeControl(airbnb_price_legend);
        this.removeControl(airbnb_review_scores_rating_legend);
    } else if (eventLayer.name === 'Number of Listings') {
        this.removeControl(airbnb_price_legend);
        this.removeControl(airbnb_review_scores_rating_legend);
    }

});