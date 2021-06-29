ig.module('game.entities.game.paddle')

.requires(
    'game.entities.others.marketjs-entity'
)

.defines(function() {

	EntityPaddle = EntityMarketjsEntity.extend({

		// impact entity properties
		zIndex: 21,
		// marketjs entity properties
		idleSheetInfo: { sheetImage:new ig.Image('media/graphics/sprites/game/paddle.png'), sheetX:2, sheetY:1 },
		vertical: "center",
		horizontal: "center",
		radius: null,
		// other
		drag: false,
		player: null, // true : player, false : computer
		moveX: null, // paddle movement X
		moveY: null, // paddle movement Y
		scaleGoalText: 0, // for easing "GOAL" text
		playerGoal: null, // for easing "GOAL" text
		lastPos: null,
		cheatTime: null,

		init: function( x, y, settings ) {		
			
			this.parent( x, y, settings );

			this.playerSprite = new ig.Animation(this.idleSheet, 1, [1], true);
			this.computerSprite = new ig.Animation(this.idleSheet, 1, [0], true);
			if(this.player) {
				this.currentAnim = this.playerSprite;
			} else {
				this.currentAnim = this.computerSprite;
			}

			this.radius = this.size.x*1.9/4;
			this.setPosition();
				
		},

		update: function() {

			if(ig.game.isPause || (ig.game.easing && this.player == false) || ig.game.playTutorial) {
				if(this.paddleTutorial != true) return;
			}

			this.parent();

			if(this.paddleTutorial != true) {
				// paddle movement
				if(this.player) { // for player
					
					this.playerMove();
					
				} else { // for computer

					this.computerMove();

					if(ig.game.gameMode == 1) {						
						var puck = this.controller.puck;
						var puckCenter = {
							x: puck.pos.x + puck.size.x/2,
							y: puck.pos.y + puck.size.y/2
						};
						var edgeArena = this.controller.edgeArena;
						if(	puckCenter.y >= edgeArena.center.y+puck.radius && puckCenter.y <= edgeArena.bottom+puck.radius) {
							if(this.cheatTime == null) {
								this.cheatTime = new ig.Timer(7);
							} else {
								if(this.cheatTime.delta() > 0) {
									this.cheatTime = null;
									// play sfx
									ig.soundHandler.sfxPlayer.play(ig.soundHandler.sfxPlayer.soundList.goal);
									this.controller.score.computer++;
									this.controller.paddleComputer.beginningPos(1);
									this.controller.puck.vel = {x: 0, y: 0};
									this.controller.puck.friction = {x: 0, y: 0};
									this.controller.puck.outOfArena = false;
									this.controller.puck.readyPlay = false;
								}
							}
						} else {
							this.cheatTime = null;
						}
					}

				} 

				/////////////////////////////////////
				// paddle and puck (circle collision)
				/////////////////////////////////////
				var paddleCenter = {
					x: this.pos.x+this.size.x/2,
					y: this.pos.y+this.size.y/2
				};
				var puck = this.controller.puck;
				var puckCenter = {
					x: puck.pos.x+puck.size.x/2,
					y: puck.pos.y+puck.size.y/2
				};
				if( ig.game.collision.circleCircle(
					paddleCenter.x,
					paddleCenter.y,
					this.radius*this.bodyScale,
					puckCenter.x,
					puckCenter.y,
					puck.radius*puck.bodyScale
					) 
				) {
					puck.collideWith(this, null);
				}
				puck.edgeCheck();
				/////////////////////////////////////			
			}
			
		},

		draw: function() {

			this.parent();

			if(this.playerGoal != null) {
				// draw "GOAL" text
	            ig.system.context.save();

			        if(this.playerGoal) {
						var posX = this.controller.edgeArena.center.x;
						var posY = this.controller.edgeArena.goalPlayerPosY;
			        } else {
						var posX = this.controller.edgeArena.center.x;
						var posY = this.controller.edgeArena.goalComputerPosY;
						/*
						// translate based on game screen
						ig.system.context.translate( posX-ig.game.screen.x, posY-ig.game.screen.y );
			            ig.system.context.rotate((180).toRad());
			            // re-translate for canter image rotate
						ig.system.context.translate( -posX, -posY);
						*/
			        }

			       	ig.system.context.font =  (this.scaleGoalText*60)+ "px sf-collegiate-solid";
			        ig.system.context.fillStyle = '#333333';
			        ig.system.context.textAlign = "center";
			        ig.system.context.textBaseline = "middle";
					
					// draw
			        ig.system.context.fillText(_STRINGS.Game.Goal, posX, posY);

	            ig.system.context.restore();
			}
			// draw cheat time
			if(ig.game.gameMode == 1 && this.cheatTime != null && this.cheatTime.delta() > -3) {
				var posX = this.controller.edgeArena.center.x;
				var posY = this.controller.edgeArena.goalPlayerPosY;				
	            ig.system.context.save();
					ig.system.context.font =  "60px sf-collegiate-solid";
				    ig.system.context.fillStyle = '#FF3366';
				    ig.system.context.textAlign = "center";
				    ig.system.context.textBaseline = "middle";
					// draw
				    ig.system.context.fillText(Math.ceil(Math.abs(this.cheatTime.delta())), posX, posY);
	            ig.system.context.restore();
			}
			
		},

		beginningPos: function(puckFrom) {

			// pause the timer while easing
			if(ig.game.gameMode==1) this.controller.uiGame.gameTime.pause();
			
			// exact center position (computer paddle)
			var setPos = {
				x: this.controller.edgeArena.center.x - this.size.x/2,
				y: this.controller.edgeArena.computerPosY - this.size.y/2
			};

			this.tween({pos:{x: setPos.x, y: setPos.y}, scaleGoalText: 1}, 0.5, {
				easing: ig.Tween.Easing.Linear.EaseNone,
				onComplete:function() {

					// make exact center position (computer paddle)
					this.pos.x = setPos .x;
					this.pos.y = setPos.y;

					this.controller.puck.puckReady(puckFrom);

				}.bind(this)
			}).start();

		},

		playerMove: function() {

			if(this.drag) {			

				/*
				if(this.lastPos==null) {
					this.lastPos = {
						x: ig.game.io.getClickPos().x,
						y: ig.game.io.getClickPos().y
					}
					this.moveX = 0;
					this.moveY = 0;
				} else {					
					this.moveX = ig.game.io.getClickPos().x - this.lastPos.x;
					this.moveY = ig.game.io.getClickPos().y - this.lastPos.y;
					this.lastPos = {
						x: ig.game.io.getClickPos().x,
						y: ig.game.io.getClickPos().y
					}
				}
				*/

				if(ig.ua.mobile) {
					var paddleCenter = {
						x: this.pos.x+this.size.x/2,
						y: this.pos.y+this.size.y/2
					};
					this.moveX = ig.game.io.getClickPos().x-paddleCenter.x;
					this.moveY = ig.game.io.getClickPos().y-paddleCenter.y - this.size.y;					
				} else {
					var paddleCenter = {
						x: this.pos.x+this.size.x/2,
						y: this.pos.y+this.size.y/2
					};
					this.moveX = ig.game.io.getClickPos().x-paddleCenter.x;
					this.moveY = ig.game.io.getClickPos().y-paddleCenter.y;
				}				

				this.paddleMovement(this.moveX, this.moveY);				

				/////////////////////////////////////////////////////
				// release paddle
				/////////////////////////////////////////////////////
				if(	ig.input.released("click") ) {
					this.drag = false;
					this.lastPos = null;
				}
				/////////////////////////////////////////////////////

			} else {

				/////////////////////////////////////////////////////
				// drag check
				/////////////////////////////////////////////////////				
				var paddleCenter = {
					x: this.pos.x+this.size.x/2,
					y: this.pos.y+this.size.y/2
				};		
				if(Math.sqrt( Math.pow((paddleCenter.x-ig.game.io.getClickPos().x), 2) + Math.pow((paddleCenter.y-ig.game.io.getClickPos().y), 2) ) < this.radius && ig.input.pressed("click") ) {
					this.drag = true;
				}
				/*
				if(ig.input.pressed("click") ) {
					this.drag = true;
				}
				*/
				/////////////////////////////////////////////////////

			}

		},

		computerMove: function() {

			switch(ig.game.difficulty) {

				// easy
				case 1 :
					this.computerEasy();
				break;

				// normal
				case 2 :
					this.computerNormal();
				break;

				// difficult
				case 3 :
					this.computerDifficult();
				break;

			}

			this.paddleMovement(this.moveX, this.moveY);

		},

		computerEasy: function() {

			var puck = this.controller.puck;
			var puckCenter = {
				x: puck.pos.x + puck.size.x/2,
				y: puck.pos.y + puck.size.y/2
			};
			var paddleCenter = {
				x: this.pos.x+this.size.x/2,
				y: this.pos.y+this.size.y/2
			};
			var edgeArena = this.controller.edgeArena;
			var arena = {
				width: this.controller.arena.width,
				height: this.controller.arena.height
			}
			var maxSpeed = 3;
			var pushSpeed = 3;
			var aiOffsetY = 0;

			if(puckCenter.y == edgeArena.center.y && puckCenter.x == edgeArena.center.x && puck.vel.x == 0 && puck.vel.y == 0) { // puck => beginning (center arena)
				// console.log("puck => beginning (center arena)");
				this.moveX = 0;
				this.moveY = maxSpeed;
			} else {
				if(this.puckComputerArea()) { // puck => in the computer area
					// console.log("puck => in the computer area");
					if(puckCenter.y > paddleCenter.y) {
						// console.log("puckCenter.y > paddleCenter.y");
						this.moveX = paddleCenter.x > puckCenter.x ?
							(paddleCenter.x-maxSpeed < puckCenter.x ? 
								(puckCenter.x - paddleCenter.x) :
								-maxSpeed) :
							(paddleCenter.x+maxSpeed > puckCenter.x ? 
								(puckCenter.x - paddleCenter.x) :
								maxSpeed);
						// paddle player not move check from beginning postion, the puck could be stuck
						if(	this.controller.paddlePlayer.pos.x+this.controller.paddlePlayer.size.x/2 == edgeArena.center.x &&
							this.controller.paddlePlayer.pos.y+this.controller.paddlePlayer.size.y/2 == edgeArena.playerPosY && 
							puckCenter.x == edgeArena.center.x &&
							puck.vel.x == 0 && puckCenter.x) {
							this.moveX = puckCenter.x == paddleCenter.x ? maxSpeed : 0;
						}
						this.moveY = paddleCenter.y+maxSpeed > puckCenter.y ? 0 : maxSpeed;
					} else {
						// console.log("puckCenter.y < paddleCenter.y");											
						if(paddleCenter.y <= edgeArena.top+this.radius) {
							if(puck.vel.y == 0) {
								this.moveX = puckCenter.x > paddleCenter.x ? maxSpeed : -maxSpeed;
							} else {								
								if(puckCenter.x > paddleCenter.x) {
									this.moveX = Math.abs(puckCenter.x - (paddleCenter.x-maxSpeed)) < (puck.radius+this.radius)*3/2 ? -maxSpeed : 0;
								} else {
									this.moveX = Math.abs(puckCenter.x - (paddleCenter.x+maxSpeed)) < (puck.radius+this.radius)*3/2 ? maxSpeed : 0;
								}
							}
						} else {
							if(puckCenter.x > paddleCenter.x) {
								this.moveX = Math.abs(puckCenter.x - (paddleCenter.x+maxSpeed)) > puck.radius+this.radius ? maxSpeed : 0;
							} else {
								this.moveX = Math.abs(puckCenter.x - (paddleCenter.x-maxSpeed)) > puck.radius+this.radius ? -maxSpeed : 0;
							}
						}
						this.moveY = -maxSpeed;						
					}
				} else if(this.puckPlayerArea()) { // puck => in the player area
					// console.log("puck => in the player area");			
					if(paddleCenter.x != puckCenter.x) {
						// goal pos edge check when center Y == computerPos
						if(paddleCenter.y == edgeArena.computerPosY-aiOffsetY) {
							if(paddleCenter.x < edgeArena.goalXLeft) { 
								this.moveX = maxSpeed;
							} else if(paddleCenter.x > edgeArena.goalXRight) {
								this.moveX = -maxSpeed;
							} else {
								if(puckCenter.x > edgeArena.goalXLeft && puckCenter.x < edgeArena.goalXRight) {									
									this.moveX = paddleCenter.x > puckCenter.x ?
										(paddleCenter.x-maxSpeed < puckCenter.x ? 
											(puckCenter.x - paddleCenter.x) :
											-maxSpeed) :
										(paddleCenter.x+maxSpeed > puckCenter.x ? 
											(puckCenter.x - paddleCenter.x) :
											maxSpeed);
								} else {
									this.moveX = 0;
								}
							}
						} else {							
							this.moveX = paddleCenter.x > puckCenter.x ?
								(paddleCenter.x-maxSpeed < puckCenter.x ? 
									(puckCenter.x - paddleCenter.x) :
									-maxSpeed) :
								(paddleCenter.x+maxSpeed > puckCenter.x ? 
									(puckCenter.x - paddleCenter.x) :
									maxSpeed);
						}
					} else {	
						this.moveX = 0;
					}
					if(paddleCenter.y != edgeArena.computerPosY-aiOffsetY) {
						this.moveY = paddleCenter.y > edgeArena.computerPosY-aiOffsetY ?
							(paddleCenter.y-maxSpeed < edgeArena.computerPosY-aiOffsetY ? 
								((edgeArena.computerPosY-aiOffsetY) - (paddleCenter.y)) :
								-maxSpeed) :
							(paddleCenter.y+maxSpeed > edgeArena.computerPosY-aiOffsetY ? 
								((edgeArena.computerPosY-aiOffsetY) - (paddleCenter.y)) :
								maxSpeed);
					} else {						
						this.moveY = 0;
					}
				} else { // puck => out of arena
					// THIS CODE REPLACE BY EASING beginningPos() and return; when easing on upsate();
					// console.log("puck => out of arena");
				}
			}

			var tmpCollision = Math.sqrt( Math.pow((paddleCenter.x+this.moveX - puckCenter.x), 2) + Math.pow((paddleCenter.y+this.moveY - puckCenter.y), 2) ) < (this.radius+puck.radius);
			if(tmpCollision && paddleCenter.y < puckCenter.y) {
				// console.log("computer => extend push power");
				this.last.x = this.pos.x + (this.moveX*-pushSpeed);
				this.last.y = this.pos.y + (this.moveY*-pushSpeed);
			}

		},

		computerNormal: function() {

			var puck = this.controller.puck;
			var puckCenter = {
				x: puck.pos.x + puck.size.x/2,
				y: puck.pos.y + puck.size.y/2
			};
			var paddleCenter = {
				x: this.pos.x+this.size.x/2,
				y: this.pos.y+this.size.y/2
			};
			var edgeArena = this.controller.edgeArena;
			var arena = {
				width: this.controller.arena.width,
				height: this.controller.arena.height
			}
			var maxSpeed = this.getRandomInt(3,5);
			var pushSpeed = 4;
			var aiOffsetY = 15;

			if(puckCenter.y == edgeArena.center.y && puckCenter.x == edgeArena.center.x && puck.vel.x == 0 && puck.vel.y == 0) { // puck => beginning (center arena)
				// console.log("puck => beginning (center arena)");
				this.moveX = 0;
				this.moveY = maxSpeed;
			} else {
				if(this.puckComputerArea()) { // puck => in the computer area
					// console.log("puck => in the computer area");
					if(puckCenter.y > paddleCenter.y) {
						// console.log("puckCenter.y > paddleCenter.y");
						this.moveX = paddleCenter.x > puckCenter.x ?
							(paddleCenter.x-maxSpeed < puckCenter.x ? 
								(puckCenter.x - paddleCenter.x) :
								-maxSpeed) :
							(paddleCenter.x+maxSpeed > puckCenter.x ? 
								(puckCenter.x - paddleCenter.x) :
								maxSpeed);
						// paddle player not move check from beginning postion, the puck could be stuck
						if(	this.controller.paddlePlayer.pos.x+this.controller.paddlePlayer.size.x/2 == edgeArena.center.x &&
							this.controller.paddlePlayer.pos.y+this.controller.paddlePlayer.size.y/2 == edgeArena.playerPosY && 
							puckCenter.x == edgeArena.center.x &&
							puck.vel.x == 0 && puckCenter.x) {
							this.moveX = puckCenter.x == paddleCenter.x ? maxSpeed : 0;
						}
						this.moveY = paddleCenter.y+maxSpeed > puckCenter.y ? 0 : maxSpeed;
					} else {
						// console.log("puckCenter.y < paddleCenter.y");											
						if(paddleCenter.y <= edgeArena.top+this.radius) {
							if(puck.vel.y == 0) {
								this.moveX = puckCenter.x > paddleCenter.x ? maxSpeed : -maxSpeed;
							} else {								
								if(puckCenter.x > paddleCenter.x) {
									this.moveX = Math.abs(puckCenter.x - (paddleCenter.x-maxSpeed)) < (puck.radius+this.radius)*3/2 ? -maxSpeed : 0;
								} else {
									this.moveX = Math.abs(puckCenter.x - (paddleCenter.x+maxSpeed)) < (puck.radius+this.radius)*3/2 ? maxSpeed : 0;
								}
							}
						} else {
							if(puckCenter.x > paddleCenter.x) {
								this.moveX = Math.abs(puckCenter.x - (paddleCenter.x+maxSpeed)) > puck.radius+this.radius ? maxSpeed : 0;
							} else {
								this.moveX = Math.abs(puckCenter.x - (paddleCenter.x-maxSpeed)) > puck.radius+this.radius ? -maxSpeed : 0;
							}
						}
						this.moveY = -maxSpeed;						
					}
				} else if(this.puckPlayerArea()) { // puck => in the player area
					// console.log("puck => in the player area");			
					if(paddleCenter.x != puckCenter.x) {
						// goal pos edge check when center Y == computerPos
						if(paddleCenter.y == edgeArena.computerPosY-aiOffsetY) {
							if(paddleCenter.x < edgeArena.goalXLeft) { 
								this.moveX = maxSpeed;
							} else if(paddleCenter.x > edgeArena.goalXRight) {
								this.moveX = -maxSpeed;
							} else {
								if(puckCenter.x > edgeArena.goalXLeft && puckCenter.x < edgeArena.goalXRight) {									
									this.moveX = paddleCenter.x > puckCenter.x ?
										(paddleCenter.x-maxSpeed < puckCenter.x ? 
											(puckCenter.x - paddleCenter.x) :
											-maxSpeed) :
										(paddleCenter.x+maxSpeed > puckCenter.x ? 
											(puckCenter.x - paddleCenter.x) :
											maxSpeed);
								} else {
									this.moveX = 0;
								}
							}
						} else {							
							this.moveX = paddleCenter.x > puckCenter.x ?
								(paddleCenter.x-maxSpeed < puckCenter.x ? 
									(puckCenter.x - paddleCenter.x) :
									-maxSpeed) :
								(paddleCenter.x+maxSpeed > puckCenter.x ? 
									(puckCenter.x - paddleCenter.x) :
									maxSpeed);
						}
					} else {	
						this.moveX = 0;
					}
					if(paddleCenter.y != edgeArena.computerPosY-aiOffsetY) {
						this.moveY = paddleCenter.y > edgeArena.computerPosY-aiOffsetY ?
							(paddleCenter.y-maxSpeed < edgeArena.computerPosY-aiOffsetY ? 
								((edgeArena.computerPosY-aiOffsetY) - (paddleCenter.y)) :
								-maxSpeed) :
							(paddleCenter.y+maxSpeed > edgeArena.computerPosY-aiOffsetY ? 
								((edgeArena.computerPosY-aiOffsetY) - (paddleCenter.y)) :
								maxSpeed);
					} else {						
						this.moveY = 0;
					}
				} else { // puck => out of arena
					// THIS CODE REPLACE BY EASING beginningPos() and return; when easing on upsate();
					// console.log("puck => out of arena");
				}
			}

			var tmpCollision = Math.sqrt( Math.pow((paddleCenter.x+this.moveX - puckCenter.x), 2) + Math.pow((paddleCenter.y+this.moveY - puckCenter.y), 2) ) < (this.radius+puck.radius);
			if(tmpCollision && paddleCenter.y < puckCenter.y) {
				// console.log("computer => extend push power");
				this.last.x = this.pos.x + (this.moveX*-pushSpeed);
				this.last.y = this.pos.y + (this.moveY*-pushSpeed);
			}

		},

		computerDifficult: function() {

			var puck = this.controller.puck;
			var puckCenter = {
				x: puck.pos.x + puck.size.x/2,
				y: puck.pos.y + puck.size.y/2
			};
			var paddleCenter = {
				x: this.pos.x+this.size.x/2,
				y: this.pos.y+this.size.y/2
			};
			var edgeArena = this.controller.edgeArena;
			var arena = {
				width: this.controller.arena.width,
				height: this.controller.arena.height
			}
			var maxSpeed = this.getRandomInt(5,8);
			var pushSpeed = 5;
			var aiOffsetY = 30;

			if(puckCenter.y == edgeArena.center.y && puckCenter.x == edgeArena.center.x && puck.vel.x == 0 && puck.vel.y == 0) { // puck => beginning (center arena)
				// console.log("puck => beginning (center arena)");
				this.moveX = 0;
				this.moveY = maxSpeed;
			} else {
				if(this.puckComputerArea()) { // puck => in the computer area
					// console.log("puck => in the computer area");
					if(puckCenter.y > paddleCenter.y) {
						// console.log("puckCenter.y > paddleCenter.y");
						this.moveX = paddleCenter.x > puckCenter.x ?
							(paddleCenter.x-maxSpeed < puckCenter.x ? 
								(puckCenter.x - paddleCenter.x) :
								-maxSpeed) :
							(paddleCenter.x+maxSpeed > puckCenter.x ? 
								(puckCenter.x - paddleCenter.x) :
								maxSpeed);
						// paddle player not move check from beginning postion, the puck could be stuck
						if(	this.controller.paddlePlayer.pos.x+this.controller.paddlePlayer.size.x/2 == edgeArena.center.x &&
							this.controller.paddlePlayer.pos.y+this.controller.paddlePlayer.size.y/2 == edgeArena.playerPosY && 
							puckCenter.x == edgeArena.center.x &&
							puck.vel.x == 0 && puckCenter.x) {
							this.moveX = puckCenter.x == paddleCenter.x ? maxSpeed : 0;
						}
						this.moveY = paddleCenter.y+maxSpeed > puckCenter.y ? 0 : maxSpeed;
					} else {
						// console.log("puckCenter.y < paddleCenter.y");											
						if(paddleCenter.y <= edgeArena.top+this.radius) {
							if(puck.vel.y == 0) {
								this.moveX = puckCenter.x > paddleCenter.x ? maxSpeed : -maxSpeed;
							} else {								
								if(puckCenter.x > paddleCenter.x) {
									this.moveX = Math.abs(puckCenter.x - (paddleCenter.x-maxSpeed)) < (puck.radius+this.radius)*3/2 ? -maxSpeed : 0;
								} else {
									this.moveX = Math.abs(puckCenter.x - (paddleCenter.x+maxSpeed)) < (puck.radius+this.radius)*3/2 ? maxSpeed : 0;
								}
							}
						} else {
							if(puckCenter.x > paddleCenter.x) {
								this.moveX = Math.abs(puckCenter.x - (paddleCenter.x+maxSpeed)) > puck.radius+this.radius ? maxSpeed : 0;
							} else {
								this.moveX = Math.abs(puckCenter.x - (paddleCenter.x-maxSpeed)) > puck.radius+this.radius ? -maxSpeed : 0;
							}
						}
						this.moveY = -maxSpeed;						
					}
				} else if(this.puckPlayerArea()) { // puck => in the player area
					// console.log("puck => in the player area");			
					if(paddleCenter.x != puckCenter.x) {
						// goal pos edge check when center Y == computerPos
						if(paddleCenter.y == edgeArena.computerPosY-aiOffsetY) {
							if(paddleCenter.x < edgeArena.goalXLeft) { 
								this.moveX = maxSpeed;
							} else if(paddleCenter.x > edgeArena.goalXRight) {
								this.moveX = -maxSpeed;
							} else {
								if(puckCenter.x > edgeArena.goalXLeft && puckCenter.x < edgeArena.goalXRight) {									
									this.moveX = paddleCenter.x > puckCenter.x ?
										(paddleCenter.x-maxSpeed < puckCenter.x ? 
											(puckCenter.x - paddleCenter.x) :
											-maxSpeed) :
										(paddleCenter.x+maxSpeed > puckCenter.x ? 
											(puckCenter.x - paddleCenter.x) :
											maxSpeed);
								} else {
									this.moveX = 0;
								}
							}
						} else {							
							this.moveX = paddleCenter.x > puckCenter.x ?
								(paddleCenter.x-maxSpeed < puckCenter.x ? 
									(puckCenter.x - paddleCenter.x) :
									-maxSpeed) :
								(paddleCenter.x+maxSpeed > puckCenter.x ? 
									(puckCenter.x - paddleCenter.x) :
									maxSpeed);
						}
					} else {	
						this.moveX = 0;
					}
					if(paddleCenter.y != edgeArena.computerPosY-aiOffsetY) {
						this.moveY = paddleCenter.y > edgeArena.computerPosY-aiOffsetY ?
							(paddleCenter.y-maxSpeed < edgeArena.computerPosY-aiOffsetY ? 
								((edgeArena.computerPosY-aiOffsetY) - (paddleCenter.y)) :
								-maxSpeed) :
							(paddleCenter.y+maxSpeed > edgeArena.computerPosY-aiOffsetY ? 
								((edgeArena.computerPosY-aiOffsetY) - (paddleCenter.y)) :
								maxSpeed);
					} else {						
						this.moveY = 0;
					}
				} else { // puck => out of arena
					// THIS CODE REPLACE BY EASING beginningPos() and return; when easing on upsate();
					// console.log("puck => out of arena");
				}
			}

			var tmpCollision = Math.sqrt( Math.pow((paddleCenter.x+this.moveX - puckCenter.x), 2) + Math.pow((paddleCenter.y+this.moveY - puckCenter.y), 2) ) < (this.radius+puck.radius);
			if(tmpCollision && paddleCenter.y < puckCenter.y) {
				// console.log("computer => extend push power");
				this.last.x = this.pos.x + (this.moveX*-pushSpeed);
				this.last.y = this.pos.y + (this.moveY*-pushSpeed);
			}

		},

		paddleMovement: function(moveX, moveY) {

			var edgeArena = this.controller.edgeArena;
			var puck = this.controller.puck;
			var puckCenter = {
				x: puck.pos.x+puck.size.x/2,
				y: puck.pos.y+puck.size.y/2
			};
			var paddleCenter = {
				x: this.pos.x+this.size.x/2,
				y: this.pos.y+this.size.y/2
			};
				
			/////////////////////////////////////////////////////
			// paddle movement
			/////////////////////////////////////////////////////
			// calculation tmp puck and puddle to know the puck will be stuck or not
			var tmpPaddle = this.edgeCheck(moveX,moveY); // not center pos
			var r = this.radius+puck.radius;
			var a = this.radiansToDegrees(Math.atan2(puckCenter.y-(tmpPaddle.y+this.size.y/2),puckCenter.x-(tmpPaddle.x+this.size.x/2)));
			var tmpPuck = {
				x: tmpPaddle.x+this.size.x/2 + this.polarToCartesian(r,a).x,
				y: tmpPaddle.y+this.size.y/2 + this.polarToCartesian(r,a).y
			};
			// puck stuck at corners check (player paddle movement)
			if(	tmpPuck.x-puck.radius<=edgeArena.left && tmpPuck.y+puck.radius>=edgeArena.bottom ) {
				// console.log("bottom left");
				// polar coordinate (puck can't overlapping with paddle)
				tmpPuck = {
					x: edgeArena.left + puck.radius,
					y: edgeArena.bottom - puck.radius
				};
				var r = this.radius+puck.radius;
				var a = this.radiansToDegrees(Math.atan2(tmpPuck.y-(tmpPaddle.y+this.size.y/2),tmpPuck.x-(tmpPaddle.x+this.size.x/2)));
				var moveX2 = tmpPuck.x + this.polarToCartesian(r,a).x*-1 - paddleCenter.x;
				var moveY2 = tmpPuck.y + this.polarToCartesian(r,a).y*-1 - paddleCenter.y;
				this.pos = this.edgeCheck(moveX2,moveY2);
			} else if( tmpPuck.x+puck.radius>=edgeArena.right && tmpPuck.y+puck.radius>=edgeArena.bottom ) {
				// console.log("bottom right");
				// polar coordinate (puck can't overlapping with paddle)
				tmpPuck = {
					x: edgeArena.right - puck.radius,
					y: edgeArena.bottom - puck.radius
				};
				var r = this.radius+puck.radius;
				var a = this.radiansToDegrees(Math.atan2(tmpPuck.y-(tmpPaddle.y+this.size.y/2),tmpPuck.x-(tmpPaddle.x+this.size.x/2)));
				var moveX2 = tmpPuck.x + this.polarToCartesian(r,a).x*-1 - paddleCenter.x;
				var moveY2 = tmpPuck.y + this.polarToCartesian(r,a).y*-1 - paddleCenter.y;
				this.pos = this.edgeCheck(moveX2,moveY2);
			} else if( tmpPuck.x-puck.radius<=edgeArena.left && tmpPuck.y-puck.radius<=edgeArena.top ) {
				// console.log("top left");
				// polar coordinate (puck can't overlapping with paddle)
				tmpPuck = {
					x: edgeArena.left + puck.radius,
					y: edgeArena.top + puck.radius
				};				
				var r = this.radius+puck.radius;
				var a = this.radiansToDegrees(Math.atan2(tmpPuck.y-(tmpPaddle.y+this.size.y/2),tmpPuck.x-(tmpPaddle.x+this.size.x/2)));
				var moveX2 = tmpPuck.x + this.polarToCartesian(r,a).x*-1 - paddleCenter.x;
				var moveY2 = tmpPuck.y + this.polarToCartesian(r,a).y*-1 - paddleCenter.y;
				this.pos = this.edgeCheck(moveX2,moveY2);
			} else if( tmpPuck.x+puck.radius>=edgeArena.right && tmpPuck.y-puck.radius<=edgeArena.top ) {
				// console.log("top right");
				// polar coordinate (puck can't overlapping with paddle)
				tmpPuck = {
					x: edgeArena.right - puck.radius,
					y: edgeArena.top + puck.radius
				};				
				var r = this.radius+puck.radius;
				var a = this.radiansToDegrees(Math.atan2(tmpPuck.y-(tmpPaddle.y+this.size.y/2),tmpPuck.x-(tmpPaddle.x+this.size.x/2)));
				var moveX2 = tmpPuck.x + this.polarToCartesian(r,a).x*-1 - paddleCenter.x;
				var moveY2 = tmpPuck.y + this.polarToCartesian(r,a).y*-1 - paddleCenter.y;
				this.pos = this.edgeCheck(moveX2,moveY2);
			} else if( tmpPuck.x+puck.radius>=edgeArena.right && tmpPuck.y==tmpPaddle.y+this.size.y/2 ) {
				// console.log("right edge");
				var moveX2 = (edgeArena.right-puck.radius*2-this.radius-(this.size.x/2)) - this.pos.x;
				this.pos = this.edgeCheck(moveX2,moveY);
			} else if( tmpPuck.x-puck.radius<=edgeArena.left && tmpPuck.y==tmpPaddle.y+this.size.y/2 ) {
				// console.log("left edge");
				var moveX2 = (edgeArena.left+puck.radius*2+this.radius-(this.size.x/2)) - this.pos.x;
				this.pos = this.edgeCheck(moveX2,moveY);
			} else if( tmpPuck.y-puck.radius<=edgeArena.top && tmpPuck.x==tmpPaddle.x+this.size.x/2 && (tmpPuck.x<=edgeArena.goalXLeft || tmpPuck.x>=edgeArena.goalXRight) ) {
				// console.log("top edge");
				var moveY2 = (edgeArena.top+puck.radius*2+this.radius-(this.size.y/2)) - this.pos.y;
				this.pos = this.edgeCheck(moveX,moveY2);
			} else if( tmpPuck.y+puck.radius>=edgeArena.bottom && tmpPuck.x==tmpPaddle.x+this.size.x/2 && (tmpPuck.x<=edgeArena.goalXLeft || tmpPuck.x>=edgeArena.goalXRight) ) {
				// console.log("bottom edge");
				var moveY2 = (edgeArena.bottom-puck.radius*2-this.radius-(this.size.y/2)) - this.pos.y;
				this.pos = this.edgeCheck(moveX,moveY2);
			} else {			
				// check collision puck between paddles
				if(this.controller.puck.puckBetweenPaddleCheck(this)) {
					// console.log("collision puck between paddles");
					puck = this.controller.puck;
					puckCenter = {
						x: puck.pos.x+puck.size.x/2,
						y: puck.pos.y+puck.size.y/2
					};
					var r = this.radius+puck.radius;
					var a = this.radiansToDegrees(Math.atan2(puckCenter.y-paddleCenter.y,puckCenter.x-paddleCenter.x));
					var moveX2 = puckCenter.x + this.polarToCartesian(r,a).x*-1 - paddleCenter.x;
					var moveY2 = puckCenter.y + this.polarToCartesian(r,a).y*-1 - paddleCenter.y;
					this.pos = this.edgeCheck(moveX2,moveY2);
					return; // puck movement and puck.edgeCheck() on puckBetweenPaddleCheck() function
				} else {
					// console.log("paddle movement");
					this.pos = this.edgeCheck(moveX,moveY);
				}	
			}
			/////////////////////////////////////////////////////

		},

		// paddle check with the edges of arena
		edgeCheck: function(moveX, moveY) {
			
			var pos = {x: null, y: null}; // temp position variable
			var paddleCenter = {
				x: this.pos.x+this.size.x/2,
				y: this.pos.y+this.size.y/2
			};

			if(paddleCenter.x+this.radius + moveX > this.controller.edgeArena.right) { // right
				pos.x = this.controller.edgeArena.right - (this.size.x/2) - this.radius;
			} else if(paddleCenter.x-this.radius + moveX < this.controller.edgeArena.left) { // left
				pos.x = this.controller.edgeArena.left - (this.size.x/2) + this.radius;
			} else {
				pos.x = this.pos.x + moveX;
			}

			if(this.player) { // for player
				if(paddleCenter.y+this.radius + moveY > this.controller.edgeArena.bottom) { // bottom
					pos.y = this.controller.edgeArena.bottom - (this.size.y/2) - this.radius;
				} else if(paddleCenter.y-this.radius + moveY < this.controller.edgeArena.center.y) { // center
					pos.y = this.controller.edgeArena.center.y - (this.size.y/2) + this.radius;
				} else {
					pos.y = this.pos.y + moveY;
				}
			} else { // for computer
				if(paddleCenter.y+this.radius + moveY > this.controller.edgeArena.center.y) { // center
					pos.y = this.controller.edgeArena.center.y - (this.size.y/2) - this.radius;
				} else if(paddleCenter.y-this.radius + moveY < this.controller.edgeArena.top) { // top
					pos.y = this.controller.edgeArena.top - (this.size.y/2) + this.radius;
				} else {
					pos.y = this.pos.y + moveY;
				}
			}

			return pos;

		},

		puckComputerArea: function() {

			var puck = this.controller.puck;
			var puckCenter = {
				x: puck.pos.x + puck.size.x/2,
				y: puck.pos.y + puck.size.y/2
			};
			var edgeArena = this.controller.edgeArena;

			if(	puckCenter.y < edgeArena.center.y && puckCenter.y >= edgeArena.top-puck.radius ) {
				return true;
			} else {
				return false;
			}

		},

		puckPlayerArea: function() {

			var puck = this.controller.puck;
			var puckCenter = {
				x: puck.pos.x + puck.size.x/2,
				y: puck.pos.y + puck.size.y/2
			};
			var edgeArena = this.controller.edgeArena;

			if(	puckCenter.y > edgeArena.center.y && puckCenter.y <= edgeArena.bottom+puck.radius ) {
				return true;
			} else {
				return false;
			}

		},

		polarToCartesian: function(r, a) {
			return {x: r*Math.cos(this.degreesToRadians(a)), y: r*Math.sin(this.degreesToRadians(a))};
		},

		radiansToDegrees: function(radians) {
			return radians * 180 / Math.PI;
		},

		degreesToRadians: function(degrees) {
			return degrees * Math.PI / 180;
		},

		getRandomInt: function(min, max) {
		  return Math.floor(Math.random() * (max - min + 1)) + min;
		}
		
	});

});