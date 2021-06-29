ig.module('game.entities.buttons.button-more-games')
.requires(
	'game.entities.buttons.button',
	'plugins.clickable-div-layer'
)
.defines(function() {
	EntityButtonMoreGames = EntityButton.extend({

		// impact entity properties
		name: "moregames",
		type: ig.Entity.TYPE.A,
		gravityFactor: 0,
		zIndex: 1,
		// marketjs entity properties
		vertical: "center",
		horizontal: "center",		
		idleSheetInfo: { sheetImage:new ig.Image('media/graphics/sprites/buttons/button-more-games.png'), sheetX:1, sheetY:1 },
		clickableLayer: null,
		link: null,
		newWindow: false,
		div_layer_name: "more-games",

		init:function(x,y,settings) {

			this.parent(x,y,settings);

            // ig.soundHandler.unmuteAll(true);
            
			if(ig.global.wm) {
				return;
			}
			
			if(settings.div_layer_name) {
				//console.log('settings found ... using that div layer name')
				this.div_layer_name = settings.div_layer_name;
			} else {
				this.div_layer_name = 'more-games'
			}
			
			if(_SETTINGS.MoreGames.Enabled)	{

				this.idle = new ig.Animation(this.idleSheet, 1, [0], true);
				this.currentAnim = this.idle;

				this.setPosition();
				
				if(_SETTINGS.MoreGames.Link) {
					this.link=_SETTINGS.MoreGames.Link;
				}

				if(_SETTINGS.MoreGames.NewWindow) {
					this.newWindow = _SETTINGS.MoreGames.NewWindow;
				}

				this.clickableLayer = new ClickableDivLayer(this);

				this.hide(); // show when tween is finish

				// set position before first tween
				this.pos.y -= ig.system.height;

			} else {

				this.kill();

			}

		},

        show:function() {
            var elem = ig.domHandler.getElementById("#"+this.div_layer_name);
            ig.domHandler.show(elem);
        },

        hide:function() {
            var elem = ig.domHandler.getElementById("#"+this.div_layer_name);
            ig.domHandler.hide(elem);
        },

		clicked:function() {
			
		},

		clicking:function() {
			
		},

		released:function() {
			
		},

		easeOut: function() {

			this.tween({pos:{y: this.pos.y-ig.system.height}}, 0.3, {
				easing: ig.Tween.Easing.Linear.EaseNone,
				onComplete:function(){
					this.hide();
				}.bind(this)
			}).start();

		},

		easeIn: function() {

			this.tween({pos:{y: this.pos.y+ig.system.height}}, 0.3, {
				easing: ig.Tween.Easing.Linear.EaseNone,
				onComplete:function(){
					this.show();
				}.bind(this)
			}).start();

		}

	});
});