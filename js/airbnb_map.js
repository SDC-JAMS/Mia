// JavaScript source code

//  set Leaflet
var map = L.mapbox.map('mapid')
    .setView([51.509865, -0.118092], 11);

L.tileLayer('https://api.mapbox.com/styles/v1/miadibe/ckaffoouw0d1y1il9m090hc52/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoibWlhZGliZSIsImEiOiJjazVwOWw3ZXowdDhjM2xuc3U3cGN3NGxwIn0.aYf9qdTxNVl9igxiN-NnIA', {
    maxZoom: 15,
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
        '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery � <a href="http://mapbox.com">Mapbox</a>',

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
        var int = 0.5 //

        var feature = [lat, lon, int];

        heatgeojsonmysql.push(feature);

    });

});

var heat = L.heatLayer(heatgeojsonmysql, {
    radius: 15,
    blur: 10,
    maxZoom: 17,
}).addTo(map);


// BUBBLE

var url_airbnb_data = "http://dev.spatialdatacapture.org:8707/data/airbnb_data";

var bubblejsonmysql = [];

$.getJSON(url_airbnb_data, function (data) {

    // convert the json data with point data from mysql to become geoJSON

    data.forEach(function (point) {

        var lat = point.centroid_y;
        var lon = point.centroid_x;
        var listings = point.listings;

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

var bubbles_listings = L.bubbleLayer(bubblef, {
    property: 'number_of_listings',
    legend: false,
    max_radius: 90,
    style: { radius: 30, fillColor: '#ADAD85', color: "#555", weight: 1, opacity: 0.8, fillOpacity: 0.5 },
    tooltip: true
})

// Add Airbnb Price Layer


$.getJSON(url_airbnb_data, function (json) {

    var price_array = [];

    var wkt = new Wkt.Wkt()

    json.forEach(function (layer) {

        wkt.read(layer.geometry)

        var feature = {
            type: 'Feature',
            properties: {
                'neighbourhood': layer.neighbourhood,
                'price': layer.price
            },

            geometry: wkt.toJson()

        };

        price_array.push(feature);

    });

    var geoJSON = { type: 'FeatureCollection', features: price_array };

    L.geoJSON(geoJSON, {

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

    }).addLayer(map);
});

var airbnb_price = L.layerGroup()

// Add Airbnb Rating Layer

$.getJSON(url_airbnb_data, function (json) {

    var rating_array = [];

    var wkt = new Wkt.Wkt()

    json.forEach(function (layer) {

        wkt.read(layer.geometry)

        var feature = {
            type: 'Feature',
            properties: {
                'neighbourhood': layer.neighbourhood,
                'review_scores_rating': layer.review_scores_rating
            },

            geometry: wkt.toJson()

        };

        rating_array.push(feature);

    });

    var geoJSON = { type: 'FeatureCollection', features: rating_array };

    L.geoJSON(geoJSON, {

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

var airbnb_review_scores_rating = L.layerGroup()

// Add Airbnb Clustering Layer

var url_cluster = "http://dev.spatialdatacapture.org:8707/data/airbnb_cluster/";


$.getJSON(url_cluster, function (json) {

    var cluster_array = [];

    // Convert the wkt geometry from mysql to geoJSON
    // https://gis.stackexchange.com/questions/162842/convert-wkt-to-geojson-with-leaflet

    var wkt = new Wkt.Wkt()

    json.forEach(function (layer) {

        wkt.read(layer.geometry)

        var feature = {
            type: 'Feature',
            properties: {
                'cluster_type': layer.km5cls,
                'neighbourhood': layer.neighbourhood,
                'price': layer.price
            },

            geometry: wkt.toJson()

        };

        cluster_array.push(feature);

    });

    var geoJSON = { type: 'FeatureCollection', features: cluster_array };

    L.geoJSON(geoJSON, {

        onEachFeature: function (feature, layer) {

            var Initstyle = {
                fillColor: airbnb_cluster_getColor(feature.properties.cluster_type),
                weight: 2,
                opacity: 1,
                color: 'white',
                dashArray: '3',
                fillOpacity: 0.9
            }

            layer.bindPopup('<p>' + 'Borough:' + feature.properties.neighbourhood + '</p>' + 'Average Room Price: ' + Math.floor(feature.properties.price) + 'pounds'),

                airbnb_cluster.addLayer(layer)
        },

        style: function (feature) {
            return {
                fillColor: airbnb_cluster_getColor(feature.properties.cluster_type),
                weight: 2,
                opacity: 1,
                color: 'white',
                dashArray: '3',
                fillOpacity: 0.9
            }
        }

    })
})

var airbnb_cluster = L.layerGroup()

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

// Cluster Color

function airbnb_cluster_getColor(d) {
    return d == 4 ? '#EB6662' :
           d == 3 ? '#F7B172' :
           d == 2 ? '#82C881' :
           d == 1 ? '#1D8F94':
           d == 0 ? '#203D85' :
                    '';
}

var airbnb_cluster_legend = L.control({ position: 'bottomright' });

airbnb_cluster_legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [4, 3, 2, 1, 0],
        labels = ['<strong>Cluster Group</strong>'];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        from = grades[i];

        labels.push(
            '<i style="background:' + airbnb_cluster_getColor(from + 1) + '"></i> ' +
            from );
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
    "Number of Listings": bubbles_listings,
    "Avg. Room Price": airbnb_price,
    "Avg. Review Rating": airbnb_review_scores_rating,
    "Cluster by Rating Categories and Price": airbnb_cluster

};

var overlayMaps = {
};

L.control.layers(baseMaps, overlayMaps, { collapsed: false }).addTo(map);

map.on('baselayerchange', function (eventLayer) {

    if (eventLayer.name === 'Avg. Room Price') {
        this.removeControl(airbnb_review_scores_rating_legend);
        this.removeControl(airbnb_cluster_legend);
        airbnb_price_legend.addTo(this);
    } else if (eventLayer.name === 'Avg. Review Rating') {
        this.removeControl(airbnb_price_legend);
        this.removeControl(airbnb_cluster_legend);
        airbnb_review_scores_rating_legend.addTo(this);
    } else if (eventLayer.name === 'Location Heat Map') {
        this.removeControl(airbnb_price_legend);
        this.removeControl(airbnb_cluster_legend);
        this.removeControl(airbnb_review_scores_rating_legend);
    } else if (eventLayer.name === 'Number of Listings') {
        this.removeControl(airbnb_price_legend);
        this.removeControl(airbnb_cluster_legend);
        this.removeControl(airbnb_review_scores_rating_legend);
    } else if (eventLayer.name === 'Cluster by Rating Categories and Price') {
        this.removeControl(airbnb_price_legend);
        this.removeControl(airbnb_cluster_legend);
        this.removeControl(airbnb_review_scores_rating_legend);
        airbnb_cluster_legend.addTo(this);
    }

});
