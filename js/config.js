define([
    // Need to delcare Extent here for Firefox to work
    'esri/geometry/Extent', 
    'esri/dijit/InfoWindow',
    'esri/symbols/SimpleFillSymbol',
    'esri/Color',
    'esri/dijit/Popup',    

    'dojo/dom-construct',
], function(Extent, InfoWindow, SimpleFillSymbol, Color, Popup, domConstruct) {
    var fill = new SimpleFillSymbol("solid", null, new Color("#A4CE67"));
    var popup = new Popup({
            fillSymbol: fill,
            titleInBody: false
        }, domConstruct.create("div"));    
    var extent = new esri.geometry.Extent({
        'xmin': -9813000,
        'ymin': 4920000,
        'xmax': -9350000,
        'ymax': 5950000,
        'spatialReference': {
            'wkid': 102100
        }
    });
    return {
        map: {
            options: {
                basemap: 'gray',
                extent: extent,
                logo:false,
                infoWindow: popup
            },
            // TODO: add basemaps
            basemaps: {}
        },
        legend: {
            moreInfoUrl: 'https://github.com/Esri/dojo-bootstrap-map-js'
        },
        about: {
            moreInfoUrl: 'http://www.iisgcp.org'
        }
    };
});