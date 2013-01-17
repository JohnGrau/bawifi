
var App = (function(global, hotspots){
	var whereami;
	var jqmReady = $.Deferred(),
	    pgReady = $.Deferred();
	
	//Ordena por comuna el dataset
	var	sortByComuna = function(a, b){
			var cmnaA = parseInt(a.nro_comuna);
			var cmnaB = parseInt(b.nro_comuna);
		  return ((cmnaA < cmnaB) ? -1 : ((cmnaA > cmnaB) ? 1 : 0));
	};
	var	sortByDistance = function(a, b){
			var cmnaA = parseFloat(a.distancia);
			var cmnaB = parseFloat(b.distancia);
		  return ((cmnaA < cmnaB) ? -1 : ((cmnaA > cmnaB) ? 1 : 0));
	};	
		//calcula la distancia desde la posicion actual
	var	computeDistance = function(){
		var l = hotspots.length
			, i = 0;
		for(i ; i < l ; ++i){
			var hot_point = new Point(parseFloat(hotspots[i]["lat"]),	parseFloat(hotspots[i]["long"]));
			hotspots[i]["distancia"] = Point.getDistance(hot_point,whereami);
			//log(hotspots[i]["nombre"] +': '+ hotspots[i]["distancia"]);
		}
	};
	var onSuccess = function(position) {
		//grabo la geolocalizacion
	  whereami = new Point(position.coords.latitude, position.coords.longitude);
	 	computeDistance();
	},
	var onError = function(error) {
		//mostrar algo que indique que todavia no se localizo
	  log("error en geolocalizar");
	};
	//agrego los hotspots a la lista
	var	addHotspotsToList = function(sortedBy){
		var l = hotspots.length
			, buffer = ""
			,	$hp = $("#hotspots")
			, i = 0
			, old_category;
		$hp.empty();
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
	};	
	return {
		init: function(){
			var that = this;
			$.mobile.listview.prototype.options.filterPlaceholder = "Buscar wifi...";
			$(document).on("pageinit", jqmReady.resolve);
			document.addEventListener("deviceready", pgReady.resolve, false);
			//phonegap listo y jquery mobile listo
			$.when(jqmReady, pgReady).then(function () {
				navigator.geolocation.getCurrentPosition(onSuccess, onError, { maximumAge: 3000, timeout: 5000, enableHighAccuracy: true });
			  addHotspotsToList(sortByComuna);
				$("#hotspots-by-distance").on('tap', function(e){
			    log("TAP DISTANCE");
			    e.stopImmediatePropagation();
			    e.preventDefault();
					addHotspotsToList(sortByDistance);
				});
				$("#hotspots-by-comuna").on('tap', function(e){
					log("TAP COMUNA");
			    e.stopImmediatePropagation();
			    e.preventDefault();
					addHotspotsToList(sortByComuna);
				});			
			});
		}
	}
})(window, hotspots);
App.init();