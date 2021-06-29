ig.module('game.entities.buttons.button-sound')
.requires(
	'game.entities.buttons.button'
)
.defines(function() {
	EntityButtonSound = EntityButton.extend({
		type:ig.Entity.TYPE.A,
		gravityFactor:0,
		logo: new ig.AnimationSheet('branding/logo.png',_SETTINGS['Branding']['Logo']['Width'],_SETTINGS['Branding']['Logo']['Height']),
		zIndex:10001,
		size:{x:50,
			y:50,
		},
        
        mutetest:false,
        
		name:"soundtest",
		init:function(x,y,settings){
			this.parent(x,y,settings);
			if(ig.global.wm)
			{
    			
                
				return;
			}
            
		},
        draw:function()
        {
            this.parent();
            ig.system.context.fillRect(this.pos.x,this.pos.y,50,50);
        },
        clicked:function()
		{
            console.log("pressed");
			if(this.mutetest)
            {
                console.log("unmute");                
                ig.soundHandler.unmuteAll(true);
                this.mutetest=false;
            }
            else
            {
                console.log("mute")
                ig.soundHandler.muteAll(true);
                this.mutetest=true;
            }
			
		},
		clicking:function()
		{
			
		},
		released:function()
		{
			
		}
	});
});