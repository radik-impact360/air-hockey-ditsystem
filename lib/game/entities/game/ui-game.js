ig.module('game.entities.game.ui-game')

.requires(
    'game.entities.others.marketjs-entity'
)

.defines(function() {

	EntityUiGame = EntityMarketjsEntity.extend({

		// impact entity properties
		zIndex: 30,
		// other entity properties
		arenaEdge: new ig.Image('media/graphics/sprites/arena-edge.png'),
		scoreBg: new ig.Image('media/graphics/sprites/game/score-bg.png'),
		timeBg: new ig.Image('media/graphics/sprites/game/time-bg.png'),
		timeIco: new ig.Image('media/graphics/sprites/game/time-ico.png'),
		endGame: false,

		init: function( x, y, settings ) {
			
			this.parent( x, y, settings );

			switch(ig.game.gameMode) {

				case 0 :
					this.posScoreComputer = {
						x: ig.system.width - this.controller.buttonPause.pos.x - this.controller.buttonPause.size.x,
						y: this.controller.buttonPause.pos.y + this.controller.buttonPause.size.y/2
					};
					this.posScorePlayer = {
						x: (this.posScoreComputer.x*1.5) + this.scoreBg.width,
						y: this.controller.buttonPause.pos.y + this.controller.buttonPause.size.y/2
					};
				break;

				case 1 :				
					this.posTimeIco = {
						x: ig.system.width - this.controller.buttonPause.pos.x - this.controller.buttonPause.size.x,
						y: this.controller.buttonPause.pos.y + this.controller.buttonPause.size.y/2
					};
					this.posTimeBg = {
						x: (this.posTimeIco.x*1.5) + this.timeIco.width,
						y: this.controller.buttonPause.pos.y + this.controller.buttonPause.size.y/2
					};
					this.posScoreComputer = {
						x: (this.posTimeIco.x*2) + this.timeIco.width + this.timeBg.width,
						y: this.controller.buttonPause.pos.y + this.controller.buttonPause.size.y/2
					};
					this.posScorePlayer = {
						x: (this.posTimeIco.x*2.5) + this.timeIco.width + this.timeBg.width + this.scoreBg.width,
						y: this.controller.buttonPause.pos.y + this.controller.buttonPause.size.y/2
					};
					this.gameTime = new ig.Timer(ig.game.timed[ig.game.gameModeOptions]*60);
					// pause the timer while easing
					this.gameTime.pause();
				break;
			}

			
				
		},

		update: function() {

			this.parent();

		},

		draw: function() {

			// draw background to cover puck
			ig.system.context.save();
			ig.system.context.fillStyle = '#3ac6ed';
			ig.system.context.fillRect(0, 0, ig.system.width, 140);
			ig.system.context.fillRect(0, 140, 70, ig.system.height-200);
			ig.system.context.fillRect(0, ig.system.height-60, ig.system.width, 60);
			ig.system.context.fillRect(ig.system.width-70, 140, 70, ig.system.height-200);
			this.arenaEdge.draw(ig.system.width/2-this.arenaEdge.width/2,ig.system.height*13/24-this.arenaEdge.height/2);

			this.parent();
			
			// draw score computer score			
			this.scoreBg.draw(
				this.posScoreComputer.x,
				this.posScoreComputer.y - this.scoreBg.height/2
			);
			ig.system.context.font = "45px sf-collegiate-solid";
	        ig.system.context.fillStyle = '#FF3366';
	        ig.system.context.textAlign = "center";
	        ig.system.context.textBaseline = "middle";
	        var scoreComputer = this.controller.score.computer;            
	        var scoreComputer1 = Math.floor((scoreComputer%1000)/100);
	        var scoreComputer2 = Math.floor((scoreComputer%100)/10);
	        var scoreComputer3 = scoreComputer%10;
	        ig.system.context.fillText(scoreComputer1, this.posScoreComputer.x+this.scoreBg.width*1.1/4, this.posScoreComputer.y+5);
	        ig.system.context.fillText(scoreComputer2, this.posScoreComputer.x+this.scoreBg.width*2/4, this.posScoreComputer.y+5);
	        ig.system.context.fillText(scoreComputer3, this.posScoreComputer.x+this.scoreBg.width*2.9/4, this.posScoreComputer.y+5);
			// draw score player score
			this.scoreBg.draw(
				this.posScorePlayer.x,
				this.posScorePlayer.y - this.scoreBg.height/2
			);
			ig.system.context.font = "45px sf-collegiate-solid";
	        ig.system.context.fillStyle = '#33CCCC';
	        ig.system.context.textAlign = "center";
	        ig.system.context.textBaseline = "middle";
	        var scorePlayer = this.controller.score.player;
	        var scorePlayer1 = Math.floor((scorePlayer%1000)/100);
	        var scorePlayer2 = Math.floor((scorePlayer%100)/10);
	        var scorePlayer3 = scorePlayer%10;
	        ig.system.context.fillText(scorePlayer1, this.posScorePlayer.x+this.scoreBg.width*1.1/4, this.posScorePlayer.y+5);
	        ig.system.context.fillText(scorePlayer2, this.posScorePlayer.x+this.scoreBg.width*2/4, this.posScorePlayer.y+5);
	        ig.system.context.fillText(scorePlayer3, this.posScorePlayer.x+this.scoreBg.width*2.9/4, this.posScorePlayer.y+5);
				
			// draw time
			if(ig.game.gameMode == 1) {
				this.timeIco.draw(
					this.posTimeIco.x,
					this.posTimeIco.y - this.timeIco.height/2
				);
				this.timeBg.draw(
					this.posTimeBg.x,
					this.posTimeBg.y - this.timeBg.height/2
				);
				ig.system.context.font = "38px sf-collegiate-solid";
		        ig.system.context.fillStyle = '#333333';
		        ig.system.context.textAlign = "center";
		        ig.system.context.textBaseline = "middle";
		        ig.system.context.fillText(":", this.posTimeBg.x+this.timeBg.width*1/2, this.posTimeBg.y);
		        var gameTimeMinutes = Math.floor((Math.floor(this.gameTime.delta()) * -1)/60);
		        var gameTimeMinutes1 = Math.floor(gameTimeMinutes/10);
		        var gameTimeMinutes2 = gameTimeMinutes%10;
		        var gameTimeSeconds = (Math.floor(this.gameTime.delta()) * -1)%60;
		        var gameTimeSeconds1 = Math.floor(gameTimeSeconds/10);
		        var gameTimeSeconds2 = gameTimeSeconds%10;
		        ig.system.context.fillText(gameTimeMinutes1, this.posTimeBg.x+this.timeBg.width*0.9/4, this.posTimeBg.y+3);
		        ig.system.context.fillText(gameTimeMinutes2, this.posTimeBg.x+this.timeBg.width*1.5/4, this.posTimeBg.y+3);
		        ig.system.context.fillText(gameTimeSeconds1, this.posTimeBg.x+this.timeBg.width*2.5/4, this.posTimeBg.y+3);
		        ig.system.context.fillText(gameTimeSeconds2, this.posTimeBg.x+this.timeBg.width*3.1/4, this.posTimeBg.y+3);
			}
	        ig.system.context.restore();

		}
		
	});

});