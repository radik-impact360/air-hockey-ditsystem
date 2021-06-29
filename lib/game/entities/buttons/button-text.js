ig.module('game.entities.buttons.button-text')
.requires(
	'game.entities.buttons.button',
	'plugins.data.vector'
)
.defines(function() {
	EntityButtonText = EntityButton.extend({		

		// button-text properties
		textColor: "#FFFFFF",
		text: null,
		font: null,
		textSize: 20,
		showText: true,
		textAlign: "center",
		textBaseline: "middle",
		// other entity properties
		bodyScale: 1,
		textPos: {x:0.5,y:0.5},
		
		draw: function(){
	
			this.parent();
			
			if(this.showText) {
 				this.drawText();
			}
	
		},

		drawText: function() {

			ig.system.context.save();
			ig.system.context.font = (this.textSize*this.bodyScale)+"px " + this.font;
			ig.system.context.textAlign = this.textAlign;
			ig.system.context.textBaseline = this.textBaseline;
			ig.system.context.fillStyle = this.textColor;
			ig.system.context.fillText(this.text, this.pos.x+this.size.x*this.textPos.x, this.pos.y+this.size.y*this.textPos.y);			
	    	ig.system.context.restore();

	    }
				
	});
});