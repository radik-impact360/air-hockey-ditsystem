ig.module('game.entities.menu.pop-up-settings')

.requires(	
	'game.entities.others.marketjs-entity',
	'game.entities.buttons.button',
	'game.entities.buttons.button-text'
)

.defines(function() {

	EntityPopUpSettings = EntityMarketjsEntity.extend({

		// impact entity properties
		zIndex: 2,
		// marketjs entity propertis
		vertical: "center",
		horizontal: "center",
		idleSheetInfo: { sheetImage:new ig.Image('media/graphics/sprites/pop-up/bg-pop-up-big.png'), sheetX:1, sheetY:1 },
		// other entity properties
		bgTitle: new ig.Image('media/graphics/sprites/pop-up/bg-pop-up-title.png'),
		icoBgm: new ig.Image('media/graphics/sprites/pop-up/ico-bgm.png'),
		icoSfx: new ig.Image('media/graphics/sprites/pop-up/ico-sfx.png'),
		buttonClose: null,
		buttonClassic: null,
		buttonTimed: null,
		buttonGameModeoptions: [],
		barBgm: null,
		barSfx: null,

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
			this.buttonClose = ig.game.spawnEntity(EntityPUSettingsButtonClose, 0, 0, {controller: this.controller});
			switch(ig.game.gameMode) {
            	case 0 :
            		var buttonClassicEnable = false;
            		var buttonTimedEnable = true;
            	break;
            	case 1 :
            		var buttonClassicEnable = true;
            		var buttonTimedEnable = false;
            	break;
            }
			this.buttonClassic = ig.game.spawnEntity(EntityPUSettingsButtonClassic, 0, 0, {controller: this.controller, text: _STRINGS.Menu.GameModeClassic, enable: buttonClassicEnable});
			this.buttonTimed = ig.game.spawnEntity(EntityPUSettingsButtonTimed, 0, 0, {controller: this.controller, text: _STRINGS.Menu.GameModeTimed, enable: buttonTimedEnable});
			for (var i = 0; i < 3; i++) {
				if(i == ig.game.gameModeOptions) {
					var buttonGameModeoptionsEnable = false;
				} else {					
					var buttonGameModeoptionsEnable = true;
				}
				this.buttonGameModeoptions[i] = ig.game.spawnEntity(EntityPUSettingsButtonGameModeOptions, 0, 0, {controller: this.controller, index: i, enable: buttonGameModeoptionsEnable});
			}
			this.barBgm = ig.game.spawnEntity(EntityPUSettingsBarBgm, 0, 0, {controller: this.controller});
			this.barSfx = ig.game.spawnEntity(EntityPUSettingsBarSfx, 0, 0, {controller: this.controller});
					
		},

		update: function() {

			this.parent();

			// set position entities
			this.buttonClose.pos.x = this.pos.x+this.size.x - this.buttonClose.size.x*1/2;
			this.buttonClose.pos.y = this.pos.y - this.buttonClose.size.y*1/2;
			this.barBgm.pos.x = this.pos.x+this.size.x*9/10 - this.barBgm.size.x;
			this.barBgm.pos.y = this.pos.y+this.size.y*4.5/20 - this.barBgm.size.y*1/2;
			this.barSfx.pos.x = this.pos.x+this.size.x*9/10 - this.barSfx.size.x;
			this.barSfx.pos.y = this.pos.y+this.size.y*6.5/20 - this.barSfx.size.y*1/2;
			this.buttonClassic.pos.x = this.pos.x+this.size.x*3/10 - this.buttonClassic.size.x*1/2;
			this.buttonClassic.pos.y = this.pos.y+this.size.y*11.4/20 - this.buttonClassic.size.y*1/2;
			this.buttonTimed.pos.x = this.pos.x+this.size.x*7/10 - this.buttonTimed.size.x*1/2;
			this.buttonTimed.pos.y = this.pos.y+this.size.y*11.4/20 - this.buttonTimed.size.y*1/2;
			var buttonGameModeoptionsPosX = [1,2.5,4];
			for (var i = 0; i < 3; i++) {
				this.buttonGameModeoptions[i].pos.x = this.pos.x+this.size.x*buttonGameModeoptionsPosX[i]/5 - this.buttonGameModeoptions[i].size.x*1/2;
				this.buttonGameModeoptions[i].pos.y = this.pos.y+this.size.y*18/20 - this.buttonGameModeoptions[i].size.y*1/2;
			}

		},

		draw: function() {

			this.parent();

			ig.system.context.save();

			// title
			var posTitle = {x: this.pos.x+this.size.x*1/2, y: this.pos.y+this.size.y*1/20};
			ig.system.context.drawImage(
				this.bgTitle.data,
				posTitle.x - this.bgTitle.width*this.bodyScale/2,
				posTitle.y,
				this.bgTitle.width*this.bodyScale,
				this.bgTitle.height*this.bodyScale
			);
			ig.system.context.font = "40px sf-collegiate-solid";
            ig.system.context.fillStyle = '#FFFFFF';
            ig.system.context.textAlign = "center";
            ig.system.context.textBaseline = "middle";
            ig.system.context.fillText(_STRINGS.Menu.PopUpSettingsTitle, posTitle.x, posTitle.y + this.bgTitle.height*this.bodyScale/2);

            // game mode text
			var posGameMode = {x: this.pos.x+this.size.x*1/2, y: this.pos.y+this.size.y*9/20};
			ig.system.context.font = "33px sf-collegiate-solid";
            ig.system.context.fillStyle = '#FFFFFF';
            ig.system.context.textAlign = "center";
            ig.system.context.textBaseline = "middle";
            ig.system.context.fillText(_STRINGS.Menu.GameMode, posGameMode.x, posGameMode.y);

            // game mode options text
			var posGameModeOptions1 = {x: this.pos.x+this.size.x*1/2, y: this.pos.y+this.size.y*14/20};
			ig.system.context.font = "33px sf-collegiate-solid";
            ig.system.context.fillStyle = '#FFFFFF';
            ig.system.context.textAlign = "center";
            ig.system.context.textBaseline = "middle";
            ig.system.context.fillText(_STRINGS.Menu.GameModeOptions, posGameModeOptions1.x, posGameModeOptions1.y);
 			
 			// game mode options text
			var posGameModeOptions2 = {x: this.pos.x+this.size.x*1/2, y: this.pos.y+this.size.y*15.5/20};
			ig.system.context.font = "33px sf-collegiate-solid";
            ig.system.context.fillStyle = '#FFFFFF';
            ig.system.context.textAlign = "center";
            ig.system.context.textBaseline = "middle";
            switch(ig.game.gameMode) {
            	case 0 :
            		var gameModeOptionsText = _STRINGS.Menu.GameModeOptionsClassic;
            	break;
            	case 1 :
            		var gameModeOptionsText = _STRINGS.Menu.GameModeOptionsTimed;
            	break;
            }
            ig.system.context.fillText(gameModeOptionsText, posGameModeOptions2.x, posGameModeOptions2.y);

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
	
	EntityPUSettingsButtonClose = EntityButton.extend({

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
								this.controller.popUpSettings.easeOut();
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

	EntityPUSettingsBar = EntityButton.extend({

		// impact entity properties
		zIndex: 3,
		// marketjs entity properties
		idleSheetInfo: { sheetImage:new ig.Image('media/graphics/sprites/pop-up/sound-bar-bg.png'), sheetX:1, sheetY:1 },
		// other entity properties
		bar: new ig.Image('media/graphics/sprites/pop-up/sound-bar.png'),
		volume: 1, // 0 - 1

		init: function( x, y, settings ) {		
			
			this.parent( x, y, settings );

			// create aimation
			this.idle = new ig.Animation(this.idleSheet, 1, [0], true);
			this.currentAnim = this.idle;
					
		},

		update: function() {

			this.parent();
						
			if(this.move) {

				// get data from cursor
				cursorX = ig.game.io.getClickPos().x-this.pos.x;
				if(cursorX < 0) {
					cursorX = 0;
				} else if(cursorX > this.size.x) {
					cursorX = this.size.x;
				}
				this.volume = cursorX / this.size.x;
				
				// set after click
				if(ig.input.released("click")) {
					// play sfx
					ig.soundHandler.sfxPlayer.play(ig.soundHandler.sfxPlayer.soundList.button);
					this.updateTarget();
					this.move = false;
				}

			}

		},

		draw: function() {

			this.parent();

			if( this.volume > 0 ) {				
				ig.system.context.save();
				var imgWidth = this.volume > 100 ? 100 : this.volume;
				ig.system.context.drawImage(
					this.bar.data,
					0,
					0,
					this.bar.width*imgWidth,
					this.bar.height,
					this.pos.x+this.size.x*1/2 - this.bar.width*this.bodyScale/2,
					this.pos.y+this.size.y*1/2 - this.bar.height*this.bodyScale/2,
					this.bar.width*this.bodyScale*imgWidth,
					this.bar.height*this.bodyScale
				);
	            ig.system.context.restore();
			}

		},

		clicked:function() {

			if(ig.game.easing == false) {
				// play sfx
				ig.soundHandler.sfxPlayer.play(ig.soundHandler.sfxPlayer.soundList.button);
				this.move = true;
			}

		},

		clicking:function() {
			
		},

		released:function() {
		
		},
	
		updateTarget: function() {
			// update volume game and local storage here
		}
		
	});

	EntityPUSettingsBarBgm = EntityPUSettingsBar.extend({

		// other entity properties
		ico: new ig.Image('media/graphics/sprites/pop-up/ico-bgm.png'),

		init: function( x, y, settings ) {		
			
			this.parent( x, y, settings );

			this.volume = ig.game.volumeBgm;
					
		},

		update: function() {

			this.parent();
			
			if(this.move) {
				// update volume game
				ig.game.volumeBgm = this.volume;

	            // Set volume
	            ig.soundHandler.bgmPlayer.volume(ig.game.volumeBgm);
	        }
		
		},

		draw: function() {

			this.parent();

			ig.system.context.save();
			ig.system.context.drawImage(
				this.ico.data,
				this.controller.popUpSettings.pos.x+this.controller.popUpSettings.size.x*1/10,
				this.pos.y+this.size.y*1/2 - this.ico.height*this.bodyScale/2,
				this.ico.width*this.bodyScale,
				this.ico.height*this.bodyScale
			);
            ig.system.context.restore();

		},
	
		updateTarget: function() {
			// update local storage
			ig.game.save("volumeBgm", this.volume);
		}
		
	});

	EntityPUSettingsBarSfx = EntityPUSettingsBar.extend({

		// other entity properties
		ico: new ig.Image('media/graphics/sprites/pop-up/ico-sfx.png'),

		init: function( x, y, settings ) {		
			
			this.parent( x, y, settings );

			this.volume = ig.game.volumeSfx;
					
		},

		update: function() {

			this.parent();
			
			if(this.move) {
				// update volume game
				ig.game.volumeSfx = this.volume;

				// Set volume
	            ig.soundHandler.sfxPlayer.volume(ig.game.volumeSfx);
	        }			
		
		},

		draw: function() {

			this.parent();

			ig.system.context.save();
			ig.system.context.drawImage(
				this.ico.data,
				this.controller.popUpSettings.pos.x+this.controller.popUpSettings.size.x*1/10,
				this.pos.y+this.size.y*1/2 - this.ico.height*this.bodyScale/2,
				this.ico.width*this.bodyScale,
				this.ico.height*this.bodyScale
			);
            ig.system.context.restore();

		},
	
		updateTarget: function() {
			// update local storage
			ig.game.save("volumeSfx", this.volume);
		}
		
	});

	EntityPUSettingsButtonClassic = EntityButtonText.extend({

		// impact entity properties
		zIndex: 3,
		// marketjs entity propertis
		vertical: "center",
		horizontal: "center",
		idleSheetInfo: { sheetImage:new ig.Image('media/graphics/sprites/buttons/button-small.png'), sheetX:1, sheetY:1 },
		// button-text properties
		textColor: "#CC3366",
		font: "sf-collegiate-solid",
		textSize: 28,
		textPos: {x:0.48,y:0.5},
		scaling: true,
		// other entity properties
		enable: null,
		disableSprite: new ig.Image('media/graphics/sprites/buttons/button-small-disable.png'),

		init: function( x, y, settings ) {		
			
			this.parent( x, y, settings );

			// create aimation
			this.idle = new ig.Animation(this.idleSheet, 1, [0], true);
			this.currentAnim = this.idle;
					
		},

		draw: function() {

			this.parent();

			if(this.enable == false) {				
				ig.system.context.save();
				ig.system.context.drawImage(
					this.disableSprite.data,
					this.pos.x+this.size.x*1/2 - this.disableSprite.width*this.bodyScale/2,
					this.pos.y+this.size.y*1/2 - this.disableSprite.height*this.bodyScale/2,
					this.disableSprite.width*this.bodyScale,
					this.disableSprite.height*this.bodyScale
				);
	            ig.system.context.restore();
			}

		},

		clicked:function(){

			if(ig.game.easing == false && this.enable == true) {
				// play sfx
				ig.soundHandler.sfxPlayer.play(ig.soundHandler.sfxPlayer.soundList.button);
				ig.game.easing = true;
				this.tween({bodyScale: 0.9}, 0.1, {
					easing: ig.Tween.Easing.Linear.EaseNone,
					onComplete:function(){
						this.tween({bodyScale: 1}, 0.1, {
							easing: ig.Tween.Easing.Linear.EaseNone,
							onComplete:function() {
								////////////////////////////////////
								ig.game.gameMode = 0;
								ig.game.save("gameMode", 0);
								this.enable = false;
								this.controller.popUpSettings.buttonTimed.enable = true;
								////////////////////////////////////
								ig.game.easing = false;
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

	EntityPUSettingsButtonTimed = EntityButtonText.extend({

		// impact entity properties
		zIndex: 3,
		// marketjs entity propertis
		vertical: "center",
		horizontal: "center",
		idleSheetInfo: { sheetImage:new ig.Image('media/graphics/sprites/buttons/button-small.png'), sheetX:1, sheetY:1 },
		// button-text properties
		textColor: "#CC3366",
		font: "sf-collegiate-solid",
		textSize: 28,
		textPos: {x:0.48,y:0.5},
		scaling: true,
		// other entity properties
		enable: null,
		disableSprite: new ig.Image('media/graphics/sprites/buttons/button-small-disable.png'),

		init: function( x, y, settings ) {		
			
			this.parent( x, y, settings );

			// create aimation
			this.idle = new ig.Animation(this.idleSheet, 1, [0], true);
			this.currentAnim = this.idle;
					
		},

		draw: function() {

			this.parent();

			if(this.enable == false) {				
				ig.system.context.save();
				ig.system.context.drawImage(
					this.disableSprite.data,
					this.pos.x+this.size.x*1/2 - this.disableSprite.width*this.bodyScale/2,
					this.pos.y+this.size.y*1/2 - this.disableSprite.height*this.bodyScale/2,
					this.disableSprite.width*this.bodyScale,
					this.disableSprite.height*this.bodyScale
				);
	            ig.system.context.restore();
			}

		},

		clicked:function(){

			if(ig.game.easing == false && this.enable == true) {
				// play sfx
				ig.soundHandler.sfxPlayer.play(ig.soundHandler.sfxPlayer.soundList.button);
				ig.game.easing = true;
				this.tween({bodyScale: 0.9}, 0.1, {
					easing: ig.Tween.Easing.Linear.EaseNone,
					onComplete:function(){
						this.tween({bodyScale: 1}, 0.1, {
							easing: ig.Tween.Easing.Linear.EaseNone,
							onComplete:function() {
								////////////////////////////////////
								ig.game.gameMode = 1;
								ig.game.save("gameMode", 1);
								this.enable = false;
								this.controller.popUpSettings.buttonClassic.enable = true;
								////////////////////////////////////
								ig.game.easing = false;
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

	EntityPUSettingsButtonGameModeOptions = EntityButtonText.extend({

		// impact entity properties
		zIndex: 3,
		// marketjs entity propertis
		vertical: "center",
		horizontal: "center",
		idleSheetInfo: { sheetImage:new ig.Image('media/graphics/sprites/buttons/button-box.png'), sheetX:1, sheetY:1 },
		// button-text properties
		textColor: "#CC3366",
		font: "sf-collegiate-solid",
		textSize: 30,
		textPos: {x:0.5,y:0.5},
		scaling: true,
		// other entity properties
		enable: null,
		disableSprite: new ig.Image('media/graphics/sprites/buttons/button-box-disable.png'),

		init: function( x, y, settings ) {		
			
			this.parent( x, y, settings );

			// create aimation
			this.idle = new ig.Animation(this.idleSheet, 1, [0], true);
			this.currentAnim = this.idle;
					
		},

		update: function() {

			this.parent();

			switch(ig.game.gameMode) {
            	case 0 :
            		this.text = ig.game.classic[this.index];
            	break;
            	case 1 :
            		this.text = ig.game.timed[this.index];
            	break;
            }

		},

		draw: function() {

			this.parent();

			if(this.enable == false) {				
				ig.system.context.save();
				ig.system.context.drawImage(
					this.disableSprite.data,
					this.pos.x+this.size.x*1/2 - this.disableSprite.width*this.bodyScale/2,
					this.pos.y+this.size.y*1/2 - this.disableSprite.height*this.bodyScale/2,
					this.disableSprite.width*this.bodyScale,
					this.disableSprite.height*this.bodyScale
				);
	            ig.system.context.restore();
			}

		},

		clicked:function() {

			if(ig.game.easing == false && this.enable == true) {
				// play sfx
				ig.soundHandler.sfxPlayer.play(ig.soundHandler.sfxPlayer.soundList.button);
				ig.game.easing = true;
				this.tween({bodyScale: 0.9}, 0.1, {
					easing: ig.Tween.Easing.Linear.EaseNone,
					onComplete:function(){
						this.tween({bodyScale: 1}, 0.1, {
							easing: ig.Tween.Easing.Linear.EaseNone,
							onComplete:function() {
								////////////////////////////////////
								ig.game.gameModeOptions = this.index;								
								ig.game.save("gameModeOptions", this.index);
								this.enable = false;
								for (var i = 0; i < 3; i++) {
									if(i != ig.game.gameModeOptions) {										
										this.controller.popUpSettings.buttonGameModeoptions[i].enable = true;
									}
								}
								////////////////////////////////////
								ig.game.easing = false;
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