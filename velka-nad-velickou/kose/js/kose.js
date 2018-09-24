/*icon with hole*/
L.NumberedDivIcon = L.Icon.extend({
	options: {
		iconUrl: 'img/red-bin-hole.png',
		number: '',
		shadowUrl: null,
		iconSize: [40, 40],
		iconAnchor: [20, 20],
		popupAnchor: [0, -22],
		className: 'leaflet-div-icon'
	},

	createIcon: function () {
		var div = document.createElement('div');
		var img = this._createImg(this.options['iconUrl']);
		var numdiv = document.createElement('div');
		numdiv.setAttribute ( "class", "number" );
		numdiv.innerHTML = this.options['number'] || '';
		div.appendChild ( img );
		div.appendChild ( numdiv );
		this._setIconStyles(div, 'icon');
		return div;
	},
});


/*icons*/
var icons = {
	greenBin: L.icon({
	    iconUrl: 'img/green-bin.png',

	    iconSize:     [30, 30],
	    iconAnchor:   [15, 15],
	    popupAnchor:  [0, -18]
	}),
	redBin: L.icon({
	    iconUrl: 'img/red-bin.png',

	    iconSize:     [30, 30],
	    iconAnchor:   [15, 15],
	    popupAnchor:  [0, -18]
	}),
	blueBin: L.icon({
	    iconUrl: 'img/blue-bin.png',

	    iconSize:     [30, 30],
	    iconAnchor:   [15, 15],
	    popupAnchor:  [0, -18]
	}),
	yellowBin: L.icon({
	    iconUrl: 'img/yellow-bin.png',

	    iconSize:     [30, 30],
	    iconAnchor:   [15, 15],
	    popupAnchor:  [0, -18]
	}),
	brownBin: L.icon({
	    iconUrl: 'img/brown-bin.png',

	    iconSize:     [30, 30],
	    iconAnchor:   [15, 15],
	    popupAnchor:  [0, -18]
	}),
	azureBin: L.icon({
	    iconUrl: 'img/azure-bin.png',

	    iconSize:     [30, 30],
	    iconAnchor:   [15, 15],
	    popupAnchor:  [0, -18]
	}),
	purpleBin: L.icon({
	    iconUrl: 'img/purple-bin.png',

	    iconSize:     [30, 30],
	    iconAnchor:   [15, 15],
	    popupAnchor:  [0, -18]
	}),
	orangeBin: L.icon({
	    iconUrl: 'img/orange-bin.png',

	    iconSize:     [30, 30],
	    iconAnchor:   [15, 15],
	    popupAnchor:  [0, -18]
	}),
	blackBin: L.icon({
	    iconUrl: 'img/black-bin.png',

	    iconSize:     [40, 40],
	    iconAnchor:   [20, 20],
	    popupAnchor:  [0, -22]
	}),
	redRecycle: L.icon({
	    iconUrl: 'img/warehouse.png',

	    iconSize:     [50, 50],
	    iconAnchor:   [25, 25]
	}),
}

/*correct icon based on marker content*/
getIcon = function (content) {
	switch (content) {
		case 'plastic':
			ic = icons.yellowBin;
			break;
		case 'paper':
			ic = icons.blueBin;
			break;
		case 'glass-all':
			ic = icons.greenBin;
			break;
		case 'glass-white':
			ic = icons.brownBin;
			break;
		case 'chemicals':
			ic = icons.purpleBin;
			break;
		case 'electro':
			ic = icons.redBin;
			break;
		case 'clothes':
			ic = icons.orangeBin;
			break;
		case 'warehouse':
			ic = icons.redRecycle;
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
		case 'glass-all':
			return 'sklo směs';
		case 'glass-white':
			return 'sklo bílé';
		case 'electro':
			return 'elektro-odpad';
		case 'chemicals':
			return 'chemikálie, oleje';
		case 'bio':
			return 'bio-odpad';
		case 'clothes':
			return 'oděvy';
		case 'warehouse':
			return '<b>Sběrný dvůr</b><br><b>Út:</b>8 - 17<br><b>St:</b>8 - 17 (březen - říjen)<br><b>St:</b>8 - 15 (listopad - únor)<br><b>Čt:</b>8 - 15<br><b>Pá:</b>8 - 15<br><b>So:</b>8 - 12<br><b>Lze odložit veškerý tříděný odpad</b>';
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
		ic = (obj.type === 'container' ? new L.NumberedDivIcon({number: obj.content.length.toString()}) : icons.redRecycle);
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
	console.log(jsonObj);
	if (jsonObj.piratiLogo) {
		$("#pirati-logo").show();
	}
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

	/*click on marker - open popup*/
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
	  	var ic = (markers[i].type === 'collection-yard' ? icons.redRecycle : new L.NumberedDivIcon({number: markers.length.toString()}));
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