var HotspotsCollection = (function(global, hotspots){
	var that = this;
	var hotspotsByComuna = [];
	var hotspotsByCategoria = [];
	var hotspotsByCerca = [];
	var trip_types = {"walk":"A pie", "transporte_publico": "Transporte Público", "Car": "En auto"}
	var refreshList = function(name, list, content){
		try{
			list.html(content);
			list.listview("refresh");
			addListeners(name);
		}catch(err){
			$('#' + name + '-page').on('pageinit', function(e){				
				list.html(content);
				list.listview("refresh");
				$(this).off('pageinit');
				addListeners(name);
			});
		}
	};
	var addListeners = function(name){
		$("#"+name+" li a").on('tap',function(e){
	 		var $this = $(this);
	 		if(!$this.hasClass('hotspot')){
		 		var filter = $this.jqmData("key");
		 		HotspotsCollection.addHotspots(name,filter);	 			
	 		}else{
	 			var gkba_lat = $this.attr("data-gkbalat")
	 				, gkba_long = $this.attr("data-gkbalong")
	 				, latitud = $this.attr("data-latitud")
	 				, longitud = $this.attr("data-longitud")
	 				, nombre = $this.attr("data-nombre")
	 				,	domicilio = $this.attr("data-domicilio")	
	 				, p = new Point(latitud,longitud,gkba_lat,gkba_long);
	 			$(document).trigger("gettrip", [p, nombre, domicilio]);
	 		}
 		});
	};
	var removeListeners = function(name){
		$("#"+name+" li a").off();
	};
	this.sortByDistance = function(a, b){
		var cmnaA = parseFloat(a.distancia);
		var cmnaB = parseFloat(b.distancia);
	  return ((cmnaA < cmnaB) ? -1 : ((cmnaA > cmnaB) ? 1 : 0));
	};
	this.sortByCategoria = function(a, b){
		var cgriaA = a.tipo;
		var cgriaB = b.tipo;
	  return ((cgriaA < cgriaB) ? -1 : ((cgriaA > cgriaB) ? 1 : 0));
	};	
	return {
		//calcula la distancia desde la posicion actual para todos los hotspots
		computeDistance: function(whereami){
			var l = hotspots.length
				, i = 0;
			for(i ; i < l ; ++i){
				var hot_point = new Point(parseFloat(hotspots[i]["lat"]),	parseFloat(hotspots[i]["long"]));
				hotspots[i]["distancia"] = Point.getDistance(hot_point,whereami);
			}
		},
		addGroups: function(name){
			var items = window[name]
				,	l = items.length
				, buffer = ""
				,	$list = $("#" + name);
			$list.empty();
			for(var key in items){
				if(typeof items[key] !==typeof(Function)){
					var title = (name === 'comunas')? key : items[key];
					var desc = (name === 'comunas')? items[key] : "";
					buffer += '<li><a data-role="button" data-icon="arrow-u" data-key="'+key+'"><h3>' +title+ '</h3><p class="ui-li-desc">'+desc+'</p></a></li>';
				}
			}
			refreshList(name, $list, buffer);
		},
		addCerca: function(list_id){
			var buffer = ""
				,	$list = $("#"+list_id);

			$list.empty();
			hotspots.sort(that.sortByDistance);
			for(var i = 0 ; i < 10 ; ++i){			
				var gkba_lat = hotspots[i]["gkba_lat"]
					, gkba_long = hotspots[i]["gkba_long"]
					, latitud = hotspots[i]["lat"]
					, longitud = hotspots[i]["long"]
					, nombre = hotspots[i]["nombre"]
					, domicilio = hotspots[i]["domicilio"];
				buffer += '<li><a data-longitud="' + longitud + '" data-latitud="' + latitud + '" data-gkbalat="' + gkba_lat + '" data-gkbalong="' + gkba_long + '" data-role="button" data-nombre="' + nombre + '" data-domicilio="' + domicilio + '" class="hotspot" data-icon="arrow-u"><h3>' + nombre + "</h3><p class='ui-li-desc'>" + domicilio + "</p></a></li>";	
			}
			refreshList("cerca", $list, buffer);
		},
		addTrip:function(recorrido){
			var buffer = ""
				,	$list = $("#recorridos")
				,	detalle = recorrido.detalle;

			$list.empty();
			buffer += '<li data-role="list-divider"><h3>Tiempo Estimado: ' +recorrido.tiempo+ ' Minutos | '+trip_types[recorrido.tipo]+' </h3></li>';
			for(var key in detalle){	
				if(typeof detalle[key] !==typeof(Function)){
					var title = detalle[key].text;
					buffer += '<li><h3>' +title+ '</h3><p class="ui-li-desc"></p></li>';
				}
			}
			refreshList("recorridos", $list, buffer);
		},
		addHotspots: function(name, filter){
			$.mobile.changePage('#hotspots-page');
			var l = hotspots.length
				, buffer = ""
				,	$list = $("#hotspots")
				, old_category
				, key;

			$list.empty();
			hotspots.sort(that.sortByDistance);
			for(var i = 0 ; i < l ; ++i){		
				var gkba_lat = hotspots[i]["gkba_lat"]
					, gkba_long = hotspots[i]["gkba_long"]
					, latitud = hotspots[i]["lat"]
					, longitud = hotspots[i]["long"]
					, nombre = hotspots[i]["nombre"]
					, domicilio = hotspots[i]["domicilio"];			
				if(name === 'comunas'){
					key = "Comuna " + hotspots[i]["nro_comuna"];
					if(filter === key){
						buffer += '<li><a data-longitud="' + longitud + '" data-latitud="' + latitud + '" data-gkbalat="' + gkba_lat + '" data-gkbalong="' + gkba_long + '" data-role="button" data-nombre="' + nombre + '" data-domicilio="' + domicilio + '" class="hotspot" data-icon="arrow-u"><h3>' + nombre + "</h3><p class='ui-li-desc'>" + domicilio + "</p></a></li>";	
					}
				}else if(name === 'tipos'){
					key = hotspots[i]["tipo_normalizado"];
					if(filter === key){
						buffer += '<li><a data-longitud="' + longitud + '" data-latitud="' + latitud + '" data-gkbalat="' + gkba_lat + '" data-gkbalong="' + gkba_long + '" data-role="button" data-nombre="' + nombre + '" data-domicilio="' + domicilio + '" class="hotspot" data-icon="arrow-u"><h3>' + nombre + "</h3><p class='ui-li-desc'>" + domicilio + "</p></a></li>";	
					}
				}							
			}
			refreshList("hotspots", $list, buffer);
		}		
	}
})(window, hotspots)