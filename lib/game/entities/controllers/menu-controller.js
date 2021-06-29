ig.module('game.entities.controllers.menu-controller')

.requires(
    'game.entities.others.marketjs-entity'
)

.defines(function() {

	EntityMenuController = EntityMarketjsEntity.extend({

		/*
		zIndex List :
		0 : controller
		1 : menu-title, puck-title, button-mor-games, button-play (easy,medium,hard)
		2 : button-setting
		*/

		// impact entity properties
		zIndex: 0,
		// other entity properties
		arena: new ig.Image('media/graphics/sprites/arena.png'),
		arenaEdge: new ig.Image('media/graphics/sprites/arena-edge.png'),


		init: function( x, y, settings ) {		
			
			this.parent( x, y, settings );

			// pointer check 
			this.pointer = ig.game.getEntitiesByType(EntityPointer)[0];			
			// pointer doesnt exist
			if(this.pointer == null) {
				this.pointer = ig.game.spawnEntity(EntityPointer, 0, 0);
			}

			// Creates entities
			this.menuTitle = ig.game.spawnEntity(EntityMenuTitle, 
				ig.system.width*1/2,
				ig.system.height*15/40,
				{
					controller: this
				}
			);
			this.puckTitle = ig.game.spawnEntity(EntityPuckTitle, 
				ig.system.width*3/10,
				ig.system.height*12/40,
				{
					controller: this
				}
			);
			if(_SETTINGS.MoreGames.Enabled) {
				this.buttonMoreGames = ig.game.spawnEntity(EntityButtonMoreGames, 
					ig.system.width*1/10,
					ig.system.height*1/20,
					{
						controller: this
					}
				);				
			}
			this.buttonSettings = ig.game.spawnEntity(EntityButtonSettings, 
				ig.system.width*9/10,
				ig.system.height*1/20,
				{
					controller: this
				}
			);			
			this.buttonTextPlayEasy = ig.game.spawnEntity(EntityButtonTextPlay, 
				ig.system.width*1/2,
				ig.system.height*21/40,
				{
					controller: this,
					text: _STRINGS.Menu.ButtonEasy,
					difficulty: 1
				}
			);			
			this.buttonTextPlayNormal = ig.game.spawnEntity(EntityButtonTextPlay, 
				ig.system.width*1/2,
				ig.system.height*25/40,
				{
					controller: this,
					text: _STRINGS.Menu.ButtonNormal,
					difficulty: 2
				}
			);			
			this.buttonTextPlayDifficult = ig.game.spawnEntity(EntityButtonTextPlay, 
				ig.system.width*1/2,
				ig.system.height*29/40,
				{
					controller: this,
					text: _STRINGS.Menu.ButtonDifficult,
					difficulty: 3
				}
			);
			this.popUpSettings = ig.game.spawnEntity(EntityPopUpSettings, 
				ig.system.width*1/2,
				ig.system.height*1/2,
				{
					controller: this
				}
			);
			this.popUpTutorial = ig.game.spawnEntity(EntityPopUpTutorial, 
				ig.system.width*1/2,
				ig.system.height*1/2,
				{
					controller: this
				}
			);

			// Set easeIn
			ig.game.easing = true; // false on menu-title.js => easeIn()
			this.menuTitle.easeIn();
			this.puckTitle.easeIn();
			if(_SETTINGS.MoreGames.Enabled) {
				this.buttonMoreGames.easeIn();
			}					
			this.buttonSettings.easeIn();
			this.buttonTextPlayEasy.easeIn();
			this.buttonTextPlayNormal.easeIn();
			this.buttonTextPlayDifficult.easeIn();
				
		},

		update: function() {

			this.parent();

		},

		draw: function() {

			this.parent();

			ig.system.context.save();
			ig.system.context.fillStyle = '#3ac6ed';
			ig.system.context.fillRect(0, 0, ig.system.width, ig.system.height);
			this.arena.draw(ig.system.width/2-this.arena.width/2,ig.system.height*13/24-this.arena.height/2);
			this.arenaEdge.draw(ig.system.width/2-this.arenaEdge.width/2,ig.system.height*13/24-this.arenaEdge.height/2);
	        ig.system.context.restore();
			
		}
		
	});

});