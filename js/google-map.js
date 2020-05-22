// JavaScript source code

//  set Leaflet
var map = L.mapbox.map('mapid', 'mapbox.streets', {
    accessToken: '<pk.eyJ1IjoibWlhZGliZSIsImEiOiJjazVwOWw3ZXowdDhjM2xuc3U3cGN3NGxwIn0.aYf9qdTxNVl9igxiN-NnIA>'
})
    .setView([51.514756, -0.10345], 11);


L.tileLayer('https://api.mapbox.com/styles/v1/miadibe/ckaffoouw0d1y1il9m090hc52/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoibWlhZGliZSIsImEiOiJjazVwOWw3ZXowdDhjM2xuc3U3cGN3NGxwIn0.aYf9qdTxNVl9igxiN-NnIA', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
        '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery � <a href="http://mapbox.com">Mapbox</a>',

}).addTo(map);


//get data from API

var url = "http://dev.spatialdatacapture.org:8707/data/pubs_yelp";

var geojsonmysql = [];


$.getJSON(url, function (data) {
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

    var dummy = { type: 'FeatureCollection', features: geojsonmysql };

    //Marker Style

    var geojsonMarkerOptions = {
        radius: 3,
        fillColor: "#6dff33",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    };

    L.geoJson(dummy, {
        onEachFeature: function (feature, layer) {
            pointlayer.addLayer(layer)
            // some other code can go here, like adding a popup with layer.bindPopup("Hello")
        },
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, geojsonMarkerOptions);
        }
    }).addTo(map);
});

var pointlayer = L.layerGroup().addTo(map)

// Add Guest Polarity Layer

