ig.module('game.entities.game.tutorial-step')

.requires(
    'game.entities.others.marketjs-entity',
	'game.entities.buttons.button-text'
)

.defines(function() {

	EntityTutorialStep = EntityMarketjsEntity.extend({

		// impact entity properties
		zIndex: 50,
		// marketjs entity propertis
		vertical: "center",
		horizontal: "center",
		idleSheetInfo: { sheetImage:new ig.Image('media/graphics/sprites/pop-up/bg-pop-up-xsmall.png'), sheetX:1, sheetY:1 },
		bodyScale: 0.7,
		scaling: true,
		// other entity properties
		buttonNext: null,
		buttonReady: null,
		text: null,
		lastTutorial: null,

		init: function( x, y, settings ) {		
			
			this.parent( x, y, settings );

			// create aimation
			this.idle = new ig.Animation(this.idleSheet, 1, [0], true);
			// set position based on vertically and horizontally
			this.setPosition();
			this.currentAnim = this.idle;

			// define last tutorial step
			if(this.lastTutorial == true) {				
				this.buttonReady = ig.game.spawnEntity(EntityButtonTextTSReady, 0, 0, {text: _STRINGS.Game.ButtonReady, controller: this.controller});
			} else {				
				this.buttonNext = ig.game.spawnEntity(EntityButtonTextTSNext, 0, 0, {text: _STRINGS.Game.ButtonNext, controller: this.controller});
			}
			
			// first tween
			this.pos.y += ig.system.height;
			this.easeIn();
					
		},

		update: function() {

			this.parent();

			if(this.buttonNext != null) {
				this.buttonNext.pos.x = this.pos.x+this.size.x/2 - this.buttonNext.size.x/2;
				this.buttonNext.pos.y = this.pos.y+this.size.y*3.7/5 - this.buttonNext.size.y/2;
			}	
			if(this.buttonReady != null) {
				this.buttonReady.pos.x = this.pos.x+this.size.x/2 - this.buttonReady.size.x/2;
				this.buttonReady.pos.y = this.pos.y+this.size.y*3.7/5 - this.buttonReady.size.y/2;
			}

		},

		draw: function() {

			this.parent();
 			
 			ig.system.context.save();

 			// draw text tutorial
			ig.system.context.font = this.textSize+"px sf-collegiate-solid";
			ig.system.context.textAlign = "center";
			ig.system.context.textBaseline = "top";
			ig.system.context.fillStyle = "#ffffff";
			this.wrapText(ig.system.context, this.text, this.pos.x+this.size.x/2, this.pos.y+this.size.y*1/5, this.size.x*7/8, this.textSize);
			
			ig.system.context.restore();

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

		easeIn: function() {

			ig.game.easing = true;
			this.tween({pos:{y:this.pos.y-ig.system.height}}, 0.3, {
				easing: ig.Tween.Easing.Linear.EaseNone,
				onComplete:function(){
					ig.game.easing = false;

					switch(this.index) {

						case 0 :
							this.paddleTutorial = ig.game.spawnEntity(EntityPaddleTutorial, 
								this.controller.edgeArena.center.x,
								this.controller.edgeArena.playerPosY,
								{
									controller: this.controller
								}
							);
						break;

						case 1 :
							this.puckTutorial = ig.game.spawnEntity(EntityPuckTutorial, 
								this.controller.edgeArena.center.x,
								this.controller.edgeArena.center.y,
								{
									controller: this.controller
								}
							);
						break;

					}
				
				}.bind(this)
			}).start();

		},

		easeOut: function() {

			this.tween({pos:{y:this.pos.y+ig.system.height}}, 0.3, {
				easing: ig.Tween.Easing.Linear.EaseNone,
				onComplete:function(){							
					this.kill();
				}.bind(this)
			}).start();

		},

		kill: function() {

			this.parent();
			this.isKill = true;
			if(this.buttonNext != null) {
				this.buttonNext.kill();
			}
			if(this.buttonReady != null) {
				this.buttonReady.kill();
			}
			switch(this.index) {

				case 0 :
					this.paddleTutorial.kill();
				break;

				case 1 :
					this.puckTutorial.kill();
				break;
			}

		}
		
	});

	EntityButtonTextTS = EntityButtonText.extend({

		// impact entity properties
		type: ig.Entity.TYPE.A,
		zIndex: 51,
		// marketjs entity properties
		vertical: "center",
		horizontal: "center",
		idleSheetInfo: { sheetImage:new ig.Image('media/graphics/sprites/buttons/button-small.png'), sheetX:1, sheetY:1 },
		// button-text entity properties
		textColor: "#CC3366",
		font: "sf-collegiate-solid",
		textSize: 28,
		textPos: {x:0.48,y:0.5},
		scaling: true,
				
		init: function(x,y,settings) {
									
			this.parent(x,y,settings);

			// create aimation
			this.idle = new ig.Animation(this.idleSheet, 1, [0], true);
			this.setPosition();
			this.currentAnim = this.idle;

		},

		clicked: function() {

			if(ig.game.easing == false) {
				// play sfx
				ig.soundHandler.sfxPlayer.play(ig.soundHandler.sfxPlayer.soundList.button);
				ig.game.easing = true; // false on EntityTutorialStep.js => easeIn() OR puck.js => puckReady();
				this.tween({bodyScale: 0.9}, 0.1, {
					easing: ig.Tween.Easing.Linear.EaseNone,
					onComplete:function(){
						this.tween({bodyScale: 1}, 0.1, {
							easing: ig.Tween.Easing.Linear.EaseNone,
							onComplete:function() {
								////////////////////////////////////
								this.onClicked();
								////////////////////////////////////
							}.bind(this)
						}).start();
					}.bind(this)
				}).start();
			}

		},

		onClicked: function() {

		}

	});

	EntityButtonTextTSNext = EntityButtonTextTS.extend({
	
		onClicked: function() {
			this.controller.tutorialSteps.easeOut(1);
		}

	});

	EntityButtonTextTSReady = EntityButtonTextTS.extend({

		onClicked: function() {
			ig.game.playTutorial = false;
			ig.game.director.reloadLevel();
		}

	});

	EntityPuckTutorial = EntityPuck.extend({

		// other entity properties
		puckTutorial: true,

		init: function( x, y, settings ) {		
			
			this.parent( x, y, settings );

			this.idle = new ig.Animation(this.idleSheet, 1, [0], true);
			this.currentAnim = this.idle;
			this.currentAnim.alpha = 0.6;

			// set radius for circle	
			this.scaleCircle = 0.25;
			this.radius = this.size.x*0.9/2 * this.scaleCircle;

			this.pos.x = this.controller.edgeArena.center.x - this.size.x/2;
			this.pos.y = this.controller.edgeArena.center.y - this.size.y/2;

			this.vel = {x: 250, y: -250};
			this.zIndex++;
			
		},

		update: function() {

			this.parent();

			this.setScale(this.scaleCircle,this.scaleCircle);

			this.edgeCheck();

		},

		goalCheck: function() {

			var puckCenter = {
				x: this.pos.x+this.size.x/2,
				y: this.pos.y+this.size.y/2
			};
			var edgeArena = this.controller.edgeArena;

			/////////////////////////////////////
			// out of arena check
			/////////////////////////////////////
			if( (puckCenter.y/*-this.radius*/ < edgeArena.top || puckCenter.y/*+this.radius*/ > edgeArena.bottom) && 
				(puckCenter.x-this.radius>edgeArena.goalXLeft && puckCenter.x+this.radius<edgeArena.goalXRight) &&
				this.readyPlay ) {
				// set out of arena
				this.outOfArena = true;
				if(puckCenter.y+this.radius < edgeArena.top || puckCenter.y-this.radius > edgeArena.bottom) {
					this.pos.x = edgeArena.center.x - this.size.x/2;
					this.pos.y = edgeArena.center.y - this.size.y/2;
					this.outOfArena = false;
				}			
			}
			/////////////////////////////////////

		}

	});

	EntityPaddleTutorial = EntityPaddle.extend({

		// other entity properties
		hand: new ig.Image('media/graphics/sprites/game/hand.png'),
		player: true,
		paddleTutorial: true,

		init: function( x, y, settings ) {		
			
			this.parent( x, y, settings );

			this.zIndex++;

			this.currentAnim.alpha = 0.5;

			this.movementTutorial();
			
		},

		update: function() {
			this.parent();
		},

		movementTutorial: function() {

			this.tween({pos:{x:this.pos.x+120,y:this.pos.y-80}}, 0.5, {
				easing: ig.Tween.Easing.Linear.EaseNone,
				onComplete:function(){
					this.tween({pos:{x:this.pos.x-120,y:this.pos.y-80}}, 0.5, {
						easing: ig.Tween.Easing.Linear.EaseNone,
						onComplete:function(){
							this.tween({pos:{x:this.pos.x-120,y:this.pos.y+80}}, 0.5, {
								easing: ig.Tween.Easing.Linear.EaseNone,
								onComplete:function(){
									this.tween({pos:{x:this.pos.x+120,y:this.pos.y+80}}, 0.5, {
										easing: ig.Tween.Easing.Linear.EaseNone,
										onComplete:function(){
											this.movementTutorial();
										}.bind(this)
									}).start();
								}.bind(this)
							}).start();
						}.bind(this)
					}).start();
				}.bind(this)
			}).start();

		},

		draw: function() {

			this.parent();

			ig.system.context.save();

 			// draw hand
 			this.hand.draw(this.pos.x+this.size.x/3, this.pos.y+this.size.y/2);

			ig.system.context.restore();

		}

	});

});