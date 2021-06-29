// This Entity implemented 
// plugins/collision.js

// Notes :
// - 
// by Ghozi Septiandri
// ghozi.septiandri@impact360design.com

ig.module('game.entities.others.marketjs-entity')

.requires(
	'impact.entity'
)

.defines(function() {

	EntityMarketjsEntity = ig.Entity.extend({
		
		// original pos from begining spawn
		oriPos: {x:null,y:null},
		// entity will be kill after position out of game screen
		killOutLayer: false,
		// define image for animation
		idleSheetInfo: null,
		// vertices to draw body (for Collision/SAT check)
		vertices: [],
		// draw body from vertices (for Collision/SAT check)
		drawShape: false,
		// for set position in function setPosition()
		vertical: null,
		horizontal: null,
		// for scalinng => add 'plugins.scale' in main.js
		scaling: false,
		bodyScale: 1,		
		// radius to draw body (for Collision/SAT check)
		radius: 0,
		
		init: function( x, y, settings ) {

			// for animation and scaling
			if(this.idleSheetInfo != null) {			
				this.setSpriteSheet("idle");
				this.setSize("idle");
			}
			
			this.parent( x, y, settings );			
			
			this.oriPos.x = this.pos.x;
			this.oriPos.y = this.pos.y;
			   					
		},
	    
		update: function() {
			
			this.parent();
			
			// outlayer position check
			this.killOutOfLayer();

			// for scaling size	
			if(this.scaling == true) {
				this.setScale(this.bodyScale, this.bodyScale);
			}
					
		},

		draw: function() {

			this.parent();

			// draw stroke for SAT collision check
            this.drawStrokeBody();

		},

		drawStrokeBody: function() {
			
			if(this.drawShape == true || (ig.game.drawShape != undefined && ig.game.drawShape == true)) {
				
				if(this.vertices.length > 0) {	
		            ig.system.context.save();
					ig.system.context.translate( -ig.game.screen.x, -ig.game.screen.y );
					ig.system.context.beginPath();
		            ig.system.context.strokeStyle = 'rgba(255,0,0,1)';
					ig.system.context.moveTo(this.pos.x+this.vertices[0].x*this.bodyScale,this.pos.y+this.vertices[0].y*this.bodyScale);
					for(var i=1; i<this.vertices.length; i++) {
						ig.system.context.lineTo(this.pos.x+this.vertices[i].x*this.bodyScale,this.pos.y+this.vertices[i].y*this.bodyScale);
					}
					ig.system.context.lineTo(this.pos.x+this.vertices[0].x*this.bodyScale,this.pos.y+this.vertices[0].y*this.bodyScale);
					ig.system.context.stroke();
		            ig.system.context.restore();
				} else if(this.radius > 0) {
					ig.system.context.save();
	            	ig.system.context.beginPath();		    
				    ig.system.context.arc(this.pos.x+this.size.x/2, this.pos.y+this.size.y/2, this.radius*this.bodyScale, 0, 2 * Math.PI, false);
				    ig.system.context.lineWidth = 2;
				   	ig.system.context.strokeStyle = 'rgba(255,0,0,1)';
				    ig.system.context.stroke();
	            	ig.system.context.restore();
	            }
	            
            }

		},

		rotateVertices: function() {
			
			for(var i=0; i<this.vertices.length; i++) {
				 this.vertices[i] = this.getPoint(this.size.x/2, this.size.y/2, this.vertices[i].x, this.vertices[i].y, -this.toAngle.toRad());
			}

		},		

		getPoint: function(cx, cy, x, y, toAngle) {

	        cos = Math.cos(toAngle),
	        sin = Math.sin(toAngle),
	        nx = (cos * (x - cx)) + (sin * (y - cy)) + cx,
	        ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;

	    	return {x : nx, y : ny};

		},

		// get body shape for SAT collision from vertices
		getSAT: function() {

			var tempVartices = [];
			for (var i = 0; i<this.vertices.length; i++) {
				tempVartices[i] = {x:this.pos.x+this.vertices[i].x*this.bodyScale,y:this.pos.y+this.vertices[i].y*this.bodyScale};
			}
			return new ig.SAT.Shape(tempVartices);

		},

		// get body shape for collision from vertices
		getVertices: function() {

			var tempVartices = [];
			for (var i = 0; i<this.vertices.length; i++) {
				tempVartices[i] = {x:this.pos.x+this.vertices[i].x*this.bodyScale,y:this.pos.y+this.vertices[i].y*this.bodyScale};
			}
			return tempVartices;

		},
		/*
		// get body circle for collision from vertices
		getCircle: function() {

			var tempCircle = {
				cx: this.pos.x + this.size.x/2,
				cy: this.pos.y + this.size.y/2,
				r: this.radius*this.bodyScale
			}

			return tempCircle;

		},
		*/
	
		killOutOfLayer: function() {
			
			// Kill out of screen
			if(this.killOutLayer != false) {
				if(this.pos.x < ig.game.screen.x-this.size.x || this.pos.x > ig.game.screen.x+ig.system.width || this.pos.y < ig.game.screen.y-this.size.y || this.pos.y > ig.game.screen.y+ig.system.height) {
					console.log("kill outside layer");
					this.kill();
				}
			}
			
		},
		
		setSpriteSheet: function(state) {
			
			this[state+"Sheet"]=new ig.AnimationSheet(this[state+"SheetInfo"].sheetImage.path,
			this[state+"SheetInfo"].sheetImage.width/this[state+"SheetInfo"].sheetX,
			this[state+"SheetInfo"].sheetImage.height/this[state+"SheetInfo"].sheetY);
			
		},
		
		setSize: function(state) {
			
			this.size.x=this[state+"SheetInfo"].sheetImage.width/this[state+"SheetInfo"].sheetX;		
			this.size.y=this[state+"SheetInfo"].sheetImage.height/this[state+"SheetInfo"].sheetY;
			
		},
		
		setPosition: function() {
			
			if(this.horizontal == "center") {
				this.pos.x = this.pos.x-this.size.x/2;
			} else if(this.horizontal == "left") {
				this.pos.x = this.pos.x;
			} else if(this.horizontal == "right") {
				this.pos.x = this.pos.x-this.size.x;
			}
			
			if(this.vertical == "center") {
				this.pos.y = this.pos.y-this.size.y/2;
			} else if(this.vertical == "top") {
				this.pos.y = this.pos.y;
			} else if(this.vertical == "bottom") {
				this.pos.y = this.pos.y-this.size.y;
			}
			
		}
	
	});
});