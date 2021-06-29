ig.module('game.entities.menu.menu-title')

.requires(	
	'game.entities.others.marketjs-entity'
)

.defines(function() {

	EntityMenuTitle = EntityMarketjsEntity.extend({

		// impact entity properties
		zIndex: 1,
		// marketjs entity propertis
		vertical: "center",
		horizontal: "center",
		idleSheetInfo: { sheetImage:new ig.Image('media/graphics/sprites/menu/menu-title.png'), sheetX:1, sheetY:1 },
		// other entity properties

		init: function( x, y, settings ) {		
			
			this.parent( x, y, settings );

			// create aimation
			this.idle = new ig.Animation(this.idleSheet, 1, [0], true);
			this.currentAnim = this.idle;

			// set position horizontally and vertically
			this.setPosition();
			
			// set position before first tween
			this.pos.x += ig.system.width;
					
		},

		easeOut: function() {

			this.tween({pos:{x:this.pos.x+ig.system.width}}, 0.3, {
				easing: ig.Tween.Easing.Linear.EaseNone,
				onComplete:function(){
				}.bind(this)
			}).start();

		},

		easeIn: function() {

			this.tween({pos:{x:this.pos.x-ig.system.width}}, 0.3, {
				easing: ig.Tween.Easing.Linear.EaseNone,
				onComplete:function(){
					ig.game.easing = false;
				}.bind(this)
			}).start();

		}
		
	});

});