// Version 1.1
/*
based on http://www.jeffreythompson.org/collision-detection/
by Jeffrey Thompson (mailjeffreythompson.org)

with PolyPoint by M. Katz based on Nirg

Edited and Integrated with marketjs-framework
by Ghozi Septiandri (ghozi.septiandri@impact360design.com)
*/

/*

How to use it ?

this.collision = new ig.Collision();

// POLYGON/POLYGON
var s1 = [rayStart, rayEnd];
var s2 = [rayStart, rayEnd];
result = this.collision.polyPoly(s1, s2);

// POLYGON/LINE
var s = [rayStart, rayEnd];
var l = {x1: posX, x2: posX, y1: posY, y2: posY};
result = this.collision.polyLine(s, l.x1, l.y1, l.x2, l.y2);

// LINE/LINE
var l1 = {x1: posX, x2: posX, y1: posY, y2: posY};
var l2 = {x1: posX, x2: posX, y1: posY, y2: posY};
result = this.collision.lineLine(l1.x1, l1.y1, l1.x2, l1.y2, l2.x1, l2.y1, l2.x2, l2.y2);

// POLYGON/POINT
var s = [rayStart, rayEnd];
var p = {x: posX, y: posY};
result = this.collision.polyPoint(s, p.x, p.y);

// CIRCLE/CIRCLE
var c1 = {x: centerPosX, y: centerPosY, r: radian};
var c2 = {x: centerPosX, y: centerPosY, r: radian};
result = this.collision.circleCircle(c1.x, c1.y, c1.r, c2.x, c2.y, c2.r);

*/

ig.module( 'plugins.math.collision' )
.requires(

)
.defines(function(){

ig.Collision = ig.Class.extend({

    init: function(){

    },

	// POLYGON/POLYGON
	polyPoly: function(p1, p2) {

		// go through each of the vertices, plus the next
		// vertex in the list
		var next = 0;
		for (var current=0; current<p1.length; current++) {
	
			// get next vertex in list
	  	  	// if we've hit the end, wrap around to 0
	   		next = current+1;
		    if (next == p1.length) next = 0;

		    // get the vars at our current position
		    // this makes our if statement a little cleaner
		    var vc = p1[current];    // c for "current"
		    var vn = p1[next];       // n for "next"

		    // now we can use these two points (a line) to compare
		    // to the other polygon's vertices using polyLine()
		    var collision = this.polyLine(p2, vc.x,vc.y,vn.x,vn.y);
		    if (collision) {
		    	return true;
		    } 

		    // optional: check if the 2nd polygon is INSIDE the first
		    collision = this.polyPoint(p1, p2[0].x, p2[0].y);
		    if (collision) {
		    	return true;
		    }

	  	}

	  	return false;

	},

	// POLYGON/LINE
	polyLine: function(vertices, x1, y1, x2, y2) {

	  	// go through each of the vertices, plus the next
	  	// vertex in the list
	  	var next = 0;
	  	for (var current=0; current<vertices.length; current++) {

		    // get next vertex in list
		    // if we've hit the end, wrap around to 0
		    next = current+1;
		    if (next == vertices.length) next = 0;

		    // get the vars at our current position
		    // extract X/Y coordinates from each
		    var x3 = vertices[current].x;
		    var y3 = vertices[current].y;
		    var x4 = vertices[next].x;
		    var y4 = vertices[next].y;

		    // do a Line/Line comparison
		    // if true, return 'true' immediately and
		    // stop testing (faster)
		    var hit = this.lineLine(x1, y1, x2, y2, x3, y3, x4, y4);
		    if (hit) {
		      	return true;
		    }

	  	}

		// never got a hit
		return false;

	},

	// LINE/LINE
	lineLine: function(x1, y1, x2, y2, x3, y3, x4, y4) {

	  	// calculate the direction of the lines
	  	var uA = ((x4-x3)*(y1-y3) - (y4-y3)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));
	  	var uB = ((x2-x1)*(y1-y3) - (y2-y1)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));

	  	// if uA and uB are between 0-1, lines are colliding
	  	if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
	   		return true;
	  	}

	  	return false;

	},

	// POLYGON/POINT
	// used only to check if the second polygon is
	// INSIDE the first
	polyPoint: function(vertices, px, py) {

	  	// by M. Katz based on Nirg
	  	var collision = false;
	    var minX = vertices[0].x, maxX = vertices[0].x;
	    var minY = vertices[0].y, maxY = vertices[0].y;
	    for (var n = 1; n < vertices.length; n++) {
	        var q = vertices[n];
	        minX = Math.min(q.x, minX);
	        maxX = Math.max(q.x, maxX);
	        minY = Math.min(q.y, minY);
	        maxY = Math.max(q.y, maxY);
	    }

	    if (px < minX || px > maxX || py < minY || py > maxY) {
	        return false;
	    }

	    var i = 0, j = vertices.length - 1;
	    for (i, j; i < vertices.length; j = i++) {
	        if ( (vertices[i].y > py) != (vertices[j].y > py) &&
	                px < (vertices[j].x - vertices[i].x) * (py - vertices[i].y) / (vertices[j].y - vertices[i].y) + vertices[i].x ) {
	            collision = !collision;
	        }
	    }

	    return collision;

		// Original from http://www.jeffreythompson.org/collision-detection/
		/*
	  	var collision = false;

	 	// go through each of the vertices, plus the next
	  	// vertex in the list
	  	var next = 0;
	  	for (var current=0; current<vertices.length; current++) {

	    	// get next vertex in list
	    	// if we've hit the end, wrap around to 0
	    	next = current+1;
	    	if (next == vertices.length) next = 0;

	    	// get the vars at our current position
	    	// this makes our if statement a little cleaner
	    	var vc = vertices[current];    // c for "current"
	    	var vn = vertices[next];       // n for "next"

	    	// compare position, flip 'collision' variable
	    	// back and forth
	    	if (((vc.y > py && vn.y < py) || (vc.y < py && vn.y > py)) &&
	         	(px < (vn.x-vc.x)*(py-vc.y) / (vn.y-vc.y)+vc.x)) {
	            	collision = !collision;
	    	}

	  	}

	  	return collision;
	  	*/

	},

	// CIRCLE/CIRCLE
	circleCircle: function(c1x, c1y, c1r, c2x, c2y, c2r) {

		// get distance between the circle's centers
		// use the Pythagorean Theorem to compute the distance
		var distX = c1x - c2x;
		var distY = c1y - c2y;
		var distance = Math.sqrt( (distX*distX) + (distY*distY) );

		// if the distance is less than the sum of the circle's
		// radii, the circles are touching!
		if (distance <= c1r+c2r) {
			return true;
		}
		return false;

	}

});

});