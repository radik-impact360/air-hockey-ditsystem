ig.module('game.entities.controllers.game-controller')

.requires(
    'game.entities.others.marketjs-entity'
)

.defines(function() {

	EntityGameController = EntityMarketjsEntity.extend({

		/*
		zIndex List
		0  : game-controller
		10 : background
		20 : puck
		21 : paddle player
		21 : paddle computer
		31 : ui-game
		40-49 : button-pause, pop-up-pause (also properties)
		50-59 : tutorial, puck-tutorial, paddle-tutorial
		100 : edge
		*/

		// impact entity properties
		zIndex: 0,
		// other entity properties
		arena :new ig.Image('media/graphics/sprites/arena.png'),
		paddlePlayer: null,
		paddleComputer: null,
		puck: null,
		uiGame: null,
		score: {player:0,computer:0},
		popUpPause: null,
		popUpResult: null,
		playingGame: true, // to show arena when game is playing
		edgeArena: {
			top: 0,
			bottom: 0,
			right: 0,
			left: 0
		},

		init: function( x, y, settings ) {		
			
			this.parent( x, y, settings );
			ig.game.gameStartInit();
			
			// pointer check
			this.pointer = ig.game.getEntitiesByType(EntityPointer)[0];			
			// pointer doesnt exist
			if(this.pointer == null) {
				this.pointer = ig.game.spawnEntity(EntityPointer, 0, 0);
			}

			// calculation of edge arena
			this.edgeArena = {
				top: ig.system.height*13/24-this.arena.height/2,
				bottom: ig.system.height*13/24+this.arena.height/2,
				right: ig.system.width/2+this.arena.width/2,
				left: ig.system.width/2-this.arena.width/2,
				center: {
					x: ig.system.width/2,
					y: ig.system.height*13/24
				},
				playerPosY: ig.system.height*13/24 + this.arena.height*1.64/5, // from center y
				computerPosY: ig.system.height*13/24 - this.arena.height*1.64/5, // from center y
				goalPlayerPosY: ig.system.height*13/24 + this.arena.height*1/5, // from center y
				goalComputerPosY: ig.system.height*13/24 - this.arena.height*1/5, // from center y
				puckPlayer: ig.system.height*13/24 + this.arena.height*0.8/4, // from center y
				puckComputer: ig.system.height*13/24 - this.arena.height*0.8/4, // from center y
				goalXRight: ig.system.width*2/3,
				goalXLeft: ig.system.width*1/3
			};

			// create entities
			this.paddlePlayer = ig.game.spawnEntity(EntityPaddle, 
				this.edgeArena.center.x,
				this.edgeArena.playerPosY,
				{
					player: true,
					controller: this,
					zIndex: 21
				}
			);
			this.paddleComputer = ig.game.spawnEntity(EntityPaddle, 
				this.edgeArena.center.x,
				this.edgeArena.computerPosY,
				{
					player: false,
					controller: this,
					zIndex: 22
				}
			);
			this.puck = ig.game.spawnEntity(EntityPuck, 
				this.edgeArena.center.x,
				this.edgeArena.center.y,
				{
					controller: this
				}
			);
			this.buttonPause = ig.game.spawnEntity(EntityButtonPause, 
				ig.system.width*9/10,
				ig.system.height*1/20,
				{
					controller: this
				}
			);		
			this.uiGame = ig.game.spawnEntity(EntityUiGame, 
				0,
				0,
				{
					controller: this
				}
			);
			this.popUpPause = ig.game.spawnEntity(EntityPopUpPause, 
				ig.system.width*1/2,
				ig.system.height*1/2,
				{
					controller: this
				}
			);

			// Tutorial Mode
			if(ig.game.playTutorial) {
				this.buttonPause.enable = false;
				this.tutorial = [					
					{
						x: ig.system.width/2,
						y: this.edgeArena.center.y-this.arena.height/4,
						text: _STRINGS.Game.Tutorial1,
						textSize: 40,
						lastTutorial: false
					},					
					{
						x: ig.system.width/2,
						y: this.edgeArena.center.y+this.arena.height/4,
						text: _STRINGS.Game.Tutorial2,
						textSize: 28,
						lastTutorial: false
					},					
					{
						x: ig.system.width/2,
						y: this.edgeArena.center.y,
						text: _STRINGS.Game.Tutorial3,
						textSize: 40,
						lastTutorial: true
					}

				];
			}
				
		},

		update: function() {

			this.parent();

			// end game check
			if(this.popUpResult == null) {
				switch(ig.game.gameMode) {

					case 0 :

						if(this.score.player == ig.game.classic[ig.game.gameModeOptions] || this.score.computer == ig.game.classic[ig.game.gameModeOptions]) {
							this.paddlePlayer.kill();
							this.paddleComputer.kill();
							this.puck.kill();
							this.uiGame.kill();
							this.buttonPause.kill();
							this.playingGame = false;
							this.popUpResult = ig.game.spawnEntity(EntityPopUpResult, 
								ig.system.width*1/2,
								ig.system.height*1/2,
								{
									controller: this
								}
							);
							this.popUpResult.easeIn();
						}

					break;

					case 1 :

						if(this.uiGame.gameTime.delta() > 0) {
							this.paddlePlayer.kill();
							this.paddleComputer.kill();
							this.puck.kill();
							this.uiGame.kill();
							this.buttonPause.kill();
							this.playingGame = false;
							this.popUpResult = ig.game.spawnEntity(EntityPopUpResult, 
								ig.system.width*1/2,
								ig.system.height*1/2,
								{
									controller: this
								}
							);
							this.popUpResult.easeIn();
						}

					break;

				}
			}

			if(ig.game.playTutorial) {
				this.tutorialMode();
			}

		},

		tutorialMode: function() {

			// create pop-up tutorial
			for(var i=0; i<this.tutorial.length; i++) {
				
				if(this.tutorial[i] != null && (this.tutorialSteps == null || this.tutorialSteps.isKill == true)) {
					
					this.tutorialSteps = ig.game.spawnEntity(EntityTutorialStep,
						ig.game.screen.x + this.tutorial[i].x,
						ig.game.screen.y + this.tutorial[i].y,
						{
							text: this.tutorial[i].text,
							textSize: this.tutorial[i].textSize,
							index: i,
							lastTutorial: this.tutorial[i].lastTutorial,
							bodyScale: this.tutorial[i].bodyScale,
							controller: this					
						}
					);							
					this.tutorial[i] = null;
					break;

				}
			
			}

		},

		draw: function() {

			if(this.playingGame) {
				ig.system.context.save();
				ig.system.context.fillStyle = '#3ac6ed';
				ig.system.context.fillRect(0, 0, ig.system.width, ig.system.height);
				this.arena.draw(ig.system.width/2-this.arena.width/2,ig.system.height*13/24-this.arena.height/2);
		        ig.system.context.restore();
		    }

			this.parent();

		}
		
	});

});