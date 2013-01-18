
var App = (function(global, hotspots){
	var whereami;
	var jqmReady = $.Deferred(),
	    pgReady = $.Deferred();

	var onSuccess = function(position) {
		//grabo la geolocalizacion
	  whereami = new Point(position.coords.latitude, position.coords.longitude);
	 	HotspotsCollection.computeDistance(whereami);
	},
	var onError = function(error) {
		//mostrar algo que indique que todavia no se localizo
	  log("error en geolocalizar");
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
			  HotspotsCollection.addHotspotsToList("Comuna");
				$("#hotspots-by-distance").on('tap', function(e){
			    e.stopImmediatePropagation();
			    e.preventDefault();
					HotspotsCollection.addHotspotsToList("Distance");
				});
				$("#hotspots-by-comuna").on('tap', function(e){
			    e.stopImmediatePropagation();
			    e.preventDefault();
					HotspotsCollection.addHotspotsToList("Comuna", true);
				});			
			});
		}
	}
})(window, hotspots);

//Inicio la app
App.init();