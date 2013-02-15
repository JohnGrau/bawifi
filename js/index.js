var App = (function(global, hotspots){
	console.log("aca");
	var jqmReady = $.Deferred(),
	    pgReady = $.Deferred(),
	    gcReady = $.Deferred(),
	    mapaReady = $.Deferred(),
	    whereami, currentDest, destName, destAddr;

	var onSuccess = function(position) {
		//grabo la geolocalizacion
	  whereami = new Point(position.coords.latitude, position.coords.longitude);
	  console.log("antes de convertCoords");
		UsigLite.convertCoords({"longitud": whereami.longitud, "latitud":whereami.latitud}, function(error, puntousig){
			if(!error){
				whereami.setGKBAPoint(puntousig);
				gcReady.resolve();
				if($.mobile.activePage.attr('id') === 'cerca-page'){
					HotspotsCollection.addCerca("cerca");
				}
			}else{
				navigator.notification.alert("No fue posible establecer su ubicación. Puede ser que se encuentre fuera de la Ciudad Autónoma de Buenos Aires", null, "Error", "Cerrar");
			}
		});
	 	HotspotsCollection.computeDistance(whereami);
	};
	var onError = function(error) {
		//mostrar algo que indique que todavia no se localizo
		console.log(error.code == PositionError.PERMISSION_DENIED);
		console.log(error.code == PositionError.POSITION_UNAVAILABLE);
		console.log(error.code == PositionError.TIMEOUT);

	  navigator.notification.alert("Error al geolocalizar. Active el posicionamiento en el dispositivo y reinicie la aplicación", null, "Error", "Cerrar");
	};
	return {
		getDest: function(){
			return currentDest;
		},
		init: function(){
			var that = this
				,	$document = $(document);

			$.mobile.listview.prototype.options.filterPlaceholder = "Buscar wifi...";
			$.mobile.allowCrossDomainPages = true;
			$document.on("pageinit", jqmReady.resolve);
			$document.on("pagebeforehide", function(){
				//a little hack ;-)
				$('[data-role="footer"] ul li a').not('.ui-state-persist').removeClass('ui-btn-down-a').removeClass('ui-btn-down-a').addClass('ui-btn-up-a');
			});
			document.addEventListener("deviceready", function(){
				navigator.splashscreen.show();
				navigator.geolocation.getCurrentPosition(onSuccess, onError, { maximumAge: 3000, timeout: 10000});	
				pgReady.resolve();
			}, false);
			$document.on("gettrip", function(e, dest, nombre, domicilio){
				if(whereami){
					var origen = new usig.Punto(whereami.gkba_longitud, whereami.gkba_latitud)
						, destino = new usig.Punto(dest.gkba_longitud, dest.gkba_latitud);
					//esta variable se comparte entre pantallas para que funcione el mapa
					currentDest = dest;
					destName = nombre;
					destAddr = domicilio;

					$.mobile.loading( 'show', {
						text: 'Cargando recorrido',
						textVisible: true,
						theme: 'a',
						html: ""
					});				
					UsigLite.getTrip(origen, destino, function(error,recorrido){
						if(!error){
							HotspotsCollection.addTrip(recorrido);
							$.mobile.changePage('#recorridos-page');
						}else{
							navigator.notification.alert(error, null, "Error", "Cerrar");
						}
						$.mobile.loading('hide');
					});
				}else{
					$.mobile.changePage('#sinposicion-page');
				}
			});
			//phonegap listo y jquery mobile listo
			$.when(jqmReady, pgReady).then(function () {
				$("#mapa-page").on('pageshow', function(e){ 
					Mapa.init();
					Mapa.addMarker({"lat":currentDest.latitud,"long":currentDest.longitud, "nombre":destName, "domicilio": destAddr});						
				});			 					
			 	HotspotsCollection.addGroups("comunas");
				$(".sorted-by-cerca-btn").on('tap', function(e){
					if(whereami){
						HotspotsCollection.addCerca("cerca");
					}
				});
				$(".sorted-by-comuna-btn").on('tap', function(e){
					HotspotsCollection.addGroups("comunas");
				});
				$(".sorted-by-tipo-btn").on('tap', function(e){		
					HotspotsCollection.addGroups("tipos");
				});
				$("#reintentar-pos").on('tap', function(e){
					navigator.notification.alert("reintentando", null, "Error", "Cerrar");
				});				
			});
		}
	}
})(window, hotspots);

//Inicio la app
App.init();