$.getJSON('./geojson/guest_polarity.geojson', function (json) {
    L.geoJSON(json, {

        onEachFeature: function (feature, layer) {

            var Initstyle = {
                fillColor: guest_polarity_getColor(feature.properties.guestpolarity_mean),
                weight: 2,
                opacity: 1,
                color: 'white',
                dashArray: '3',
                fillOpacity: 0.7
            }

/*            var popup = 'Borough:' + feature.properties.neighbourhood + '<p>' + 'Price:' + Math.floor(feature.properties.airbnb_price_price) + ' pounds' + '</p>'*/
            var icon_url = '<img src="http://dev.spatialdatacapture.org/~ucfnyle/s.jpg" height="150px" width="150px"/>';
            var popup = "<b>Location Description: </b>" + feature.properties.neighbourhood + "<br>" +
                "<b>Avg. Guest Polarity: </b>" + feature.properties.guestpolarity_mean.toFixed(2) + "<br>" +
/*                                "<b>Graffiti Type: </b>" + entry[5] + "<br>" +
                                "<b>Graffiti Material: </b>" + entry[6] + "<br>" +*/
                "<b>Image: </b><a href='" + 'http://www.google.com' + "' target=\"_blank\">" + icon_url +  "</a>"


        /*  layer.bindPopup('Borough:' + feature.properties.neighbourhood + '<p>' + 'Price:' + Math.floor(feature.properties.airbnb_price_price) + 'pounds' + '</p>'),*/
            layer.bindTooltip(popup),
            layer.on('mouseover', function () {
                this.setStyle({
                    color: 'red'   //or whatever style you wish to use;
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
                fillOpacity: 0.7
            }
        }

    })
})

var guest_polarity = L.layerGroup().addTo(map)


// // Add Guest Subjectivity Layer

$.getJSON('./geojson/guest_subjectivity.geojson', function (json) {
    L.geoJSON(json, {

        onEachFeature: function (feature, layer) {

            var Initstyle = {
                fillColor: guest_subjectivity_getColor(feature.properties.guestsubjectivity_mean),
                weight: 2,
                opacity: 1,
                color: 'white',
                dashArray: '3',
                fillOpacity: 0.7
            }

            /*            var popup = 'Borough:' + feature.properties.neighbourhood + '<p>' + 'Price:' + Math.floor(feature.properties.airbnb_price_price) + ' pounds' + '</p>'*/
            var icon_url = '<img src="http://dev.spatialdatacapture.org/~ucfnyle/SD.png">';
            var popup = "<b>Location Description: </b>" + feature.properties.neighbourhood + "<br>" +
                "<b>Avg. Guest Subjectivity: </b>" + feature.properties.guestsubjectivity_mean.toFixed(2) + "<br>" +
                /*                                "<b>Graffiti Type: </b>" + entry[5] + "<br>" +
                                                "<b>Graffiti Material: </b>" + entry[6] + "<br>" +*/
                "<b>Image: </b><a href='" + 'http://www.google.com' + "' target=\"_blank\">" + icon_url + "</a>"


            /*  layer.bindPopup('Borough:' + feature.properties.neighbourhood + '<p>' + 'Price:' + Math.floor(feature.properties.airbnb_price_price) + 'pounds' + '</p>'),*/
            layer.bindTooltip(popup),
                layer.on('mouseover', function () {
                    this.setStyle({
                        color: 'red'   //or whatever style you wish to use;
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
                fillOpacity: 0.7
            }
        }

    })
})

var guest_subjectivity = L.layerGroup().addTo(map)

// Add host Polarity Layer

$.getJSON('./geojson/host_polarity.geojson', function (json) {
    L.geoJSON(json, {

        onEachFeature: function (feature, layer) {

            var Initstyle = {
                fillColor: host_polarity_getColor(feature.properties.hostpolarity_mean),
                weight: 2,
                opacity: 1,
                color: 'white',
                dashArray: '3',
                fillOpacity: 0.7
            }

            /*            var popup = 'Borough:' + feature.properties.neighbourhood + '<p>' + 'Price:' + Math.floor(feature.properties.airbnb_price_price) + ' pounds' + '</p>'*/
            var icon_url = '<img src="http://dev.spatialdatacapture.org/~ucfnyle/s.jpg" height="150px" width="150px"/>';
            var popup = "<b>Location Description: </b>" + feature.properties.neighbourhood + "<br>" +
                "<b>Avg. Host Polarity: </b>" + feature.properties.hostpolarity_mean.toFixed(2) + "<br>" +
                /*                                "<b>Graffiti Type: </b>" + entry[5] + "<br>" +
                                                "<b>Graffiti Material: </b>" + entry[6] + "<br>" +*/
                "<b>Image: </b><a href='" + 'http://www.google.com' + "' target=\"_blank\">" + icon_url + "</a>"


            /*  layer.bindPopup('Borough:' + feature.properties.neighbourhood + '<p>' + 'Price:' + Math.floor(feature.properties.airbnb_price_price) + 'pounds' + '</p>'),*/
            layer.bindTooltip(popup),
                layer.on('mouseover', function () {
                    this.setStyle({
                        color: 'red'   //or whatever style you wish to use;
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
                fillOpacity: 0.7
            }
        }

    })
})

var host_polarity = L.layerGroup().addTo(map)

// Add host Subjectivity Layer

$.getJSON('./geojson/host_subjectivity.geojson', function (json) {
    L.geoJSON(json, {

        onEachFeature: function (feature, layer) {

            var Initstyle = {
                fillColor: host_subjectivity_getColor(feature.properties.hostsubjectivity_mean),
                weight: 2,
                opacity: 1,
                color: 'white',
                dashArray: '3',
                fillOpacity: 0.7
            }

            /*            var popup = 'Borough:' + feature.properties.neighbourhood + '<p>' + 'Price:' + Math.floor(feature.properties.airbnb_price_price) + ' pounds' + '</p>'*/
            var icon_url = '<img src="http://dev.spatialdatacapture.org/~ucfnyle/s.jpg" height="150px" width="150px"/>';
            var popup = "<b>Location Description: </b>" + feature.properties.neighbourhood + "<br>" +
                "<b>Avg. Host Subjectivity: </b>" + feature.properties.hostsubjectivity_mean.toFixed(2) + "<br>" +
                /*                                "<b>Graffiti Type: </b>" + entry[5] + "<br>" +
                                                "<b>Graffiti Material: </b>" + entry[6] + "<br>" +*/
                "<b>Image: </b><a href='" + 'http://www.google.com' + "' target=\"_blank\">" + icon_url + "</a>"


            /*  layer.bindPopup('Borough:' + feature.properties.neighbourhood + '<p>' + 'Price:' + Math.floor(feature.properties.airbnb_price_price) + 'pounds' + '</p>'),*/
            layer.bindTooltip(popup),
            layer.on('mouseover', function () {
                    this.setStyle({
                        color: 'red'   //or whatever style you wish to use;
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
                fillOpacity: 0.7
            }
        }

    })
})

var host_subjectivity = L.layerGroup().addTo(map)

// Lengend for differnt layer


//MIA: just change this part of code , the value after d is the interval, and you need to add one more level as each parameter should with 6 level
function guest_polarity_getColor(d) {
    return d > 0.41 ? '#E31A1C' :
           d > 0.39  ? '#FC4E2A'  :
           d > 0.37   ? '#FD8D3C'  :
           d > 0.35   ? '#FEB24C' :
           d > 0.33   ? '#FED976' :
                        '#FFEDA0';
}
//MIA: just change this part of code , the value after d is the interval, and you need to add one more level as each parameter should with 6 level
function guest_subjectivity_getColor(d) {
    return d > 0.61 ? '#E31A1C' :
           d > 0.59  ? '#FC4E2A'  :
           d > 0.57   ? '#FD8D3C'  :
           d > 0.55   ? '#FEB24C' :
           d > 0.53   ? '#FED976' :
                        '#FFEDA0';
}
//MIA: just change this part of code , the value after d is the interval, and you need to add one more level as each parameter should with 6 level
function host_polarity_getColor(d) {
    return d > 0.22 ? '#E31A1C' :
           d > 0.20  ? '#FC4E2A'  :
           d > 0.18   ? '#FD8D3C'  :
           d > 0.16   ? '#FEB24C' :
           d > 0.14   ? '#FED976' :
                        '#FFEDA0';
}

//MIA: just change this part of code , the value after d is the interval, and you need to add one more level as each parameter should with 6 level
function host_subjectivity_getColor(d) {
    return d > 0.40 ? '#E31A1C' :
           d > 0.38  ? '#FC4E2A'  :
           d > 0.36   ? '#FD8D3C'  :
           d > 0.34   ? '#FEB24C' :
           d > 0.32   ? '#FED976' :
                        '#FFEDA0';
}

// lenend Position

var guest_polarity_legend = L.control({ position: 'bottomright' });
var guest_subjectivity_legend = L.control({ position: 'bottomright' });
var host_polarity_legend = L.control({ position: 'bottomright' });
var host_subjectivity_legend = L.control({ position: 'bottomright' });

// lenend of Guest_Polarity ColourMap

guest_polarity_legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0.33, 0.35, 0.37, 0.39, 0.41], //MIA: please also just change this part of code if you change the interval for consistency as above
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + guest_polarity_getColor(grades[i] + 0.01) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

// lenend of Guest_Subjectivity ColourMap

guest_subjectivity_legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0.53, 0.55, 0.57, 0.59, 0.61], //MIA: please also just change this part of code if you change the interval for consistency as above
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + guest_subjectivity_getColor(grades[i] + 0.01) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};


host_polarity_legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0.14, 0.16, 0.18, 0.20, 0.22], //MIA: please also just change this part of code if you change the interval for consistency as above
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + host_polarity_getColor(grades[i] + 0.01) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

host_subjectivity_legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0.32, 0.34, 0.36, 0.38, 0.40], //MIA: please also just change this part of code if you change the interval for consistency as above
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + host_subjectivity_getColor(grades[i] + 0.01) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};


// Add Experience Layer

$.getJSON('./geojson/experience.geojson', function (json) {
    L.geoJSON(json, {

        onEachFeature: function (feature, layer) {


/*            // Create div with class name highchart
            var div = L.DomUtil.create('div', 'highchart');

            // Bind popup to layer with div as content
            layer.bindPopup(div);

            // Handle event when popup opens
            layer.on('popupopen', function (e) {

                var area = [];
                business = [];
                social = [];
                family = [];
                romantic = [];

                area.push(feature.properties.neighbourhood)
                business.push(feature.properties.exp_business)
                family.push(feature.properties.exp_family)
                romantic.push(feature.properties.exp_romantic)


*//*                for (var i = 0; i < data.length; i++) {
                    var obj = data[i];
                    area_name.push(obj.area_name);
                    series2004.push(obj.Y2004);
                    series2005.push(obj.Y2005);
                    series2006.push(obj.Y2006);
                    series2007.push(obj.Y2007);
                }
                console.log(feature.properties.neighbourhood)*/


/*                console.log(e.target);  // layer object
                console.log(e.target.feature); // layer's feature object
                console.log(e.popup); // popup object
                console.log(e.popup.getContent()); // the div*//*

                // Now do the highcharts stuff

                var chartplotoptions = {

                    chart: {
                        type: 'bar'
                    },
                    title: {
                        text: 'Experience by Borough'
                    },
                    subtitle: {
                        text: 'Testing'
                    },
                    xAxis: {
                        categories: [feature.properties.neighbourhood],
                        title: {
                            text: null
                        }
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: 'Review',
                            align: 'high'
                        },
                        labels: {
                            overflow: 'justify'
                        }
                    },
                    tooltip: {
                        valueSuffix: ' millions'
                    },
                    plotOptions: {
                        bar: {
                            dataLabels: {
                                enabled: true
                            }
                        }
                    },
                    legend: {
                        layout: 'vertical',
                        align: 'right',
                        verticalAlign: 'top',
                        x: -40,
                        y: 80,
                        floating: true,
                        borderWidth: 1,
                        backgroundColor:
                            Highcharts.defaultOptions.legend.backgroundColor || '#FFFFFF',
                        shadow: true
                    },
                    credits: {
                        enabled: false
                    },
                    series: [{
                        name: 'Business',
                        data: [feature.properties.exp_business]
                    }, {
                        name: 'Social',
                        data: [feature.properties.exp_social]
                    }, {
                        name: 'Family',
                        data: [feature.properties.exp_family]
                    }, {
                        name: 'Romantic',
                        data: [feature.properties.exp_romantic]
                    }]
                };

                Highcharts.chart(e.popup.getContent(), {
                    chartplotoptions

                });

            });*/


            experience.addLayer(layer)
        },

        style: function (feature) {
            return {
                fillColor: host_polarity_getColor(feature.properties.exp_business), // change
                weight: 2,
                opacity: 1,
                color: 'white',
                dashArray: '3',
                fillOpacity: 0.7
            }
        }

    })
})

var experience = L.layerGroup().addTo(map)

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

// Control layer

var baseMaps = {
    "Avg. Guest Polarity": guest_polarity,
    "Avg. Guest Subjectivity": guest_subjectivity,
    "Avg. Host Polarity": host_polarity,
    "Avg. Host Subjectivity": host_subjectivity,
    "Experience": experience

/*    "Income" : income*/
};

var overlayMaps = {
    "Location": pointlayer
/*    "Restaurant" : */
};

L.control.layers(baseMaps, overlayMaps, { collapsed: false }).addTo(map);

map.on('baselayerchange', function (eventLayer) {
    // Switch to the Population legend...
    if (eventLayer.name === 'Avg. Guest Polarity') { // Or switch to the Population Change legend...
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
