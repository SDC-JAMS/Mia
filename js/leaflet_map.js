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

var url_sentiment = "http://dev.spatialdatacapture.org:8707/data/sa_summary/";

// Add Guest Polarity Layer

$.getJSON(url_sentiment, function (json) {

    var guest_polarity_array = [];

     //  Covert the polygon feautures in WKT string from database to geoJSON object
    // https://gis.stackexchange.com/questions/162842/convert-wkt-to-geojson-with-leaflet

    var wkt = new Wkt.Wkt()

    json.forEach(function (layer) {

        wkt.read(layer.geometry)

        var feature = {
            type: 'Feature',
            properties: {
                'neighbourhood': layer.neighbourhood,
                'guestpolarity_mean': layer.guest_polarity_mean,
                'Link': layer.guest_link
            },

            geometry: wkt.toJson()

        };

        guest_polarity_array.push(feature);

    });

    var geoJSON = { type: 'FeatureCollection', features: guest_polarity_array };

    L.geoJSON(geoJSON, {
     
        onEachFeature: function (feature, layer) {

            var Initstyle = {
                fillColor: guest_polarity_getColor(feature.properties.guestpolarity_mean),
                weight: 2,
                opacity: 1,
                color: 'white',
                dashArray: '3',
                fillOpacity: 0.9
            }

            var img = '<img src="' + feature.properties.Link + '">';
            var popup = "<b>Location Description: </b>" + feature.properties.neighbourhood + "<br>" +
                "<b>Avg. Guest Polarity: </b>" + feature.properties.guestpolarity_mean.toFixed(2) + "<br>" +
                "<b>Word-Cloud: </b>" + img +  "</a>"


            layer.bindTooltip(popup),
            layer.on('mouseover', function () {
                this.setStyle({
                    color: 'red'   //for the boundary line when hover
                });
            });
            layer.on('mouseout', function () {
                this.setStyle(Initstyle)
            });

            guest_polarity.addLayer(layer)
        },

        style: function (feature) {
            return {
                fillColor: guest_polarity_getColor(feature.properties.guestpolarity_mean),
                weight: 2,
                opacity: 1,
                color: 'white',
                dashArray: '3',
                fillOpacity: 0.9
            }
        }

    })
})

var guest_polarity = L.layerGroup().addTo(map)

// Add host Polarity Layer

$.getJSON(url_sentiment, function (json) {

    var host_polarity_array = [];

    var wkt = new Wkt.Wkt()

    json.forEach(function (layer) {

        wkt.read(layer.geometry)

        var feature = {
            type: 'Feature',
            properties: {
                'neighbourhood': layer.neighbourhood,
                'hostpolarity_mean': layer.host_polarity_mean,
                'Link': layer.host_link
            },

            geometry: wkt.toJson()

        };

        host_polarity_array.push(feature);

    });

    var geoJSON = { type: 'FeatureCollection', features: host_polarity_array };

    L.geoJSON(geoJSON, {

        onEachFeature: function (feature, layer) {

            var Initstyle = {
                fillColor: host_polarity_getColor(feature.properties.hostpolarity_mean),
                weight: 2,
                opacity: 1,
                color: 'white',
                dashArray: '3',
                fillOpacity: 0.9
            }

            var img = '<img src="' + feature.properties.Link + '">';
            var popup = "<b>Location Description: </b>" + feature.properties.neighbourhood + "<br>" +
                "<b>Avg. Host Polarity: </b>" + feature.properties.hostpolarity_mean.toFixed(2) + "<br>" +
                "<b>Word-Cloud: </b>" + img + "</a>"


            layer.bindTooltip(popup),
                layer.on('mouseover', function () {
                    this.setStyle({
                        color: 'red'   //for the boundary line when hover
                    });
                });
            layer.on('mouseout', function () {
                this.setStyle(Initstyle)
            });

            host_polarity.addLayer(layer)
        },

        style: function (feature) {
            return {
                fillColor: host_polarity_getColor(feature.properties.hostpolarity_mean),
                weight: 2,
                opacity: 1,
                color: 'white',
                dashArray: '3',
                fillOpacity: 0.9
            }
        }

    })
})

var host_polarity = L.layerGroup()

// // Add Guest Subjectivity Layer

