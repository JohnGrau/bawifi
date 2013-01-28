
var App = (function(global, hotspots){
	var whereami;
	var jqmReady = $.Deferred(),
	    pgReady = $.Deferred(),
	    gcReady = $.Deferred();

	var onSuccess = function(position) {
		//grabo la geolocalizacion
	  whereami = new Point(position.coords.latitude, position.coords.longitude);
		UsigLite.convertCoords({"longitud": whereami.longitud, "latitud":whereami.latitud}, function(error, puntousig){
			whereami.setGKBAPoint(puntousig);
			gcReady.resolve();
		});
	 	HotspotsCollection.computeDistance(whereami);
	};
	var onError = function(error) {
		//mostrar algo que indique que todavia no se localizo
	  log("error en geolocalizar");
	};
	return {
		init: function(){
			var that = this;
			$.mobile.listview.prototype.options.filterPlaceholder = "Buscar wifi...";
			$.mobile.allowCrossDomainPages = true;

			$(document).on("pageinit", jqmReady.resolve);
			document.addEventListener("deviceready", function(){
				navigator.geolocation.getCurrentPosition(onSuccess, onError, { maximumAge: 3000, timeout: 5000, enableHighAccuracy: true });	
				pgReady.resolve();
			}, false);
			//phonegap listo y jquery mobile listo
			$.when(jqmReady, pgReady).then(function () {				
			 	HotspotsCollection.addGroups("comunas");
				$(".sorted-by-cerca-btn").on('tap', function(e){
					HotspotsCollection.addCerca("cerca");
				});
				$(".sorted-by-comuna-btn").on('tap', function(e){		
					HotspotsCollection.addGroups("comunas");
				});
				$(".sorted-by-tipo-btn").on('tap', function(e){		
					HotspotsCollection.addGroups("tipos");
				});							
			});
		}
	}
})(window, hotspots);

//Inicio la app
App.init();