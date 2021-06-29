ig.module('game.entities.menu.pop-up-tutorial')

.requires(	
	'game.entities.others.marketjs-entity',
	'game.entities.buttons.button',
	'game.entities.buttons.button-text'
)

.defines(function() {

	EntityPopUpTutorial = EntityMarketjsEntity.extend({

		// impact entity properties
		zIndex: 2,
		// marketjs entity propertis
		vertical: "center",
		horizontal: "center",
		idleSheetInfo: { sheetImage:new ig.Image('media/graphics/sprites/pop-up/bg-pop-up-xsmall.png'), sheetX:1, sheetY:1 },
		// other entity properties
		buttonClose: null,
		buttonYes: null,
		buttonNo: null,

		init: function( x, y, settings ) {		
			
			this.parent( x, y, settings );

			// create aimation
			this.idle = new ig.Animation(this.idleSheet, 1, [0], true);
			this.currentAnim = this.idle;

			// set position horizontally and vertically
			this.setPosition();
			
			// set position before first tween
			this.pos.y += ig.system.height;

			// create entities
			this.buttonClose = ig.game.spawnEntity(EntityPUTutorialButtonClose, 0, 0, {controller: this.controller});
			this.buttonYes = ig.game.spawnEntity(EntityPUTutorialButtonYes, 0, 0, {controller: this.controller, text: _STRINGS.Menu.Yes});
			this.buttonNo = ig.game.spawnEntity(EntityPUTutorialButtonNo, 0, 0, {controller: this.controller, text: _STRINGS.Menu.No});

			this.buttonPosY = this.size.y*5/6 - this.buttonNo.size.y*1/2;
								
		},

		update: function() {

			this.parent();

			// set position entities
			this.buttonClose.pos.x = this.pos.x+this.size.x - this.buttonClose.size.x*1/2;
			this.buttonClose.pos.y = this.pos.y - this.buttonClose.size.y*1/2;
			this.buttonYes.pos.x = this.pos.x+this.size.x*3/10 - this.buttonYes.size.x*1/2;
			this.buttonYes.pos.y = this.pos.y+this.buttonPosY- this.buttonYes.size.y*1/2;
			this.buttonNo.pos.x = this.pos.x+this.size.x*7/10 - this.buttonNo.size.x*1/2;
			this.buttonNo.pos.y = this.pos.y+this.buttonPosY - this.buttonNo.size.y*1/2;
			
		},

		draw: function() {

			this.parent();

			ig.system.context.save();

			// question
			var posGameMode = {x: this.pos.x+this.size.x*1/2, y: this.pos.y+this.size.y*1/4};
			ig.system.context.font = "40px sf-collegiate-solid";
            ig.system.context.fillStyle = '#FFFFFF';
            ig.system.context.textAlign = "center";
            ig.system.context.textBaseline = "top";
            ig.system.context.fillText(_STRINGS.Menu.TutorialQuestion, posGameMode.x, posGameMode.y);

            ig.system.context.restore();

		},

		easeOut: function() {

			this.tween({pos:{y: this.pos.y+ig.system.height}}, 0.3, {
				easing: ig.Tween.Easing.Linear.EaseNone,
				onComplete:function(){
				}.bind(this)
			}).start();

		},

		easeIn: function() {

			this.tween({pos:{y: this.pos.y-ig.system.height}}, 0.3, {
				easing: ig.Tween.Easing.Linear.EaseNone,
				onComplete:function(){
					ig.game.easing = false;
				}.bind(this)
			}).start();

		},
		
	});

	EntityPUTutorialButtonClose = EntityButton.extend({

		// impact entity properties
		zIndex: 3,
		// marketjs entity properties
		idleSheetInfo: { sheetImage:new ig.Image('media/graphics/sprites/buttons/button-close.png'), sheetX:1, sheetY:1 },
		scaling: true,
		// other entity properties

		init: function( x, y, settings ) {		
			
			this.parent( x, y, settings );

			// create aimation
			this.idle = new ig.Animation(this.idleSheet, 1, [0], true);
			this.currentAnim = this.idle;
					
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
								this.controller.popUpTutorial.easeOut();
								this.controller.menuTitle.easeIn();
								this.controller.puckTitle.easeIn();
								if(_SETTINGS.MoreGames.Enabled) {
									this.controller.buttonMoreGames.easeIn();
								}					
								this.controller.buttonSettings.easeIn();
								this.controller.buttonTextPlayEasy.easeIn();
								this.controller.buttonTextPlayNormal.easeIn();
								this.controller.buttonTextPlayDifficult.easeIn();
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
	
	EntityPUTutorialButtonYes = EntityButtonText.extend({

		// impact entity properties
		zIndex: 3,
		// marketjs entity properties
		idleSheetInfo: { sheetImage:new ig.Image('media/graphics/sprites/buttons/button-small.png'), sheetX:1, sheetY:1 },
		scaling: true,
		// button-text properties
		textColor: "#CC3366",
		font: "sf-collegiate-solid",
		textSize: 28,
		textPos: {x:0.48,y:0.5},
		scaling: true,
		// other entity properties

		init: function( x, y, settings ) {		
			
			this.parent( x, y, settings );

			// create aimation
			this.idle = new ig.Animation(this.idleSheet, 1, [0], true);
			this.currentAnim = this.idle;
					
		},

		clicked:function() {

			if(ig.game.easing == false) {
				// play sfx
				ig.soundHandler.sfxPlayer.play(ig.soundHandler.sfxPlayer.soundList.button);
				ig.game.easing = true; // false on puck.js => puckReady();
				this.tween({bodyScale: 0.9}, 0.1, {
					easing: ig.Tween.Easing.Linear.EaseNone,
					onComplete:function(){
						this.tween({bodyScale: 1}, 0.1, {
							easing: ig.Tween.Easing.Linear.EaseNone,
							onComplete:function() {
								////////////////////////////////////
								ig.game.playTutorial = true;
								ig.game.director.loadLevel(2);
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
	
	EntityPUTutorialButtonNo = EntityButtonText.extend({

		// impact entity properties
		zIndex: 3,
		// marketjs entity properties
		idleSheetInfo: { sheetImage:new ig.Image('media/graphics/sprites/buttons/button-small.png'), sheetX:1, sheetY:1 },
		scaling: true,
		// button-text properties
		textColor: "#CC3366",
		font: "sf-collegiate-solid",
		textSize: 28,
		textPos: {x:0.48,y:0.5},
		scaling: true,
		// other entity properties

		init: function( x, y, settings ) {		
			
			this.parent( x, y, settings );

			// create aimation
			this.idle = new ig.Animation(this.idleSheet, 1, [0], true);
			this.currentAnim = this.idle;
					
		},

		clicked:function() {

			if(ig.game.easing == false) {
				// play sfx
				ig.soundHandler.sfxPlayer.play(ig.soundHandler.sfxPlayer.soundList.button);
				ig.game.easing = true; // false on puck.js => puckReady();
				this.tween({bodyScale: 0.9}, 0.1, {
					easing: ig.Tween.Easing.Linear.EaseNone,
					onComplete:function(){
						this.tween({bodyScale: 1}, 0.1, {
							easing: ig.Tween.Easing.Linear.EaseNone,
							onComplete:function() {
								////////////////////////////////////
								ig.game.playTutorial = false;
								ig.game.director.loadLevel(2);
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