$.getJSON(url_sentiment, function (json) {

    var guest_subjectivity_array = [];

    var wkt = new Wkt.Wkt()

    json.forEach(function (layer) {

        wkt.read(layer.geometry)

        var feature = {
            type: 'Feature',
            properties: {
                'neighbourhood': layer.neighbourhood,
                'guestsubjectivity_mean': layer.guest_subjectivity_mean,
                'Link': layer.guest_link
            },

            geometry: wkt.toJson()

        };

        guest_subjectivity_array.push(feature);

    });

    var geoJSON = { type: 'FeatureCollection', features: guest_subjectivity_array };

    L.geoJSON(geoJSON, {

        onEachFeature: function (feature, layer) {

            var Initstyle = {
                fillColor: guest_subjectivity_getColor(feature.properties.guestsubjectivity_mean),
                weight: 2,
                opacity: 1,
                color: 'white',
                dashArray: '3',
                fillOpacity: 0.9
            }


            var img = '<img src="' + feature.properties.Link + '">';
            var popup = "<b>Location Description: </b>" + feature.properties.neighbourhood + "<br>" +
                "<b>Avg. Guest Subjectivity: </b>" + feature.properties.guestsubjectivity_mean.toFixed(2) + "<br>" +
                "<b>Word-Cloud: </b>" + img + "</a>"

            layer.bindTooltip(popup),
                layer.on('mouseover', function () {
                    this.setStyle({
                        color: 'red'   //for the boundary line when hover
                    });
                });
                layer.on('mouseout', function () {
                    this.setStyle(Initstyle)
                });

            guest_subjectivity.addLayer(layer)
        },

        style: function (feature) {
            return {
                fillColor: guest_subjectivity_getColor(feature.properties.guestsubjectivity_mean),
                weight: 2,
                opacity: 1,
                color: 'white',
                dashArray: '3',
                fillOpacity: 0.9
            }
        }

    })
})

var guest_subjectivity = L.layerGroup()

// Add host Subjectivity Layer

$.getJSON(url_sentiment, function (json) {

    var host_subjectivity_array = [];

    var wkt = new Wkt.Wkt()

    json.forEach(function (layer) {

        wkt.read(layer.geometry)

        var feature = {
            type: 'Feature',
            properties: {
                'neighbourhood': layer.neighbourhood,
                'hostsubjectivity_mean': layer.host_subjectivity_mean,
                'Link': layer.host_link
            },

            geometry: wkt.toJson()

        };

        host_subjectivity_array.push(feature);

    });

    var geoJSON = { type: 'FeatureCollection', features: host_subjectivity_array };

    L.geoJSON(geoJSON, {

        onEachFeature: function (feature, layer) {

            var Initstyle = {
                fillColor: host_subjectivity_getColor(feature.properties.hostsubjectivity_mean),
                weight: 2,
                opacity: 1,
                color: 'white',
                dashArray: '3',
                fillOpacity: 0.9
            }

            var img = '<img src="' + feature.properties.Link + '">';
            var popup = "<b>Location Description: </b>" + feature.properties.neighbourhood + "<br>" +
                "<b>Avg. Host Subjectivity: </b>" + feature.properties.hostsubjectivity_mean.toFixed(2) + "<br>" +
                "<b>Word-Cloud: </b>" + img + "</a>"

            layer.bindTooltip(popup),
            layer.on('mouseover', function () {
                    this.setStyle({
                        color: 'red'   //for the boundary line when hover
                    });
            });
            layer.on('mouseout', function () {
                this.setStyle(Initstyle)
            });

            host_subjectivity.addLayer(layer)
        },

        style: function (feature) {
            return {
                fillColor: host_subjectivity_getColor(feature.properties.hostsubjectivity_mean),
                weight: 2,
                opacity: 1,
                color: 'white',
                dashArray: '3',
                fillOpacity: 0.9
            }
        }

    })
})

var host_subjectivity = L.layerGroup()

// Legend for differnt layer

function guest_polarity_getColor(d) {
    return d > 0.415 ? '#000000' :
           d > 0.390 ? '#132639' :
           d > 0.365 ? '#204060' :
           d > 0.340 ? '#336699' :
           d > 0.315 ? '#3973AC' :
           d > 0.290 ? '#4080BF' :
           d > 0.265 ? '#538CC6' :
           d > 0.240 ? '#6699CC' :
           d > 0.215 ? '#79A6D2' :
           d > 0.190 ? '#8CB3D9':
           d > 0.165 ? '#B3CCE6' :
                        '#ECF2F9';
}

function host_polarity_getColor(d) {
    return d > 0.415 ? '#000000' :
           d > 0.390 ? '#132639' :
           d > 0.365 ? '#204060' :
           d > 0.340 ? '#336699' :
           d > 0.315 ? '#3973AC' :
           d > 0.290 ? '#4080BF' :
           d > 0.265 ? '#538CC6' :
           d > 0.240 ? '#6699CC' :
           d > 0.215 ? '#79A6D2' :
           d > 0.190 ? '#8CB3D9':
           d > 0.165 ? '#B3CCE6' :
                        '#ECF2F9';
}

function guest_subjectivity_getColor(d) {
    return d > 0.575 ? '#2E2E1F' :
           d > 0.550 ? '#4D4D33'  :
           d > 0.525 ? '#6B6B47' :
           d > 0.500 ? '#8A8A5C' :
           d > 0.475 ? '#999966' :
           d > 0.450 ? '#ADAD85' :
           d > 0.425 ? '#C2C2A3' :
           d > 0.400 ? '#CCCCB3' :
           d > 0.375 ? '#D6D6C2' :
           d > 0.350 ? '#E0E0D1':
           d > 0.325 ? '#EBEBE0' :
                        '#F5F5F0';
}

