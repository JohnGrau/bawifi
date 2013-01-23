
var App = (function(global, hotspots){
	var whereami;
	var jqmReady = $.Deferred(),
	    pgReady = $.Deferred(),
	    gcReady = $.Deferred;

	var onSuccess = function(position) {
		//grabo la geolocalizacion
	  whereami = new Point(position.coords.latitude, position.coords.longitude);
		UsigLite.convertCoords({"longitud": whereami.longitud, "latitude":whereami.latitude}, function(puntousig){
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
			$(document).on("pageinit", jqmReady.resolve);
			document.addEventListener("deviceready", function(){
				navigator.geolocation.getCurrentPosition(onSuccess, onError, { maximumAge: 3000, timeout: 5000, enableHighAccuracy: true });	
				pgReady.resolve();
			}, false);
			
			//phonegap listo y jquery mobile listo
			$.when(jqmReady, pgReady).then(function () {
				
			 	HotspotsCollection.addGroups("comunas");
			 	$("#categorias li").on('tap',function(e){
			 		alert(e);
			 	});
				$(".sorted-by-cerca-btn").on('tap', function(e){
					//HotspotsCollection.addGroups("");
					//HotspotsCollection.addHotspotsToList("Distance","hotspots");
				});
				$(".sorted-by-comuna-btn").on('tap', function(e){
					HotspotsCollection.addGroups("comunas");
					//HotspotsCollection.addHotspotsToList("Comuna","hotspots");
				});
				$(".sorted-by-tipo-btn").on('tap', function(e){
					HotspotsCollection.addGroups("tipos");
					//HotspotsCollection.addHotspotsToList("Categoria","hotspots");
				});							
			});
		}
	}
})(window, hotspots);

//Inicio la app
App.init();