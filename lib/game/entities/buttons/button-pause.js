ig.module('game.entities.buttons.button-pause')

.requires(	
	'game.entities.buttons.button'
)

.defines(function() {

	EntityButtonPause = EntityButton.extend({

		// impact entity properties
		zIndex: 40,
		// marketjs entity properties
		vertical: "center",
		horizontal: "center",
		idleSheetInfo: { sheetImage:new ig.Image('media/graphics/sprites/buttons/button-pause.png'), sheetX:1, sheetY:1 },
		scaling: true,
		// other entity properties
		enable: true,

		init: function( x, y, settings ) {		
			
			this.parent( x, y, settings );

			// create aimation
			this.idle = new ig.Animation(this.idleSheet, 1, [0], true);
			this.currentAnim = this.idle;

			// set position horizontally and vertically
			this.setPosition();
					
		},

		update: function() {

			this.parent();

			if(this.enable) {
				this.currentAnim.alpha = 1;
			} else {
				this.currentAnim.alpha = 0.5;
			}

		},

		clicked:function() {

			if(ig.game.easing == false && this.enable == true) {
				// play sfx
				ig.soundHandler.sfxPlayer.play(ig.soundHandler.sfxPlayer.soundList.button);
				ig.game.easing = true; // false on pop-up-pause => easeIn();
				this.tween({bodyScale: 0.8}, 0.1, {
					easing: ig.Tween.Easing.Linear.EaseNone,
					onComplete:function(){
						this.tween({bodyScale: 1}, 0.1, {
							easing: ig.Tween.Easing.Linear.EaseNone,
							onComplete:function(){
								////////////////////////////////////
								this.controller.popUpPause.easeIn();
								this.enable = false;
								ig.game.isPause = true;
								if(ig.game.gameMode == 1) {
									this.controller.uiGame.gameTime.pause();
								}
								if(ig.game.gameMode == 1 && this.controller.paddleComputer.cheatTime != null) this.controller.paddleComputer.cheatTime.pause();
								////////////////////////////////////
							}.bind(this)
						}).start();
					}.bind(this)
				}).start();
			}

		},

		clicking:function() {
			
		},

		released:function() {
		
		}
		
	});

});