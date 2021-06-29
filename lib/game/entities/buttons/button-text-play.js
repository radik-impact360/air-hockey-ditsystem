ig.module('game.entities.buttons.button-text-play')

.requires(	
	'game.entities.buttons.button-text'
)

.defines(function() {

	EntityButtonTextPlay = EntityButtonText.extend({

		// impact entity properties
		zIndex: 1,
		// marketjs entity propertis
		vertical: "center",
		horizontal: "center",
		idleSheetInfo: { sheetImage:new ig.Image('media/graphics/sprites/buttons/button-big.png'), sheetX:1, sheetY:1 },
		// button-text properties
		textColor: "#CC3366",
		font: "sf-collegiate-solid",
		textSize: 35,
		textPos: {x:0.6,y:0.5},
		scaling: true,
		// other entity properties
		playIco: new ig.Image('media/graphics/sprites/buttons/play-ico.png'),
		enable: true,

		init: function( x, y, settings ) {		
			
			this.parent( x, y, settings );

			// create aimation
			this.idle = new ig.Animation(this.idleSheet, 1, [0], true);
			this.currentAnim = this.idle;

			// set position horizontally and vertically
			this.setPosition();
			
			// set position before first tween
			this.pos.y += ig.system.height;
					
		},

		draw: function() {

			this.parent();

			ig.system.context.save();
			ig.system.context.drawImage(
				this.playIco.data,
				this.pos.x+this.size.x*1/6 - this.playIco.width*this.bodyScale/2,
				this.pos.y+this.size.y*9/20 - this.playIco.height*this.bodyScale/2,
				this.playIco.width*this.bodyScale,
				this.playIco.height*this.bodyScale
			);
	        ig.system.context.restore();

		},

		easeOut: function(playPopUp) {

			this.tween({pos:{y: this.pos.y+ig.system.height}}, 0.3, {
				easing: ig.Tween.Easing.Linear.EaseNone,
				onComplete:function(){
					if(playPopUp && ig.game.difficulty==this.difficulty) {
						this.controller.popUpTutorial.easeIn();
					}
				}.bind(this)
			}).start();

		},

		easeIn: function() {

			this.tween({pos:{y: this.pos.y-ig.system.height}}, 0.3, {
				easing: ig.Tween.Easing.Linear.EaseNone,
				onComplete:function() {
				}.bind(this)
			}).start();

		},

		clicked:function(){

			if(ig.game.easing == false && this.enable == true) {
				// play sfx
				ig.soundHandler.sfxPlayer.play(ig.soundHandler.sfxPlayer.soundList.button);
				ig.game.easing = true; // false on pop-up-setting => easeIn();
				this.tween({bodyScale: 0.8}, 0.1, {
					easing: ig.Tween.Easing.Linear.EaseNone,
					onComplete:function(){
						this.tween({bodyScale: 1}, 0.1, {
							easing: ig.Tween.Easing.Linear.EaseNone,
							onComplete:function(){
								ig.game.difficulty = this.difficulty;
								////////////////////////////////////
								this.controller.menuTitle.easeOut();
								this.controller.puckTitle.easeOut();
								if(_SETTINGS.MoreGames.Enabled) {
									this.controller.buttonMoreGames.easeOut();
								}					
								this.controller.buttonSettings.easeOut();
								this.controller.buttonTextPlayEasy.easeOut(true);
								this.controller.buttonTextPlayNormal.easeOut(true);
								this.controller.buttonTextPlayDifficult.easeOut(true);
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