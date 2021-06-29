ig.module('game.entities.game.pop-up-result')

.requires(	
	'game.entities.others.marketjs-entity'
)

.defines(function() {

	var halfButtonSizeY = 0;

	EntityPopUpResult = EntityMarketjsEntity.extend({

		// impact entity properties
		zIndex: 40,
		// marketjs entity propertis
		// other entity properties
		bgTitle: new ig.Image('media/graphics/sprites/pop-up/bg-pop-up-title.png'),
		arena :new ig.Image('media/graphics/sprites/arena-without-line.png'),
		arenaEdge: new ig.Image('media/graphics/sprites/arena-edge.png'),
		bgPopUpResultTitle: new ig.Image('media/graphics/sprites/game/bg-pop-up-result-title.png'),
		bgScoreBlue: new ig.Image('media/graphics/sprites/game/score-bg-blue.png'),
		bgScorePink: new ig.Image('media/graphics/sprites/game/score-bg-pink.png'),
		trophy: new ig.Image('media/graphics/sprites/game/trophy.png'),		
		buttonHome: null,
		buttonRestart: null,
		offset: {
			top: null,
			bottom: null,
			right: null,
			left: null
		},
		globalAlpha: 0,
		textPrecentage: 0,

		init: function( x, y, settings ) {		
			
			this.parent( x, y, settings );
			
			// set position before first tween
			// this.pos.y += ig.system.height;

			// create entities
			this.buttonHome = ig.game.spawnEntity(EntityButtonHome, ig.system.width, ig.system.height, {controller: this.controller});
			this.buttonRestart = ig.game.spawnEntity(EntityButtonRestart, ig.system.width, ig.system.height, {controller: this.controller});
			halfButtonSizeY = this.buttonRestart.size.y/2;
			this.offset = {
				top: -ig.system.height,
				bottom: ig.system.height,
				right: ig.system.width,
				left: -ig.system.height
			};

			// API_END_GAME
			// play sfx result
	        if(this.controller.score.player > this.controller.score.computer) {
				// play sfx
				ig.soundHandler.sfxPlayer.play(ig.soundHandler.sfxPlayer.soundList.win);
	        } else if(this.controller.score.player < this.controller.score.computer) {
				// play sfx
				ig.soundHandler.sfxPlayer.play(ig.soundHandler.sfxPlayer.soundList.lose);
	        } else {
				// play sfx
				ig.soundHandler.sfxPlayer.play(ig.soundHandler.sfxPlayer.soundList.draw);
	        }

		},

		update: function() {

			this.parent();

			// set position entities
			var buttonPosY = this.pos.y + ig.system.height*3/10 - halfButtonSizeY;
			this.buttonHome.pos.x = this.pos.x - ig.system.width*1/10 - this.buttonHome.size.x*1/2;
			this.buttonHome.pos.y = buttonPosY - this.buttonHome.size.y/2 + this.offset.bottom;
			this.buttonRestart.pos.x = this.pos.x + ig.system.width*1/10 - this.buttonRestart.size.x*1/2;
			this.buttonRestart.pos.y = buttonPosY - this.buttonRestart.size.y/2 + this.offset.bottom;
			
		},

		draw: function() {

			this.parent();

            ig.system.context.save();
				
				// draw bg and arena
				ig.system.context.fillStyle = '#3ac6ed';
				ig.system.context.fillRect(0, 0, ig.system.width, ig.system.height);
				this.arena.draw(ig.system.width/2-this.arena.width/2,ig.system.height/2-this.arena.height/2);
				this.arenaEdge.draw(ig.system.width/2-this.arenaEdge.width/2,ig.system.height/2-this.arenaEdge.height/2);
		    	
		    	// draw title
				var posTitle = {x: this.pos.x+this.size.x*1/2, y: this.pos.y+this.size.y*1.5/20};
				this.bgPopUpResultTitle.draw(this.pos.x-this.bgPopUpResultTitle.width/2,this.pos.y - ig.system.height*3/10 + this.offset.top);
				ig.system.context.font = "45px sf-collegiate-solid";
	            ig.system.context.fillStyle = '#FFFFFF';
	            ig.system.context.textAlign = "center";
	            ig.system.context.textBaseline = "middle";
	            ig.system.context.fillText(_STRINGS.Game.ResultTitle, this.pos.x, this.pos.y - ig.system.height*3/10 + this.bgPopUpResultTitle.height/2 + this.offset.top);

	            // draw result text
	            if(this.controller.score.player > this.controller.score.computer) {
	            	var fillStyle = '#33CCCC';
	            	var resultText = _STRINGS.Game.ResultWin;
	            } else if(this.controller.score.player < this.controller.score.computer) {
	            	var fillStyle = '#FF3366';
	            	var resultText = _STRINGS.Game.ResultLose;
	            } else {
	            	var fillStyle = '#333333';
	            	var resultText = _STRINGS.Game.ResultDraw;
	            }
	            ig.system.context.font = (this.textPrecentage*80) + "px sf-collegiate-solid";
	            ig.system.context.fillStyle = fillStyle;
	            ig.system.context.textAlign = "center";
	            ig.system.context.textBaseline = "middle";
	            ig.system.context.fillText(resultText, this.pos.x, this.pos.y+5);

	            // draw result score
				this.bgScorePink.draw(this.pos.x-this.bgScorePink.width/2 + this.offset.left,this.pos.y-ig.system.height*1.17/10-this.bgScorePink.height/2);
				ig.system.context.font = "70px sf-collegiate-solid";
		        ig.system.context.fillStyle = '#FF3366';
		        ig.system.context.textAlign = "center";
		        ig.system.context.textBaseline = "middle";
		        var scoreComputer = this.controller.score.computer;            
		        var scoreComputer1 = Math.floor((scoreComputer%1000)/100);
		        var scoreComputer2 = Math.floor((scoreComputer%100)/10);
		        var scoreComputer3 = scoreComputer%10;
		        ig.system.context.fillText(scoreComputer1, this.pos.x-this.bgScorePink.width*1/4 + this.offset.left,this.pos.y-ig.system.height*1.17/10 + 8);
		        ig.system.context.fillText(scoreComputer2, this.pos.x + this.offset.left,this.pos.y-ig.system.height*1.17/10 + 8);
		        ig.system.context.fillText(scoreComputer3, this.pos.x+this.bgScorePink.width*1/4 + this.offset.left,this.pos.y-ig.system.height*1.17/10 + 8);
				this.bgScoreBlue.draw(this.pos.x-this.bgScoreBlue.width/2 + this.offset.right,this.pos.y+ig.system.height*1.17/10-this.bgScoreBlue.height/2);
				ig.system.context.font = "70px sf-collegiate-solid";
		        ig.system.context.fillStyle = '#33CCCC';
		        ig.system.context.textAlign = "center";
		        ig.system.context.textBaseline = "middle";
		        var scorePlayer = this.controller.score.player;
		        var scorePlayer1 = Math.floor((scorePlayer%1000)/100);
		        var scorePlayer2 = Math.floor((scorePlayer%100)/10);
		        var scorePlayer3 = scorePlayer%10;
		        ig.system.context.fillText(scorePlayer1, this.pos.x-this.bgScoreBlue.width*1/4 + this.offset.right,this.pos.y+ig.system.height*1.17/10 + 8);
		        ig.system.context.fillText(scorePlayer2, this.pos.x + this.offset.right,this.pos.y+ig.system.height*1.17/10 + 8);
		        ig.system.context.fillText(scorePlayer3, this.pos.x+this.bgScoreBlue.width*1/4 + this.offset.right,this.pos.y+ig.system.height*1.17/10 + 8);
		    	
		    	// draw trophy
		    	if(this.controller.score.player != this.controller.score.computer) {
		    		ig.system.context.globalAlpha = this.globalAlpha;
		    		if(this.controller.score.player > this.controller.score.computer) {
	    			 	this.trophy.draw(this.pos.x-ig.system.width*1/8-this.bgScoreBlue.width/2,this.pos.y+ig.system.height*1.17/10-this.trophy.height/2);
		    		} else {
	    			 	this.trophy.draw(this.pos.x-ig.system.width*1/8-this.bgScoreBlue.width/2,this.pos.y-ig.system.height*1.17/10-this.trophy.height/2);
		    		}
		    	}

		    ig.system.context.restore();

		},

		easeIn: function() {
			ig.game.easing = true;
			this.tween({offset:{top:0, bottom:0, right:0, left:0}}, 0.25, {
				easing: ig.Tween.Easing.Linear.EaseNone,
				onComplete:function(){
					this.tween({textPrecentage: 1}, 0.25, {
						easing: ig.Tween.Easing.Linear.EaseNone,
						onComplete:function(){
							this.tween({globalAlpha: 1}, 0.25, {
								easing: ig.Tween.Easing.Linear.EaseNone,
								onComplete:function(){
									ig.game.easing = false;
								}.bind(this)
							}).start();
						}.bind(this)
					}).start();
				}.bind(this)
			}).start();

		},
		
	});

});