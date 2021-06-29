ig.module('game.entities.buttons.button-settings')

.requires(	
	'game.entities.buttons.button'
)

.defines(function() {

	EntityButtonSettings = EntityButton.extend({

		// impact entity properties
		zIndex: 2,
		// marketjs entity properties
		vertical: "center",
		horizontal: "center",
		idleSheetInfo: { sheetImage:new ig.Image('media/graphics/sprites/buttons/button-settings.png'), sheetX:1, sheetY:1 },
		scaling: true,
		// other entity properties
		hand: new ig.Image('media/graphics/sprites/game/hand.png'),
		handOffsetY: 0,

		init: function( x, y, settings ) {		
			
			this.parent( x, y, settings );

			// create aimation
			this.idle = new ig.Animation(this.idleSheet, 1, [0], true);
			this.currentAnim = this.idle;

			// set position horizontally and vertically
			this.setPosition();

			// set position hand
			this.handPos = {
				x: this.pos.x+this.size.x/2 - this.hand.width/2,
				y: this.pos.y+this.size.y + this.hand.height/5
			};

			// set position text
			this.textPos = {
				x: this.pos.x-this.size.x/8,
				y: this.pos.y+this.size.y/6
			};
			this.textSize = this.size.x*3.7;
			
			// set position before first tween
			this.pos.y -= ig.system.height;

		},

		draw: function() {

			if(this.drawPointer) {

				ig.system.context.save();
				// draw transparent background
				ig.system.context.fillStyle = '#000000';
				ig.system.context.globalAlpha = 0.7;
				ig.system.context.fillRect(0, 0, ig.system.width, ig.system.height);
				// draw hand
				ig.system.context.globalAlpha = 1;
				this.hand.draw(this.handPos.x, this.handPos.y + this.handOffsetY);
				// draw text
				ig.system.context.globalAlpha = 1;
				ig.system.context.font = "30px sf-collegiate-solid";
				ig.system.context.textAlign = "right";
				ig.system.context.textBaseline = "top";
				ig.system.context.fillStyle = "#ffffff";
				this.wrapText(
					ig.system.context,
					_STRINGS.Menu.SetGameMode,
					this.textPos.x,
					this.textPos.y,
					this.textSize,
					30
				);				
		        ig.system.context.restore();
				
			}

			this.parent();

		},
		
		wrapText:function(context, text, x, y, maxWidth, lineHeight) {

			var breaks = text.split('\n');
			var newLines = "";
			for(var i = 0; i < breaks.length; i ++){
				newLines = newLines + breaks[i] + ' breakLine ';
			}
			var words = newLines.split(' ');
			var textline = '';
			for(var n = 0; n < words.length; n++) {
				if(words[n] != 'breakLine'){
					var testLine = textline + words[n] + ' ';
					var metrics = context.measureText(testLine);
					var testWidth = metrics.width;
					if (testWidth > maxWidth && n > 0) {
						context.fillText(textline, x, y);
						textline = words[n] + ' ';
						y += lineHeight;
					}
					else {
						textline = testLine;
					}
				}else{
				  context.fillText(textline, x, y);
				  textline = '';
				  y += lineHeight;
				}
			}
			context.fillText(textline, x, y);

		},

		easeOut: function(playPopUp) {

			this.tween({pos:{y: this.pos.y-ig.system.height}}, 0.3, {
				easing: ig.Tween.Easing.Linear.EaseNone,
				onComplete:function(){
					if(playPopUp) {
						this.controller.popUpSettings.easeIn();
					} 
				}.bind(this)
			}).start();

		},

		easeIn: function() {

			this.tween({pos:{x: ig.system.width*9/10 - this.size.x*1/2, y: ig.system.height*1/20-this.size.y*1/2}}, 0.3, {
				easing: ig.Tween.Easing.Linear.EaseNone,
				onComplete:function(){
					if(ig.game.firstPlay) {
						this.drawPointer = true;
						if(_SETTINGS.MoreGames.Enabled) {
							this.controller.buttonMoreGames.hide();
						}
						this.controller.buttonTextPlayEasy.enable = false;
						this.controller.buttonTextPlayNormal.enable = false;
						this.controller.buttonTextPlayDifficult.enable = false;
						this.easeHandOffsetY(50);
					}
				}.bind(this)
			}).start();

		},

		easeHandOffsetY: function(offsetY) {
			this.tween({handOffsetY:offsetY}, 0.4, {
				easing: ig.Tween.Easing.Linear.EaseNone,
				onComplete:function(){
					if(this.drawPointer) {
						if(offsetY==0)
							this.easeHandOffsetY(50);
						else 
							this.easeHandOffsetY(0);
					}
				}.bind(this)
			}).start();
		},

		clicked:function(){

			if(ig.game.easing == false) {
				// play sfx
				ig.soundHandler.sfxPlayer.play(ig.soundHandler.sfxPlayer.soundList.button);
				ig.game.easing = true; // false on pop-up-setting => easeIn();
				this.tween({bodyScale: 0.8}, 0.1, {
					easing: ig.Tween.Easing.Linear.EaseNone,
					onComplete:function(){
						this.tween({bodyScale: 1}, 0.1, {
							easing: ig.Tween.Easing.Linear.EaseNone,
							onComplete:function(){
								if(ig.game.firstPlay) {
									this.drawPointer = false;									
									if(_SETTINGS.MoreGames.Enabled) {
										this.controller.buttonMoreGames.show();
									}
									this.controller.buttonTextPlayEasy.enable = true;
									this.controller.buttonTextPlayNormal.enable = true;
									this.controller.buttonTextPlayDifficult.enable = true;
									ig.game.firstPlay = false;
									// update local storage
									ig.game.save("firstPlay", false);
								}
								////////////////////////////////////
								this.controller.menuTitle.easeOut();
								this.controller.puckTitle.easeOut();
								if(_SETTINGS.MoreGames.Enabled) {
									this.controller.buttonMoreGames.easeOut();
								}					
								this.controller.buttonSettings.easeOut(true);
								this.controller.buttonTextPlayEasy.easeOut();
								this.controller.buttonTextPlayNormal.easeOut();
								this.controller.buttonTextPlayDifficult.easeOut();
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