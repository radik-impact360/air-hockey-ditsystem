ig.module('game.entities.game.puck')

.requires(
    'game.entities.others.marketjs-entity'
)

.defines(function() {

	EntityPuck = EntityMarketjsEntity.extend({

		// impact entity properties
		zIndex: 20,
		bounciness: 1,
		maxVel: {x: 10000, y: 10000},
		// marketjs entity properties
		idleSheetInfo: { sheetImage:new ig.Image('media/graphics/sprites/game/puck.png'), sheetX:1, sheetY:1 },
		vertical: "center",
		horizontal: "center",
		radius: null,
		outOfArena: false, // the puck out arena because player/computer will make a goal (a part of puck body still appearance)
		// other entity properties
		scaleCircle: 0.25, // replace bodyScale since this entity use physic from developer
		scaling: false,
		readyPlay: true, // puck readyPlay to play
		edgeCollide: null,
		lastCollidePlayer: null,

		init: function( x, y, settings ) {		
			
			this.parent( x, y, settings );

			this.idle = new ig.Animation(this.idleSheet, 1, [0], true);
			this.currentAnim = this.idle;

			// set radius for circle	
			this.radius = this.size.x*0.9/2 * this.scaleCircle;
			this.setPosition();

			if(!this.puckTutorial) {
				this.puckReady(0);
			}
			
		},

		update: function() {
			
			if(ig.game.isPause && !this.puckTutorial) {
				return;
			}

			this.parent();

			this.setScale(this.scaleCircle,this.scaleCircle);

		},

		puckReady: function(puckFrom) {

			ig.game.easing = true;

			// play sfx
			if(!ig.game.playTutorial) ig.soundHandler.sfxPlayer.play(ig.soundHandler.sfxPlayer.soundList.gameStart);

			this.currentAnim.alpha = 0.1;
			this.scaleCircle = 1;

			// make exact center position (puck)
			if(puckFrom == 1) { // puck computer
				this.pos.x = this.controller.edgeArena.center.x - this.size.x/2;
				this.pos.y = this.controller.edgeArena.puckComputer - this.size.y/2;
			} else if(puckFrom == 2) { // puck player
				this.pos.x = this.controller.edgeArena.center.x - this.size.x/2;
				this.pos.y = this.controller.edgeArena.puckPlayer - this.size.y/2;
			} else { // puck beginning
				this.pos.x = this.controller.edgeArena.center.x - this.size.x/2;
				this.pos.y = this.controller.edgeArena.center.y - this.size.y/2;
			}

			this.readyPlay = false;
			this.zIndex = 22;

			this.tween({currentAnim:{alpha: 1}, scaleCircle: 0.25}, 1, {
				easing: ig.Tween.Easing.Linear.EaseNone,
				onComplete:function() {

					// reset variable
					this.controller.paddleComputer.scaleGoalText = 0;
					this.controller.paddleComputer.playerGoal = null;

					// make exact center position (puck)
					if(puckFrom == 1) { // puck computer
						this.pos.x = this.controller.edgeArena.center.x - this.size.x/2;
						this.pos.y = this.controller.edgeArena.puckComputer - this.size.y/2;
					} else if(puckFrom == 2) { // puck player
						this.pos.x = this.controller.edgeArena.center.x - this.size.x/2;
						this.pos.y = this.controller.edgeArena.puckPlayer - this.size.y/2;
					} else { // puck beginning
						this.pos.x = this.controller.edgeArena.center.x - this.size.x/2;
						this.pos.y = this.controller.edgeArena.center.y - this.size.y/2;
					}

					this.readyPlay = true;
					this.zIndex = 20;

					// unpause the timer after easing
					if(ig.game.gameMode==1 && ig.game.playTutorial==false) this.controller.uiGame.gameTime.unpause();

					// reset timeCheat
					if(ig.game.gameMode==1) this.controller.paddleComputer.cheatTime = null;

					ig.game.easing = false;

				}.bind(this)
			}).start();

		},

		collideWith: function( other, axis ) {

			if(this.readyPlay == false) return;
			
			if(other instanceof EntityPaddle) {
				if((other.pos.x != other.last.x || other.pos.y != other.last.y) || this.lastCollidePlayer != other.player || this.edgeCollide) {					
					// play sfx				
					if(ig.soundHandler.sfxPlayer.soundList.puckPaddle._sounds[0]._ended == true) {
						ig.soundHandler.sfxPlayer.play(ig.soundHandler.sfxPlayer.soundList.puckPaddle);
					}
				}
				this.lastCollidePlayer = other.player;
				this.edgeCollide = false;
				
				var maxMove = {x: this.controller.arena.width - other.radius*2, y: this.controller.arena.height/2 - other.radius*2};
				var puckCenter = {x: this.pos.x+this.size.x/2, y: this.pos.y+this.size.y/2};
				var paddleCenter = {x: other.pos.x+other.size.x/2, y: other.pos.y+other.size.y/2};
				var paddleMove = {x: other.pos.x-other.last.x, y: other.pos.y-other.last.y};
				var maxVel = Math.abs(Math.abs(this.vel.x) > Math.abs(this.vel.y) ? this.vel.x : this.vel.y);

				// polar coordinate (puck can't overlapping with paddle)
				var r = this.radius+other.radius;
				var a = this.radiansToDegrees(Math.atan2(puckCenter.y-paddleCenter.y,puckCenter.x-paddleCenter.x));
				this.pos.x = paddleCenter.x + this.polarToCartesian(r,a).x - this.size.x/2;
				this.pos.y = paddleCenter.y + this.polarToCartesian(r,a).y - this.size.y/2;

				// reflection from last velocity
				var reflectionVelX = Math.round(maxVel * (puckCenter.x-paddleCenter.x) / (this.size.x+other.size.x));
				var reflectionVelY = Math.round(maxVel * (puckCenter.y-paddleCenter.y) / (this.size.y+other.size.y));
				if(paddleMove.x == 0) { // not push = reflection
					this.vel.x = reflectionVelX;
				} else { // pushing = reflection + vel from pushing
					this.vel.x = reflectionVelX + (paddleMove.x/maxMove.x * this.maxVel.x);
				}
				if(paddleMove.y == 0) { // not push = reflection
					this.vel.y = reflectionVelY;
				} else { // push = reflection + vel from pushing
					this.vel.y = reflectionVelY + (paddleMove.y/maxMove.y * this.maxVel.y);
				}

				// the friction for every push is 5 secs
				this.friction.x = Math.abs(this.vel.x/5);
				this.friction.y = Math.abs(this.vel.y/5);

			}

		},

		edgeCheck: function() {

			var puckCenter = {
				x: this.pos.x+this.size.x/2,
				y: this.pos.y+this.size.y/2
			};
			var edgeArena = this.controller.edgeArena;

			/////////////////////////////////////
			// edges check	
			/////////////////////////////////////
			if (this.outOfArena == false) {		
				// right edge
				if(	puckCenter.x+this.radius>edgeArena.right ) {
					this.pos.x = edgeArena.right-this.size.x/2 - this.radius;
					if(this.vel.x!=0) {
						this.edgeSfx();
						this.edgeCollide = true;
						if(this.vel.x>0) this.vel.x = this.vel.x * -1;
					}
					// console.log("left");
				}
				// left edge
				if (puckCenter.x-this.radius<edgeArena.left ) {	
					this.pos.x = edgeArena.left-this.size.x/2 + this.radius;
					if(this.vel.x!=0) {
						this.edgeSfx();
						this.edgeCollide = true;
						if(this.vel.x<0) this.vel.x = this.vel.x * -1;
					}
					// console.log("right");
				}
				// top edge
				if( ( puckCenter.y-this.radius<edgeArena.top ) && 
					( puckCenter.x-this.radius<edgeArena.goalXLeft || puckCenter.x+this.radius>edgeArena.goalXRight ) ) {
					this.pos.y = edgeArena.top-this.size.y/2 + this.radius;
					if(this.vel.y!=0) {
						this.edgeCollide = true;
						this.edgeSfx();
						if(this.vel.y<0) this.vel.y = this.vel.y * -1;
					}
					// console.log("top");
				}
				// bottom edge
				if( ( puckCenter.y+this.radius>edgeArena.bottom ) && 
					( puckCenter.x-this.radius<edgeArena.goalXLeft || puckCenter.x+this.radius>edgeArena.goalXRight ) ) {
					this.pos.y = edgeArena.bottom-this.size.y/2 - this.radius;
					if(this.vel.y!=0) {
						this.edgeCollide = true;
						this.edgeSfx();
						if(this.vel.y>0) this.vel.y = this.vel.y * -1;
					}
					// console.log("bottom");
				}
			} else {
				// edge check out of arena (the part of puck still visible)
				if( puckCenter.x-this.radius<edgeArena.goalXLeft ) {
					if(this.vel.x<0) {
						this.edgeCollide = true;
						this.vel.x = this.vel.x * -1;
						// console.log("edge check out of arena left");
					}
				} else if( puckCenter.x+this.radius>edgeArena.goalXRight ) {
					if(this.vel.x>0) {
						this.edgeCollide = true;
						this.vel.x = this.vel.x * -1;
						// console.log("edge check out of arena right");
					}
				}
			}
			/////////////////////////////////////

			this.goalCheck();

		},

		edgeSfx: function() {
			if(this.pos.x != this.last.x && this.pos.y != this.last.y) {				
				// play sfx		
				if(ig.soundHandler.sfxPlayer.soundList.puckEdge._sounds[0]._ended == true && !ig.game.playTutorial) {
					ig.soundHandler.sfxPlayer.play(ig.soundHandler.sfxPlayer.soundList.puckEdge);
				}
			}
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
				// if puck not visible from arena => give point
				if(puckCenter.y+this.radius < edgeArena.top) { // score for player
					this.controller.score.player++;
					this.controller.paddleComputer.beginningPos(1);
					this.controller.paddleComputer.playerGoal = true;
					this.vel = {x: 0, y: 0};
					this.friction = {x: 0, y: 0};
					this.outOfArena = false;
					this.readyPlay = false;
					this.goalSfx();
				} else if (puckCenter.y-this.radius > edgeArena.bottom) { // score for computer					
					this.controller.score.computer++;
					this.controller.paddleComputer.beginningPos(2);
					this.controller.paddleComputer.playerGoal = false;
					this.vel = {x: 0, y: 0};
					this.friction = {x: 0, y: 0};
					this.outOfArena = false;
					this.readyPlay = false;
					this.goalSfx();
				}			
			}
			/////////////////////////////////////

		},

		goalSfx: function() {			
			switch(ig.game.gameMode) {
				case 0 :
					if(this.controller.score.player != ig.game.classic[ig.game.gameModeOptions] && this.controller.score.computer != ig.game.classic[ig.game.gameModeOptions]) {
						// play sfx
						ig.soundHandler.sfxPlayer.play(ig.soundHandler.sfxPlayer.soundList.goal);
					}
				break;				
				case 1 :
					if(this.controller.uiGame.gameTime.delta() <= 0) {
						// play sfx
						ig.soundHandler.sfxPlayer.play(ig.soundHandler.sfxPlayer.soundList.goal);
					}
				break;

			}
		},

		puckBetweenPaddleCheck: function(paddle) {

			var otherPaddle = paddle.player == true ? this.controller.paddleComputer : this.controller.paddlePlayer;
			
			var puckCenter = {
				x: this.pos.x + (this.size.x/2),
				y: this.pos.y + (this.size.y/2)
			};
			var paddleCenter = {
				x: paddle.pos.x + (paddle.size.x/2),
				y: paddle.pos.y + (paddle.size.y/2)
			};
			var otherPaddleCenter = {
				x: otherPaddle.pos.x + (otherPaddle.size.x/2),
				y: otherPaddle.pos.y + (otherPaddle.size.y/2)
			};

			// paddle and puck position based paddle current movement (temporary variables)
			var tmpPaddle = paddle.edgeCheck(paddle.moveX,paddle.moveY);
			paddleCenter = {
				x: tmpPaddle.x + (paddle.size.x/2),
				y: tmpPaddle.y + (paddle.size.y/2)
			};
			var r = this.radius+this.radius;
			var a = this.radiansToDegrees(Math.atan2(puckCenter.y-paddleCenter.y,puckCenter.x-paddleCenter.x));
			puckCenter = {
				x: paddleCenter.x + this.polarToCartesian(r,a).x,
				y: paddleCenter.y + this.polarToCartesian(r,a).y
			};

			var collisionPaddle = ig.game.collision.circleCircle(
				paddleCenter.x,
				paddleCenter.y,
				paddle.radius*paddle.bodyScale,
				puckCenter.x,
				puckCenter.y,
				this.radius*this.bodyScale
			);
			
			var collisionOtherPaddle = ig.game.collision.circleCircle(
				otherPaddleCenter.x,
				otherPaddleCenter.y,
				otherPaddle.radius*otherPaddle.bodyScale,
				puckCenter.x,
				puckCenter.y,
				this.radius*this.bodyScale
			);
			
			if(	(collisionPaddle && collisionOtherPaddle)/* &&
				(puckCenter.x-this.radius<=this.controller.edgeArena.left || puckCenter.x+this.radius>=this.controller.edgeArena.right)*/ ) {
				// do puck movement and puck edgeCheck()
				var r = this.radius+otherPaddle.radius;
				var a = this.radiansToDegrees(Math.atan2(puckCenter.y-otherPaddleCenter.y,puckCenter.x-otherPaddleCenter.x));
				this.pos.x = otherPaddleCenter.x + this.polarToCartesian(r,a).x - this.size.x/2;
				this.pos.y = otherPaddleCenter.y + this.polarToCartesian(r,a).y - this.size.y/2;
				if(puckCenter.x > paddleCenter.x) {
					this.vel.x = this.maxVel.x/4;
					this.vel.y = 0;
				} else {
					this.vel.x = -this.maxVel.x/4;
					this.vel.y = 0;
				}
				this.edgeCheck();
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
		}
		
	});

});