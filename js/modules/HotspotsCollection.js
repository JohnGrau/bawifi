var HotspotsCollection = (function(global, hotspots){
	var that = this;
	var hotspotsByComuna = [];
	var hotspotsByCategoria = [];
	var hotspotsByCerca = [];
	var nextPage = null;

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
	 		var filter = $this.jqmData("key");
	 		HotspotsCollection.addHotspots(name,filter);
 		});
	};
	var removeListeners = function(name){
		$("#"+name+" li a").off();
	};
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
			hotspots.sort(that["sortByDistance"]);
			for(var i = 0 ; i < 10 ; ++i){			
				buffer += "<li><h3>" +hotspots[i]["nombre"]+ "</h3><p class='ui-li-desc'>" + hotspots[i]["domicilio"] + "</p></li>";				
			}
			refreshList("cerca", $list, buffer);
		},
		addHotspots: function(name, filter){
			$.mobile.changePage('#hotspots-page');
			var l = hotspots.length
				, buffer = ""
				,	$list = $("#hotspots")
				, old_category
				, key;

			$list.empty();
			//hotspots.sort(that["sortBy" + name]);
			for(var i = 0 ; i < l ; ++i){		
				if(name === 'comunas'){
					key = "Comuna " + hotspots[i]["nro_comuna"];
					if(filter === key){
						buffer += "<li><h3>" +hotspots[i]["nombre"]+ "</h3><p class='ui-li-desc'>" + hotspots[i]["domicilio"] + "</p></li>";	
					}
				}else if(name === 'tipos'){
					key = hotspots[i]["tipo_normalizado"];
					if(filter === key){
						buffer += "<li><h3>" +hotspots[i]["nombre"]+ "</h3><p class='ui-li-desc'>" + hotspots[i]["domicilio"] + "</p></li>";	
					}
				}							
			}
			refreshList("hotspots", $list, buffer);
		}		
	}
})(window, hotspots)