/*icons*/
var icons = {
	greenBin: L.icon({
	    iconUrl: 'img/green-bin.png',

	    iconSize:     [30, 30], // size of the icon
	    iconAnchor:   [15, 15], // point of the icon which will correspond to marker's location
	    popupAnchor:  [0, -18] // point from which the popup should open relative to the iconAnchor
	}),
	redBin: L.icon({
	    iconUrl: 'img/red-bin.png',

	    iconSize:     [40, 40], // size of the icon
	    iconAnchor:   [20, 20], // point of the icon which will correspond to marker's location
	    popupAnchor:  [0, -22] // point from which the popup should open relative to the iconAnchor
	}),
	blueBin: L.icon({
	    iconUrl: 'img/blue-bin.png',

	    iconSize:     [30, 30], // size of the icon
	    iconAnchor:   [15, 15], // point of the icon which will correspond to marker's location
	    popupAnchor:  [0, -18] // point from which the popup should open relative to the iconAnchor
	}),
	yellowBin: L.icon({
	    iconUrl: 'img/yellow-bin.png',

	    iconSize:     [30, 30], // size of the icon
	    iconAnchor:   [15, 15], // point of the icon which will correspond to marker's location
	    popupAnchor:  [0, -18] // point from which the popup should open relative to the iconAnchor
	}),
	brownBin: L.icon({
	    iconUrl: 'img/brown-bin.png',

	    iconSize:     [30, 30], // size of the icon
	    iconAnchor:   [15, 15], // point of the icon which will correspond to marker's location
	    popupAnchor:  [0, -18] // point from which the popup should open relative to the iconAnchor
	}),
	azureBin: L.icon({
	    iconUrl: 'img/azure-bin.png',

	    iconSize:     [30, 30], // size of the icon
	    iconAnchor:   [15, 15], // point of the icon which will correspond to marker's location
	    popupAnchor:  [0, -18] // point from which the popup should open relative to the iconAnchor
	}),
	purpleBin: L.icon({
	    iconUrl: 'img/purple-bin.png',

	    iconSize:     [30, 30], // size of the icon
	    iconAnchor:   [15, 15], // point of the icon which will correspond to marker's location
	    popupAnchor:  [0, -18] // point from which the popup should open relative to the iconAnchor
	}),
	orangeBin: L.icon({
	    iconUrl: 'img/orange-bin.png',

	    iconSize:     [30, 30], // size of the icon
	    iconAnchor:   [15, 15], // point of the icon which will correspond to marker's location
	    popupAnchor:  [0, -18] // point from which the popup should open relative to the iconAnchor
	}),
	blackBin: L.icon({
	    iconUrl: 'img/black-bin.png',

	    iconSize:     [40, 40], // size of the icon
	    iconAnchor:   [20, 20], // point of the icon which will correspond to marker's location
	    popupAnchor:  [0, -22] // point from which the popup should open relative to the iconAnchor
	}),
	redRecycle: L.icon({
	    iconUrl: 'img/warehouse.png',

	    iconSize:     [50, 50], // size of the icon
	    iconAnchor:   [25, 25] // point of the icon which will correspond to marker's location
	}),
}

/*correct icon based on marker content*/
getIcon = function (content) {
	var ic = icons.redBin;
	switch (content) {
		case 'plastic':
			ic = icons.yellowBin;
			break;
		case 'paper':
			ic = icons.blueBin;
			break;
		case 'glass':
			ic = icons.greenBin;
			break;
		case 'chemicals':
			ic = icons.purpleBin;
			break;
		case 'bio':
			ic = icons.brownBin;
			break;
		case 'electro':
			ic = icons.azureBin;
			break;
		case 'clothes':
			ic = icons.orangeBin;
			break;
		default:
			ic = icons.blackBin;
			break;
	}
	return ic;
}

/*popup text for small bins*/
getPopupText = function (content) {
	switch (content) {
		case 'plastic':
			return 'plasty';
		case 'paper':
			return 'papír';
		case 'glass':
			return 'sklo';
		case 'electro':
			return 'elektro-odpad';
		case 'chemicals':
			return 'chemikálie, oleje';
		case 'bio':
			return 'bio-odpad';
		case 'clothes':
			return 'oblečení';
		default:
			return null;
	}
}

/*marker from object*/
obj2Marker = function(obj, content) {
	var ic;
	if (obj.content.length === 1) {
		ic = getIcon(content);
	} else {
		ic = (obj.type === 'container' ? icons.redBin : icons.redRecycle);
	}
	var marker = new L.marker([obj.lat, obj.lon], {icon: ic});
	marker.content = content;
	marker.name = (obj.content.length === 1 ? getPopupText(content) : obj.name);
	marker.desc = (obj.content.length === 1 ? getPopupText(content) : obj.name); 
	marker.type = obj.type;
	marker.bindPopup(marker.name, {closeButton: false});

	marker.on('mouseover',function() {
	    marker.openPopup();
	});
	marker.on('click',function() {
	    marker.openPopup();
	});
	marker.on('mouseout',function() {
	    marker.closePopup();
	});

	return marker;
};

/*markers*/
$.getJSON("js/data.json", function(jsonObj) {
	$("#mapheader2").html(jsonObj.subtitle);
	/*init map with stamen toner lite map tiles*/
	var layer = new L.StamenTileLayer('toner');
	var map   = new L.map('mapid', {
	    center: new L.LatLng(jsonObj.center.lat, jsonObj.center.lon),
	    zoom:   jsonObj.zoom.default,
	    minZoom: jsonObj.zoom.min,
	    maxZoom: jsonObj.zoom.max
	});
	map.setMaxBounds(L.latLngBounds(L.latLng(jsonObj.bounds.topLeft, jsonObj.bounds.bottomLeft),L.latLng(jsonObj.bounds.topRight, jsonObj.bounds.bottomRight)));
	map.addLayer(layer);


	/*overlapping map instance*/
	var oms = new OverlappingMarkerSpiderfier(map,{keepSpiderfied: true, legWeight: 0});

	var popup = new L.Popup();
	oms.addListener('click', function(marker) {
	  popup.setContent(marker.desc);
	  popup.setLatLng(marker.getLatLng());
	  map.openPopup(popup);
	});

	/*close any open popup windows and set icons based on content, set text*/
	oms.addListener('spiderfy', function(markers) {
	  for (var i = 0, len = markers.length; i < len; i ++) {
	  	markers[i].setIcon(getIcon(markers[i].content));
	  	markers[i]._popup.setContent(getPopupText(markers[i].content));
	  };
	  map.closePopup();
	});

	/*set red icon and popup text*/
	oms.addListener('unspiderfy', function(markers) {
	  for (var i = 0, len = markers.length; i < len; i ++) {
	  	var ic = (markers[i].type === 'collection-yard' ? icons.redRecycle : icons.redBin);
	  	markers[i].setIcon(ic);
	  	markers[i]._popup.setContent(markers[i].name)
	  }
	});

	/*add markers to map*/
	var markers = jsonObj.markers;
	for (var i = 0; i < markers.length; i++) {
		for (var j = 0; j < markers[i].content.length; j++) {
			var m = obj2Marker(markers[i], markers[i].content[j]);
			map.addLayer(m);
			oms.addMarker(m);
		}
		
	}
});