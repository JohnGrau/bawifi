var UsigLite = (function() {
	return {
		//obtiene un recorrido en base a dos puntos usig
		getRecorrido: function(origen,destino,callback){ 
			usig.Recorridos.buscarRecorridos(origen, destino, function(opciones) {
				//tomo la primer opcion del recorrido
				var recorrido = opciones[0];
				recorrido.getDetalle(function(detalle){       
					if(typeof(callback) == typeof(Function)){
						try{
							callback(null, {"tiempo":recorrido.getTime(),"detalle": detalle});   
						}catch(err){
							callback(err,null);
						}	
					}									
				});
			});  
		},
		reverseGeocoder: function(punto, callback){
			$.getJSON("http://ws.usig.buenosaires.gob.ar/geocoder/2.2/reversegeocoding?x="+punto.getX()+"&y="+punto.getY(), function(data){
				data = String(data).replace('(','');
				data = String(data).replace(')','');
				orig = JSON.parse(data);							
				if(typeof(callback) == typeof(Function)){
					try{
						callback(null,data);
					}catch(err){
						callback(err,null);
					}	
				}
			});				
		},
		//convierte un punto de lat y long en un punto de la usig
		convertCoords: function(punto, callback){
			$.getJSON("http://ws.usig.buenosaires.gob.ar/rest/convertir_coordenadas?x="+punto.longitud+"&y="+punto.latitud+"&output=lonlat", function(data){
				if(typeof(callback) == typeof(Function)){
					try{
						var p = new usig.Punto(data.resultado.x, data.resultado.y);
						callback(null,p);
					}catch(err){
						callback(err,null);
					}				
				}
			});
		}
	}
})();