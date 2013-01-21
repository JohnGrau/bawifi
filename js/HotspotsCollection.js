var HotspotsCollection = (function(global, hotspots){
	var that = this;
	this.sortByComuna = function(a, b){
			var cmnaA = parseInt(a.nro_comuna);
			var cmnaB = parseInt(b.nro_comuna);
		  return ((cmnaA < cmnaB) ? -1 : ((cmnaA > cmnaB) ? 1 : 0));
	},
	this.sortByDistance = function(a, b){
			var cmnaA = parseFloat(a.distancia);
			var cmnaB = parseFloat(b.distancia);
		  return ((cmnaA < cmnaB) ? -1 : ((cmnaA > cmnaB) ? 1 : 0));
	},
	return{
		//calcula la distancia desde la posicion actual para todos los hotspots
		computeDistance: function(whereami){
			var l = hotspots.length
				, i = 0;
			for(i ; i < l ; ++i){
				var hot_point = new Point(parseFloat(hotspots[i]["lat"]),	parseFloat(hotspots[i]["long"]));
				hotspots[i]["distancia"] = Point.getDistance(hot_point,whereami);
				//log(hotspots[i]["nombre"] +': '+ hotspots[i]["distancia"]);
			}
		},
		addHotspotsToList: function(name,list_id){
			var l = hotspots.length
				, buffer = ""
				,	$hp = $("#"+list_id)
				, i = 0
				, old_category;
			$hp.empty();
			hotspots.sort(that["sortBy" + name]);
			for(i ; i < l ; ++i){
				hotspots[i]["comuna"];
				hotspots[i]["lat"];
				hotspots[i]["long"];
				if(hotspots[i]["nro_comuna"]!=old_category && name === 'Comuna')				 
					buffer += "<li data-theme='b' data-role='list-divider'>Comuna " + hotspots[i]["nro_comuna"] + "</li>";
				if(name === 'Categoria')				 
					buffer += "<li data-theme='b' data-role='list-divider'>" + hotspots[i]["tipo"] + "</li>";				
				buffer += "<li><h3>" +hotspots[i]["nombre"]+ "</h3><p class='ui-li-desc'>" + hotspots[i]["domicilio"] + "</p></li>"
				old_category = hotspots[i]["nro_comuna"];
			}
			$hp.append(buffer);
			$hp.listview("refresh")
		}		
	}
})(window, hotspots)