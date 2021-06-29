ig.module('game.entities.buttons.button-home')

.requires(	
	'game.entities.buttons.button'
)

.defines(function() {

	EntityButtonHome = EntityButton.extend({

		// impact entity properties
		zIndex: 41,
		// marketjs entity properties
		vertical: "center",
		horizontal: "center",
		idleSheetInfo: { sheetImage:new ig.Image('media/graphics/sprites/buttons/button-home.png'), sheetX:1, sheetY:1 },
		scaling: true,
		// other entity properties

		init: function( x, y, settings ) {		
			
			this.parent( x, y, settings );

			// create aimation
			this.idle = new ig.Animation(this.idleSheet, 1, [0], true);
			this.currentAnim = this.idle;

			// set position horizontally and vertically
			this.setPosition();
					
		},

		clicked:function() {

			if(ig.game.easing == false) {
				// play sfx
				ig.soundHandler.sfxPlayer.play(ig.soundHandler.sfxPlayer.soundList.button);
				ig.game.easing = true; // false on menu-title.js => easeIn()
				this.tween({bodyScale: 0.8}, 0.1, {
					easing: ig.Tween.Easing.Linear.EaseNone,
					onComplete:function(){
						this.tween({bodyScale: 1}, 0.1, {
							easing: ig.Tween.Easing.Linear.EaseNone,
							onComplete:function(){
								////////////////////////////////////
								ig.game.isPause = false;
								ig.game.director.loadLevel(1);							
								////////////////////////////////////
							}.bind(this)
						}).start();
					}.bind(this)
				}).start();
			}

		},

		clicking:function(){
			
		},

		released:function(){
		
		}
		
	});

});