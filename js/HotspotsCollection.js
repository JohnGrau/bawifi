var HotspotsCollection = (function(global, hotspots){
	var that = this;
	var hotspotsByComuna = [];
	var hotspotsByCategoria = [];
	var hotspotsByCerca = [];
	
	this.sortByComuna = function(a, b){
			var cmnaA = parseInt(a.nro_comuna);
			var cmnaB = parseInt(b.nro_comuna);
		  return ((cmnaA < cmnaB) ? -1 : ((cmnaA > cmnaB) ? 1 : 0));
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
				,	$hp = $("#categorias");

			$hp.empty();
			for(var key in items){
				if(typeof items[key] !==typeof(Function)){
					buffer += '<li><a data-role="button" data-icon="arrow-u" data-key="'+key+'"><h3>' +items[key]+ '</h3><p class="ui-li-desc"></p></a></li>';
				}
			}
			$hp.html(buffer);
			$hp.listview("refresh");
		},
		addHotspotsToList: function(name,list_id){
			var l = hotspots.length
				, buffer = ""
				,	$hp = $("#"+list_id)
				, old_category;
			$hp.empty();
			hotspots.sort(that["sortBy" + name]);
			for(var i = 0 ; i < l ; ++i){
				if(hotspots[i]["nro_comuna"]!=old_category && name === 'Comuna'){
					buffer += "<li data-theme='b' data-role='list-divider'>Comuna " + hotspots[i]["nro_comuna"] + "</li>";
					old_category = hotspots[i]["nro_comuna"];
				}				 				
				if(hotspots[i]["tipo"]!=old_category &&name === 'Categoria'){
					buffer += "<li data-theme='b' data-role='list-divider'>" + hotspots[i]["tipo"] + "</li>";
					old_category = hotspots[i]["tipo"];
				}				
				buffer += "<li><h3>" +hotspots[i]["nombre"]+ "</h3><p class='ui-li-desc'>" + hotspots[i]["domicilio"] + "</p></li>";				
			}
			$hp.html(buffer);
			$hp.listview("refresh")
		}		
	}
})(window, hotspots)