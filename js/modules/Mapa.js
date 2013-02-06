

var Mapa = (function(global){
	var map
		, markers = [];
	return {
		init: function(){
			var position = new google.maps.LatLng(-34.61223, -58.380373);
      var mapOptions = {
        center: position,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      var selectMap = document.getElementById("mapa-content");
      map = new google.maps.Map(selectMap, mapOptions);
      //previene que se mueva el mapa
      selectMap.addEventListener('touchstart' /*'mousedown'*/, function(e) {
			    e.stopPropagation();
			}, false);		
    },
    clearOverlays: function() {
    	var l = markers.length;
		  for (var i = 0; i < l; ++i ) {
		    markers[i].setMap(null);
		  }
		},
    addMarker: function(obj){
    	var position = new google.maps.LatLng(obj.lat, obj.long, obj.nombre);
			var marker = new google.maps.Marker({
            position: position,
            map: map,
            title: obj.nombre
      });
      var infowindow = new google.maps.InfoWindow({
				content: "<h4>" + obj.nombre + "</h4><p>" + obj.domicilio + "</p>"
			});
      map.setCenter(position);
			google.maps.event.addListener(marker, 'click', function() {
			  infowindow.open(map,marker);
			});
      markers[marker] = marker;	
    }	
	};
})(window);