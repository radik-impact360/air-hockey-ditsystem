ig.module('game.entities.buttons.button')
.requires(
	'game.entities.others.marketjs-entity',
	'plugins.data.vector'
)
.defines(function() {
	EntityButton = EntityMarketjsEntity.extend({

		collides: ig.Entity.COLLIDES.NEVER,
		type: ig.Entity.TYPE.A,
		size: new Vector2(48,48),
		fillColor: null,
		zIndex: 95000,
		
		init:function(x,y,settings){
			this.parent(x,y,settings);
			
			if(!ig.global.wm) {
				if(!isNaN(settings.zIndex)) {
					this.zIndex=settings.zIndex;
				}
			}

			//Pick a random color
			var r=Math.floor(Math.random()*256);
			var g=Math.floor(Math.random()*256);
			var b=Math.floor(Math.random()*256);
			var a=1;
			this.fillColor = "rgba("+r+","+b+","+g+","+a+")";

		},

		clicked:function(){
			// throw "no implementation on clicked()";
		},

		clicking:function(){
			// throw "no implementation on clicking()";
		},

		released:function(){
			// throw "no implementation on released()";
		}

	});
});