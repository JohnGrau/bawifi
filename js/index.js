//log wrapper
window.log = function(){
  log.history = log.history || [];
  log.history.push(arguments);
  if(this.console){
    console.log( Array.prototype.slice.call(arguments) );
  }
};

(function(global){
	$.mobile.listview.prototype.options.filterPlaceholder = "Buscar wifi...";
	var jqmReady = $.Deferred(),
	    pgReady = $.Deferred();

	$(document).on("pageinit", jqmReady.resolve);
	document.addEventListener("deviceready", pgReady.resolve, false);

	//phonegap listo y jquery mobile listo
	$.when(jqmReady, pgReady).then(function () {
		console.log("READY");
		navigator.geolocation.getCurrentPosition(onSuccess, onError);	
	  addHotspotsToList(sortByComuna);
	  //saco la barra del listview y lo coloco en el header
	});
	//agrego los hotspots a la lista
	var addHotspotsToList = function(sortedBy){
		var l = hotspots.length
			, buffer = ""
			,	$hp = $("#hotspots")
			, i = 0
			, old_category;

		hotspots.sort(sortedBy);
		for(i ; i < l ; ++i){
			hotspots[i]["comuna"];
			hotspots[i]["lat"];
			hotspots[i]["long"];
			if(hotspots[i]["nro_comuna"]!=old_category)				 
				buffer += "<li data-theme='b' data-role='list-divider'>Comuna " + hotspots[i]["nro_comuna"] + "</li>";
			buffer += "<li><h3>" +hotspots[i]["nombre"]+ "</h3><p class='ui-li-desc'>" + hotspots[i]["domicilio"] + "</p></li>"
			old_category = hotspots[i]["nro_comuna"];
		}
		$hp.append(buffer);
		$hp.listview("refresh")

	}
	var onSuccess = function(position) {
	    log(	'Latitude: '          + position.coords.latitude          + '\n' +
	          'Longitude: '         + position.coords.longitude         + '\n' +
	          'Altitude: '          + position.coords.altitude          + '\n' +
	          'Accuracy: '          + position.coords.accuracy          + '\n' +
	          'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
	          'Heading: '           + position.coords.heading           + '\n' +
	          'Speed: '             + position.coords.speed             + '\n' +
	          'Timestamp: '         + position.timestamp                + '\n');
	};

	// onError Callback receives a PositionError object
	//
	var onError = function(error) {
	    log('code: '    + error.code    + '\n' +
	          'message: ' + error.message + '\n');
	}
	
	
	//Ordena por comuna el dataset
	var sortByComuna = function(a, b){
		var cmnaA = parseInt(a.nro_comuna);
		var cmnaB = parseInt(b.nro_comuna);
	  return ((cmnaA < cmnaB) ? -1 : ((cmnaA > cmnaB) ? 1 : 0));
	}


})(window)