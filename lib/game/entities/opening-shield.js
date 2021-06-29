/**
 *  OpeningShield
 *
 *  Created by Ram Wu Hon Chi on 2013-12-31.
 *  Copyright (c) 2013 __MyCompanyName__. All rights reserved.
 */

ig.module('game.entities.opening-shield')
.requires(
    'impact.entity'
)
.defines(function () {

    EntityOpeningShield = ig.Entity.extend({
        size: { x: 48, y: 48 },
    	move: 0,
		mIconAnim: 0,
		shieldAnim: 0,
		titleAnim: 0,
		shieldImage: new ig.Image('media/graphics/opening/shield.png'),
		mIconImage: new ig.Image('media/graphics/opening/m_icon.png'),
		titleImage: new ig.Image('media/graphics/opening/title.png'),

        init: function (x, y, settings) {
            this.parent(x, y, settings);
        },

		ready: function(){
			if(!ig.wm){
				if(!_SETTINGS['DeveloperBranding']['Splash']['Enabled']){
					ig.game.director.nextLevel();
					ig.system.context.globalAlpha = 1 ;
					this.kill();
				}else{			
					//after 0.2s start animation
					this.initTimer = new ig.Timer(0.1);
					try{
						ig.soundHandler.playSound(ig.soundHandler.SOUNDID.openingSound);	
					}catch(e){console.log(e);}						
				}  				
			}				
		},

		update: function(){
			this.parent();
			this.updateOriginalShieldOpening();	
		},

		draw: function(){
			this.parent();
			//dont draw in weltmeister
			if(!ig.global.wm){

				//control the openeing fade out
				if(this.nextLevelTimer){
					if(this.nextLevelTimer.delta() < 0){
						ig.system.context.globalAlpha = -this.nextLevelTimer.delta() ;
					}
				}

				this.drawOriginalShieldOpening();
			}
		},

		updateOriginalShieldOpening: function(){
			//start shield timer
			if(this.initTimer && this.initTimer.delta() > 0){
				this.initTimer = null ;
				this.sheildTimer = new ig.Timer(0.05);
			}

			//run shield animation
			if(this.sheildTimer && this.sheildTimer.delta() > 0){
				if(this.shieldAnim < 3){
					this.shieldAnim++ ;
					this.sheildTimer.reset();
				}else{
					// disable shield time , run background , mIcon , title animation
					this.sheildTimer = null;
					this.moveTimer = new ig.Timer(0.001);
					this.mIconTimer = new ig.Timer(0.05);
					this.titleTimer = new ig.Timer(0.15);
				}
			}

			//controlling the background rotate speed
			if(this.moveTimer && this.moveTimer.delta() > 0){
				this.move += 0.3 ;	//the speed of background speed
				this.moveTimer.reset();
			}

			//controlling mIcon Animation speed
			if(this.mIconTimer && this.mIconTimer.delta() > 0){
				if(this.mIconAnim < 12){
					this.mIconAnim++ ;	//the sprite of mIcon
					this.moveTimer.reset();
				}else{
					this.mIconTimer = null ;
				}
			}

			//controlling title Animation speed
			if(this.titleTimer && this.titleTimer.delta() > 0){
				if(this.titleAnim < 11){
					this.titleAnim++ ;	//the sprite of title
					this.titleTimer.reset();
				}else{
					this.titleTimer = null ;
					this.nextLevelTimer = new ig.Timer(1);
				}
			}

			//controlling the dim animation
			if(this.nextLevelTimer && this.nextLevelTimer.delta() > 0){
				this.nextLevelTimer = null ;
				ig.game.director.nextLevel();
				ig.system.context.globalAlpha = 1 ;
			}	
		},

		drawOriginalShieldOpening: function(){
			if(this.moveTimer){
				var ctx = ig.system.context ;
				ctx.save(); 
				var numberOfSides = 48,
				    size = 800,
				    Xcenter = ig.system.width/2,
				    Ycenter = ig.system.height/2;

				ctx.translate(Xcenter,Ycenter);
				ctx.rotate(this.move*Math.PI/180);
				ctx.beginPath();
				ctx.moveTo (0,0); 
				var center = 0 ;
				for (var i = 1; i <= numberOfSides;i += 1) {
					ctx.lineTo (0 + size * Math.cos(i * 2 * Math.PI / numberOfSides), 0 + size * Math.sin(i * 2 * Math.PI / numberOfSides));
					center++ ;
					if(center == 2){
						center = 0;
						ctx.lineTo (0,0); 
					}
				}
				ctx.translate(-Xcenter,-Ycenter);
				var grd=ctx.createRadialGradient(Xcenter,Ycenter,100,Xcenter,Ycenter,250);
				grd.addColorStop(0,"rgba(255,255,255,0.1)");
				grd.addColorStop(1,"rgba(0,0,0,0)");
				ctx.fillStyle = grd;
				ctx.fill();
				ctx.restore();
			}

			this.shieldImage.drawTile(ig.system.width/2-91,0 - (768 - ig.system.height)/2,this.shieldAnim,182,768);

			if(this.moveTimer){
				this.mIconImage.drawTile(ig.system.width/2-96,ig.system.height/2-70,this.mIconAnim,166,160);
				this.titleImage.drawTile(ig.system.width/2-204,ig.system.height/2 + 100,this.titleAnim,409,76);
			}
			ig.system.context.globalAlpha = 1 ;	
		},

    });

});