function host_subjectivity_getColor(d) {
    return d > 0.575 ? '#2E2E1F' :
           d > 0.550 ? '#4D4D33'  :
           d > 0.525 ? '#6B6B47' :
           d > 0.500 ? '#8A8A5C' :
           d > 0.475 ? '#999966' :
           d > 0.450 ? '#ADAD85' :
           d > 0.425 ? '#C2C2A3' :
           d > 0.400 ? '#CCCCB3' :
           d > 0.375 ? '#D6D6C2' :
           d > 0.350 ? '#E0E0D1':
           d > 0.325 ? '#EBEBE0' :
                        '#F5F5F0';
}

// lenend Position

var guest_polarity_legend = L.control({ position: 'bottomright' });
var guest_subjectivity_legend = L.control({ position: 'bottomright' });
var host_polarity_legend = L.control({ position: 'bottomright' });
var host_subjectivity_legend = L.control({ position: 'bottomright' });

// lenend of Guest_Polarity ColourMap

guest_polarity_legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0.165, 0.190, 0.215, 0.240, 0.265, 0.290, 0.315, 0.340, 0.365, 0.390, 0.415],
        labels = ['<strong>Average Polarity Score</strong>'];

    for (var i = 0; i < grades.length; i++) {
        from = grades[i];
        to = grades[i + 1];

        labels.push(
            '<i style="background:' + guest_polarity_getColor(from + 0.01) + '"></i> ' +
            from + (to ? '&ndash;' + to + '<br>' : '+'));
    }

    div.innerHTML = labels.join('<br>');
    return div;
};

guest_polarity_legend.addTo(map);

host_polarity_legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0.165, 0.190, 0.215, 0.240, 0.265, 0.290, 0.315, 0.340, 0.365, 0.390, 0.415],
        labels = ['<strong>Average Polarity Score</strong>'];

    for (var i = 0; i < grades.length; i++) {
        from = grades[i];
        to = grades[i + 1];

        labels.push(
            '<i style="background:' + host_polarity_getColor(from + 0.01) + '"></i> ' +
            from + (to ? '&ndash;' + to + '<br>' : '+'));
    }

    div.innerHTML = labels.join('<br>');
    return div;
};

// lenend of Guest_Subjectivity ColourMap

guest_subjectivity_legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0.325, 0.350, 0.375, 0.400, 0.425, 0.450, 0.475, 0.500, 0.525, 0.550, 0.575],
        labels = ['<strong>Average Subjectivity Score</strong>'];

    for (var i = 0; i < grades.length; i++) {
        from = grades[i];
        to = grades[i + 1];

        labels.push(
            '<i style="background:' + guest_subjectivity_getColor(from + 0.01) + '"></i> ' +
            from + (to ? '&ndash;' + to + '<br>' : '+'));
    }

    div.innerHTML = labels.join('<br>');
    return div;
};


host_subjectivity_legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0.325, 0.350, 0.375, 0.400, 0.425, 0.450, 0.475, 0.500, 0.525, 0.550, 0.575],
        labels = ['<strong>Average Subjectivity Score</strong>'];

    for (var i = 0; i < grades.length; i++) {
        from = grades[i];
        to = grades[i + 1];

    labels.push(
        '<i style="background:' + host_subjectivity_getColor(from + 0.01) + '"></i> ' +
        from + (to ? '&ndash;' + to + '<br>': '+'));
    }

    div.innerHTML = labels.join('<br>');
    return div;
};

// Text Box

L.Control.textbox = L.Control.extend({
    onAdd: function (map) {

        var text = L.DomUtil.create('div');
        text.id = "info_text";
        text.innerHTML = "<strong>JAMS.</strong>"
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
    "Avg. Guest Polarity": guest_polarity,
    "Avg. Host Polarity": host_polarity,
    "Avg. Guest Subjectivity": guest_subjectivity,
    "Avg. Host Subjectivity": host_subjectivity,
};

var overlayMaps = {

};

var layerControl = L.control.layers(baseMaps, overlayMaps, { collapsed: false }).addTo(map);

// Control the legend
map.on('baselayerchange', function (eventLayer) {

    if (eventLayer.name === 'Avg. Guest Polarity') { 
        this.removeControl(guest_subjectivity_legend);
        this.removeControl(host_polarity_legend);
        this.removeControl(host_subjectivity_legend);
        guest_polarity_legend.addTo(this);
    } else if (eventLayer.name === 'Avg. Guest Subjectivity') {
        this.removeControl(guest_polarity_legend);
        this.removeControl(host_polarity_legend);
        this.removeControl(host_subjectivity_legend);
        guest_subjectivity_legend.addTo(this);
    } else if (eventLayer.name === 'Avg. Host Polarity') {
        host_polarity_legend.addTo(this); 
        this.removeControl(guest_polarity_legend);
        this.removeControl(guest_subjectivity_legend);
        this.removeControl(host_subjectivity_legend);
    } else if (eventLayer.name === 'Avg. Host Subjectivity') {
        host_subjectivity_legend.addTo(this);
        this.removeControl(guest_subjectivity_legend);
        this.removeControl(guest_polarity_legend);
        this.removeControl(host_polarity_legend);
    }
});
