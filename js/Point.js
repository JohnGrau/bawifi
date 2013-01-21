var Point = (function(lat,lon){
	return {
		latitud: lat,
		longitud: lon,	
	}
});
Point.toRad = function(n) {
	return n * (Math.PI/180) 
};
Point.getDistance = function(p1,p2){
	//log("LATITUD P1:"+p1.latitud + " LONGITUD P1: " + p1.longitud);
	//log("LATITUD P2:"+p2.latitud + " LONGITUD P2: " + p2.longitud);

	var R = 6371; // km
	var dLat = Point.toRad(p2.latitud-p1.latitud);
	var dLon = Point.toRad(p2.longitud-p1.longitud);
	var lat1 = Point.toRad(p1.latitud);
	var lat2 = Point.toRad(p2.latitud);

	var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
	        Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
	return R * c;		
};
