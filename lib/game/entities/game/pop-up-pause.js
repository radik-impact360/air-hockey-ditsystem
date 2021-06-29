ig.module('game.entities.game.pop-up-pause')

.requires(	
	'game.entities.others.marketjs-entity',
	'game.entities.buttons.button',
	'game.entities.buttons.button-text'
)

.defines(function() {

	EntityPopUpPause = EntityMarketjsEntity.extend({

		// impact entity properties
		zIndex: 40,
		// marketjs entity propertis
		vertical: "center",
		horizontal: "center",
		idleSheetInfo: { sheetImage:new ig.Image('media/graphics/sprites/pop-up/bg-pop-up-small.png'), sheetX:1, sheetY:1 },
		// other entity properties
		bgTitle: new ig.Image('media/graphics/sprites/pop-up/bg-pop-up-title.png'),
		icoBgm: new ig.Image('media/graphics/sprites/pop-up/ico-bgm.png'),
		icoSfx: new ig.Image('media/graphics/sprites/pop-up/ico-sfx.png'),
		buttonClose: null,
		barBgm: null,
		barSfx: null,
		buttonHome: null,
		buttonResume: null,
		buttonRestart: null,
		buttonGameModeoptions: [],

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
			this.barBgm = ig.game.spawnEntity(EntityPUPauseBarBgm, ig.system.width, ig.system.height, {controller: this.controller});
			this.barSfx = ig.game.spawnEntity(EntityPUPauseBarSfx, ig.system.width, ig.system.height, {controller: this.controller});
			this.buttonHome = ig.game.spawnEntity(EntityButtonHome, ig.system.width, ig.system.height, {controller: this.controller});
			this.buttonResume = ig.game.spawnEntity(EntityButtonResume, ig.system.width, ig.system.height, {controller: this.controller});
			this.buttonRestart = ig.game.spawnEntity(EntityButtonRestart, ig.system.width, ig.system.height, {controller: this.controller});
			
		},

		update: function() {

			this.parent();

			// set position entities
			this.barBgm.pos.x = this.pos.x+this.size.x*9/10 - this.barBgm.size.x;
			this.barBgm.pos.y = this.pos.y+this.size.y*8/20 - this.barBgm.size.y*1/2;
			this.barSfx.pos.x = this.pos.x+this.size.x*9/10 - this.barSfx.size.x;
			this.barSfx.pos.y = this.pos.y+this.size.y*11/20 - this.barSfx.size.y*1/2;
			this.buttonHome.pos.x = this.pos.x+this.size.x*1/5 - this.buttonHome.size.x*1/2;
			this.buttonHome.pos.y = this.pos.y+this.size.y*16.8/20 - this.buttonHome.size.y*1/2;
			this.buttonResume.pos.x = this.pos.x+this.size.x*2.5/5 - this.buttonResume.size.x*1/2;
			this.buttonResume.pos.y = this.pos.y+this.size.y*16.8/20 - this.buttonResume.size.y*1/2;
			this.buttonRestart.pos.x = this.pos.x+this.size.x*4/5 - this.buttonRestart.size.x*1/2;
			this.buttonRestart.pos.y = this.pos.y+this.size.y*16.8/20 - this.buttonRestart.size.y*1/2;
			
		},

		draw: function() {

			this.parent();

			ig.system.context.save();

			// title
			var posTitle = {x: this.pos.x+this.size.x*1/2, y: this.pos.y+this.size.y*1.5/20};
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
            ig.system.context.fillText(_STRINGS.Game.PopUpPauseTitle, posTitle.x, posTitle.y + this.bgTitle.height*this.bodyScale/2);

            ig.system.context.restore();

		},

		easeOut: function() {

			this.tween({pos:{y: this.pos.y+ig.system.height}}, 0.3, {
				easing: ig.Tween.Easing.Linear.EaseNone,
				onComplete:function(){	
					ig.game.easing = false;	
					this.controller.buttonPause.enable = true;
					ig.game.isPause = false;
					if(ig.game.gameMode == 1) {
						this.controller.uiGame.gameTime.unpause();
					}
					if(ig.game.gameMode == 1 && this.controller.paddleComputer.cheatTime != null) this.controller.paddleComputer.cheatTime.unpause();
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

	EntityPUPauseBar = EntityButton.extend({

		// impact entity properties
		zIndex: 41,
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

	EntityPUPauseBarBgm = EntityPUPauseBar.extend({

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
				this.controller.popUpPause.pos.x+this.controller.popUpPause.size.x*1/10,
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

	EntityPUPauseBarSfx = EntityPUPauseBar.extend({

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
				this.controller.popUpPause.pos.x+this.controller.popUpPause.size.x*1/10,
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

});