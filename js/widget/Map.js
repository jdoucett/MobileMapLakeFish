define([
    'dojo/_base/declare',
    'dojo/_base/array',
    'dojo/dom',

    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/layout/ContentPane',

    'esri/map',
    'esri/layers/FeatureLayer',    
    'esri/dijit/PopupTemplate',
    'esri/dijit/Scalebar',
    'esri/layers/ArcGISDynamicMapServiceLayer',
    'esri/layers/WebTiledLayer',
    'esri/dijit/LocateButton',
    'esri/dijit/Geocoder',
    'esri/layers/ImageParameters',
    'esri/geometry/Extent',
    'esri/SpatialReference',
    'esri/dijit/Legend',
    'esri/dijit/TimeSlider',
    'esri/TimeExtent',

    'bootstrap-map-js/bootstrapmap',

    'dojo/text!./templates/Map.html',
    'dojo/dom-construct',
    'dojo/domReady!'
], function(declare, array, dom,
    _WidgetBase, _TemplatedMixin, ContentPane,
    Map, Featurelayer, PopupTemplate, Scalebar, ArcGISDynamicMapServiceLayer, WebTiledLayer, LocateButton, Geocoder, ImageParameters, Extent, SpatialReference, Legend, TimeSlider, TimeExtent,
    BootstrapMap,
    template,domConstruct) {

    //Default values for drop down lists defined in app.js
    var legendDijit;
    var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];    
    var timeYear = "1993";
    var imageParameters = new ImageParameters();
    imageParameters.format = "PNG24"; //set the image type to PNG24, note default is PNG8.            
    
    //set info template parameters as global  
    var iTemplate = new PopupTemplate;

    //Defines dynamic layer for showing fish data.  Used in setFishmap and _initMap functions
    var decadeCatchDataLayer = new ArcGISDynamicMapServiceLayer('http://prodgis2.agriculture.purdue.edu/arcgis/rest/services/IISGLakeMI/Decade_Catch_Data_LakeMI/MapServer', {
        'opacity': .90,
        imageParameters: imageParameters,
    });

    var visibleDataLayerIds = [1,11];
    decadeCatchDataLayer.setVisibleLayers(visibleDataLayerIds);


    return declare([_WidgetBase, _TemplatedMixin], {
        templateString: template,
        map: this.map,
        postCreate: function() {
            this.inherited(arguments);
            this._initMap();
            this.updateFishmap(dateText, fishText, summaryText);
        },            

        legendCreate: function() { //add the legend
            console.log('initializing legend');
            legendDijit = new Legend({
                map: this.map,
                layerInfos: [{
                    layer: decadeCatchDataLayer,
                    title: 'Fish Catch'
                // }][{
                //     layer: decadeCatchBaseLayer,
                //     title: 'Fish Catch'
                }]
            }, 'legendDiv');
            legendDijit.startup();
        },

        legendRefresh: function() {
            dom.byId('legendDiv').innerHTML = '';
            legendDijit.refresh([{
                layer: decadeCatchDataLayer,
                title: 'Fish Catch'
            }]);
        },


        initSlider: function() {
            console.log('Initializaing time slider');
            
            if (dijit.byId('timeSlider')) {
              dijit.byId('timeSlider').destroy();
            }
            var tsDiv = dojo.create("div", null, dojo.byId('timeSliderDiv'));
                      
            var timeSlider = new TimeSlider({
                    style: 'width: 100%;',
                    id:'timeSlider'
                }, tsDiv);
            this.map.setTimeSlider(timeSlider);

              var timeExtent = new TimeExtent();
              timeExtent.startTime = new Date('00:00:00 05/01/' + timeYear + ' GMT-0400');
              timeExtent.endTime = new Date('00:00:00 09/01/' + timeYear + ' GMT-0400');
              console.log ('Start Time ' + timeExtent.startTime);
              console.log ('End Time ' + timeExtent.endTime);
              timeSlider.setThumbCount(2);
               timeSlider.setThumbIndexes([0,0]);
              timeSlider.createTimeStopsByTimeInterval(timeExtent, 1, 'esriTimeUnitsMonths');
              timeSlider.setThumbMovingRate(1500);
              timeSlider.startup();
              timeSlider.on("time-extent-change", function(evt) {
                var startValString = evt.startTime.getUTCMonth();
                var endValString = evt.endTime.getUTCMonth();
                console.log ('start month ' + startValString + ' and end month is ' + endValString);
              });
              var labels = dojo.map(timeSlider.timeStops, function(timeStop) {
                return monthNames[timeStop.getUTCMonth()];
                });
              timeSlider.setLabels(labels);

        },

        setFishmap: function(dateText, fishText, summaryText) {
            console.log('ran setFishmap' + dateText + ' , ' + fishText + ' , ' + summaryText);
            var map = this.map;
            var l, options;
            if (dateText == '1993 - 2002') {
                timeYear = '1993';
                if (fishText == 'Rainbow Trout') {
                    if (summaryText == 'Catch per Trip') {
                        visibleDataLayerIds = [1,12];
                        decadeCatchDataLayer.setVisibleLayers(visibleDataLayerIds);
                    } else if (summaryText == 'Catch per Angler Hour') {
                        visibleDataLayerIds = [1,15];
                        decadeCatchDataLayer.setVisibleLayers(visibleDataLayerIds);
                    } else if (summaryText == 'Catch Total') {
                        visibleDataLayerIds = [1,18];
                        decadeCatchDataLayer.setVisibleLayers(visibleDataLayerIds);
                    } else {
                        console.log('Decade 93 - 02, Rainbow Trout, no CPUE match');
                    }
                } else if (fishText == 'Lake Trout') {
                    if (summaryText == 'Catch per Trip') {
                        visibleDataLayerIds = [1,22];
                        decadeCatchDataLayer.setVisibleLayers(visibleDataLayerIds);
                    } else if (summaryText == 'Catch per Angler Hour') {
                        visibleDataLayerIds = [1,25];
                        decadeCatchDataLayer.setVisibleLayers(visibleDataLayerIds);
                    } else if (summaryText == 'Catch Total') {
                        visibleDataLayerIds = [1,28];
                        decadeCatchDataLayer.setVisibleLayers(visibleDataLayerIds);
                    } else {
                        console.log('Decade 93 - 02, Lake Trout, no CPUE match');
                    }
                } else if (fishText == 'Chinook Salmon') {
                    if (summaryText == 'Catch per Trip') {
                        visibleDataLayerIds = [1,32];
                        decadeCatchDataLayer.setVisibleLayers(visibleDataLayerIds);
                    } else if (summaryText == 'Catch per Angler Hour') {
                        visibleDataLayerIds = [1,35];
                        decadeCatchDataLayer.setVisibleLayers(visibleDataLayerIds);
                    } else if (summaryText == 'Catch Total') {
                        visibleDataLayerIds = [1,38];
                        decadeCatchDataLayer.setVisibleLayers(visibleDataLayerIds);
                    } else {
                        console.log('Decade 93 - 02, Chinook Salmon, no CPUE match');
                    }
                } else if (fishText == 'Brown Trout') {
                    if (summaryText == 'Catch per Trip') {
                        visibleDataLayerIds = [1,42];
                        decadeCatchDataLayer.setVisibleLayers(visibleDataLayerIds);
                    } else if (summaryText == 'Catch per Angler Hour') {
                        visibleDataLayerIds = [1,45];
                        decadeCatchDataLayer.setVisibleLayers(visibleDataLayerIds);
                    } else if (summaryText == 'Catch Total') {
                        visibleDataLayerIds = [1,48];
                        decadeCatchDataLayer.setVisibleLayers(visibleDataLayerIds);
                    } else {
                        console.log('Decade 93 - 02, Brown Trout, no CPUE match');
                    }
                } else if (fishText == 'Coho Salmon') {
                    if (summaryText == 'Catch per Trip') {
                        visibleDataLayerIds = [1,52];
                        decadeCatchDataLayer.setVisibleLayers(visibleDataLayerIds);
                    } else if (summaryText == 'Catch per Angler Hour') {
                        visibleDataLayerIds = [1,55];
                        decadeCatchDataLayer.setVisibleLayers(visibleDataLayerIds);
                    } else if (summaryText == 'Catch Total') {
                        visibleDataLayerIds = [1,58];
                        decadeCatchDataLayer.setVisibleLayers(visibleDataLayerIds);
                    } else {
                        console.log('Decade 93 - 02, Coho Salmon, no CPUE match');
                    }
                } else {
                    console.log('Decade 93 - 02, no fish match');
                }
            } else if (dateText == '2003 - 2012') {
                timeYear = '2003';                
                if (fishText == 'Rainbow Trout') {
                    if (summaryText == 'Catch per Trip') {
                        visibleDataLayerIds = [1,11];
                        decadeCatchDataLayer.setVisibleLayers(visibleDataLayerIds);
                    } else if (summaryText == 'Catch per Angler Hour') {
                        visibleDataLayerIds = [1,14];
                        decadeCatchDataLayer.setVisibleLayers(visibleDataLayerIds);
                    } else if (summaryText == 'Catch Total') {
                        visibleDataLayerIds = [1,17];
                        decadeCatchDataLayer.setVisibleLayers(visibleDataLayerIds);
                    } else {
                        console.log('Decade 03 - 12, Rainbow Trout, no CPUE match');
                    }
                } else if (fishText == 'Lake Trout') {
                    if (summaryText == 'Catch per Trip') {
                        visibleDataLayerIds = [1,21];
                        decadeCatchDataLayer.setVisibleLayers(visibleDataLayerIds);
                    } else if (summaryText == 'Catch per Angler Hour') {
                        visibleDataLayerIds = [1,24];
                        decadeCatchDataLayer.setVisibleLayers(visibleDataLayerIds);
                    } else if (summaryText == 'Catch Total') {
                        visibleDataLayerIds = [1,27];
                        decadeCatchDataLayer.setVisibleLayers(visibleDataLayerIds);
                    } else {
                        console.log('Decade 03 - 12, Lake Trout, no CPUE match');
                    }
                } else if (fishText == 'Chinook Salmon') {
                    if (summaryText == 'Catch per Trip') {
                        visibleDataLayerIds = [1,31];
                        decadeCatchDataLayer.setVisibleLayers(visibleDataLayerIds);
                    } else if (summaryText == 'Catch per Angler Hour') {
                        visibleDataLayerIds = [1,34];
                        decadeCatchDataLayer.setVisibleLayers(visibleDataLayerIds);
                    } else if (summaryText == 'Catch Total') {
                        visibleDataLayerIds = [1,37];
                        decadeCatchDataLayer.setVisibleLayers(visibleDataLayerIds);
                    } else {
                        console.log('Decade 03 - 12, Chinook Salmon, no CPUE match');
                    }
                } else if (fishText == 'Brown Trout') {
                    if (summaryText == 'Catch per Trip') {
                        visibleDataLayerIds = [1,41];
                        decadeCatchDataLayer.setVisibleLayers(visibleDataLayerIds);
                    } else if (summaryText == 'Catch per Angler Hour') {
                        visibleDataLayerIds = [1,44];
                        decadeCatchDataLayer.setVisibleLayers(visibleDataLayerIds);
                    } else if (summaryText == 'Catch Total') {
                        visibleDataLayerIds = [1,47];
                        decadeCatchDataLayer.setVisibleLayers(visibleDataLayerIds);
                    } else {
                        console.log('Decade 03 - 12, Brown Trout, no CPUE match');
                    }
                } else if (fishText == 'Coho Salmon') {
                    if (summaryText == 'Catch per Trip') {
                        visibleDataLayerIds = [1,51];
                        decadeCatchDataLayer.setVisibleLayers(visibleDataLayerIds);
                    } else if (summaryText == 'Catch per Angler Hour') {
                        visibleDataLayerIds = [1,54];
                        decadeCatchDataLayer.setVisibleLayers(visibleDataLayerIds);
                    } else if (summaryText == 'Catch Total') {
                        visibleDataLayerIds = [1,57];
                        decadeCatchDataLayer.setVisibleLayers(visibleDataLayerIds);
                    } else {
                        console.log('Decade 03 - 12, Coho Salmon, no CPUE match');
                    }
                } else {
                    console.log('Decade 03 - 12, no fish match');
                }
            } else {
                console.log('No Decade Match');
            }
        },

        _initMap: function() {
            this.map = BootstrapMap.create(this.mapNode, this.config.map.options);
            this.scalebar = new Scalebar({
                map: this.map,
                scalebarUnit: 'dual'
            });
            this.geoLocate = new LocateButton({
                map: this.map,
                'class': 'locate-button'
            }, this.locateNode);
            this.geoLocate.startup();
            this.geocoder = new Geocoder({
                map: this.map,
                'class': 'geocoder'
            }, this.searchNode);
            this.geocoder.startup();

            var decadeCatchBaseLayer = new ArcGISDynamicMapServiceLayer("http://prodgis2.agriculture.purdue.edu/arcgis/rest/services/IISGLakeMI/Decade_Catch_Data_LakeMI/MapServer", {
                "opacity": .90,
                imageParameters: imageParameters
            });

            var fishLayer = new Featurelayer('http://prodgis2.agriculture.purdue.edu/arcgis/rest/services/IISGLakeMI/Decade_Catch_Data_LakeMI/MapServer/12',{
                // mode: this.fishLayer.MODE_ONDEMAND,
                outFields: ['*'],
                infoTemplate : iTemplate
            });                


            var visibleBaseLayerIds = [2, 3, 4, 5, 66];
            decadeCatchBaseLayer.setVisibleLayers(visibleBaseLayerIds);

            // decadeCatchDataLayer defined as global for use in this function and setFishMap function

            this.map.addLayer(decadeCatchDataLayer);        
            this.map.addLayer(decadeCatchBaseLayer);
            //this.map.addLayer(fishLayer);
            this.legendCreate();
        },

        updateFishmap: function(dateText, fishText, summaryText) {
            this.setPopupTemplate(summaryText);
            this.setFishmap(dateText, fishText, summaryText);
            console.log('refreshing legend');
            this.legendRefresh();
            console.log('refreshing time slider');
            this.initSlider();
        },
       
       setPopupTemplate: function(summaryText){
        if (summaryText = "Catch per Trip") {
            field = "CPUE_TRIPS"
        }
        else if (summaryText = "Catch per Angler Hour") {
            field = "CPUE_HOURS"
        }
        else if (summaryText == "Catch Total") {
            field = "TOTAL"
        };
        console.log ("New itemplate");
        iTemplate.setContent({
      title: "Grid cell id: {GRID}",
      // description: " Grid cell id: {GRID}",
      fieldInfos: [{ //define field infos so we can specify an alias
        fieldName: "TOTAL",
        label: "Total"
      }],
      mediaInfos:[{ //define the bar chart
        caption: "",
        type:"barchart",
        value:{
          "theme": "Dollar",
          "fields":["TOTAL"]
        }
      }]
    });
        console.log("Field " + field);
       },

        clearBaseMap: function() {
            var map = this.map;
            if (map.basemapLayerIds.length > 0) {
                array.forEach(map.basemapLayerIds, function(lid) {
                    map.removeLayer(map.getLayer(lid));
                });
                map.basemapLayerIds = [];
            } else {
                map.removeLayer(map.getLayer(map.layerIds[0]));
            }
        },

        setBasemap: function(basemapText) {
            var map = this.map;
            var l, options;
            this.clearBaseMap();
            switch (basemapText) {
                case 'Water Color':
                    options = {
                        id: 'Water Color',
                        copyright: 'stamen',
                        resampling: true,
                        subDomains: ['a', 'b', 'c', 'd']
                    };
                    l = new WebTiledLayer('http://${subDomain}.tile.stamen.com/watercolor/${level}/${col}/${row}.jpg', options);
                    map.addLayer(l, options);
                    break;

                case 'MapBox Space':

                    options = {
                        id: 'mapbox-space',
                        copyright: 'MapBox',
                        resampling: true,
                        subDomains: ['a', 'b', 'c', 'd']
                    };
                    l = new WebTiledLayer('http://${subDomain}.tiles.mapbox.com/v3/eleanor.ipncow29/${level}/${col}/${row}.jpg', options);
                    map.addLayer(l, options);
                    break;

                case 'Pinterest':
                    options = {
                        id: 'mapbox-pinterest',
                        copyright: 'Pinterest/MapBox',
                        resampling: true,
                        subDomains: ['a', 'b', 'c', 'd']
                    };
                    l = new WebTiledLayer('http://${subDomain}.tiles.mapbox.com/v3/pinterest.map-ho21rkos/${level}/${col}/${row}.jpg', options);
                    map.addLayer(l, options);
                    break;
                case 'Streets':
                    map.setBasemap('streets');
                    break;
                case 'Imagery':
                    map.setBasemap('hybrid');
                    break;
                case 'National Geographic':
                    map.setBasemap('national-geographic');
                    break;
                case 'Topographic':
                    map.setBasemap('topo');
                    break;
                case 'Gray':
                    map.setBasemap('gray');
                    break;
                case 'Open Street Map':
                    map.setBasemap('osm');
                    break;
            }
        }
    });
});