
//set up variables to hold fish map choices
var dateText = '1993 - 2002';
var fishText = 'Rainbow Trout';
var summaryText = 'Catch per Trip';

require([
  'dojo/topic',
  'dojo/dom',

  'app/config',
  'app/widget/Map',
  'app/widget/NavBar',

  'dojo/i18n!./js/nls/strings.js',

  'dojo/domReady!'],
function(
  topic, dom,
  config, Map, NavBar,
  strings
) {
  'use strict';

  // start map widget
  var map = new Map({
    config: config,
    strings: strings
  }, 'mapNode');
  map.startup();

  // start nav widget
  var navBar = new NavBar({
    config: config,
    strings: strings
  }, 'navBarNode');
  navBar.startup();

  // set up topics
  topic.subscribe('basemap/set', function(args) {
    map.setBasemap(args.basemap);
  });
  topic.subscribe('year/set', function(args) {
    dateText = args.year;
    map.updateFishmap(dateText, fishText, summaryText);
    dom.byId("dateTextLabel").innerHTML = dateText + '<b class="caret"></b>';        
  });
  topic.subscribe('fish/set', function(args) {
    fishText = args.fish;    
    map.updateFishmap(dateText, fishText, summaryText);
    dom.byId("fishTextLabel").innerHTML = fishText + '<b class="caret"></b>';    
  });
  topic.subscribe('summary/set', function(args) {
    summaryText = args.summary;
    map.updateFishmap(dateText, fishText, summaryText);
    dom.byId("summaryTextLabel").innerHTML = summaryText + '<b class="caret"></b>';            
  });  
  // set page title
  window.document.title = strings.appTitle;

  dom.byId("dateTextLabel").innerHTML = dateText + '<b class="caret"></b>';        
  dom.byId("fishTextLabel").innerHTML = fishText + '<b class="caret"></b>';    
  dom.byId("summaryTextLabel").innerHTML = summaryText + '<b class="caret"></b>';            

});