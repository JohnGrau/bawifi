
var App = (function(global, hotspots){
	var whereami;
	var jqmReady = $.Deferred(),
	    pgReady = $.Deferred(),
	    gcReady = $.Deferred;

	var geocoder = function(x,y, callback){
		var c = callback;
		$.get('http://ws.usig.buenosaires.gob.ar/geocoder/2.2/reversegeocoding?x='+x+'&y='+y, function(data){
			data = String(data).replace('(','');
			data = String(data).replace(')','');
			orig = JSON.parse(data);							
			if(typeof(c) == typeof(Function)){
				gcReady.resolve()
				c(orig);
			}
		});				
	};
	var onSuccess = function(position) {
		//grabo la geolocalizacion
	  whereami = new Point(position.coords.latitude, position.coords.longitude);
	 	HotspotsCollection.computeDistance(whereami);
	},
	var onError = function(error) {
		//mostrar algo que indique que todavia no se localizo
	  log("error en geolocalizar");
	};
	var getRecorrido = function(lat,lon){
		usig.Recorridos.init({tipo:'pie'})
		var currentLocation =  new usig.Punto(dest.puerta_x, whereami.latitud);   
		var currentDest =  new usig.Punto(lon, lat);   
		usig.Recorridos.buscarRecorridos(currentLocation, currentDest, function(opciones) {
			recorridos = opciones;
			recorridos[0].getDetalle(function(detalle){       					
				var htmlChunk = '';
				htmlChunk += '<li data-role="list-divider" data-icon="false">A PIE | ESTIMADO '+recorridos[0].getTime()+' MINUTOS<span class="walk-icon"></span></li>';
				for(var j=0, l = detalle.length; j<l;j++){					
					htmlChunk += '<li data-icon="false" class="ui-btn ui-li ui-btn-up-c"><a href="#" style="white-space:normal; font-size: small">'+detalle[j].text+'</a></li>';
				} 
				$('#recorridos').html(htmlChunk);			    
			});
			$.mobile.hidePageLoadingMsg();
		});  
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
			  HotspotsCollection.addHotspotsToList("Comuna","hotspots-comuna");
				$(".sorted-by-cerca-btn").on('tap', function(e){
					HotspotsCollection.addHotspotsToList("Distance","hotspots-cerca");
				});
				$(".sorted-by-comuna-btn").on('tap', function(e){
					HotspotsCollection.addHotspotsToList("Comuna","hotspots-comuna");
				});
				$(".sorted-by-categoria-btn").on('tap', function(e){
					HotspotsCollection.addHotspotsToList("Categoria","hotspots-categoria");
				});							
			});
		}
	}
})(window, hotspots);


//Inicio la app
App.init();