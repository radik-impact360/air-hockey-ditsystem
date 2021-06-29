
/*
* Game's gamepad, contains the bindings you wish
*/
ig.module(
	'plugins.io.keyboard'
)
.requires(
)
.defines(function(){

	Keyboard = ig.Class.extend({
		bindings:{
			jump:[ig.KEY.W,ig.KEY.UP_ARROW],
			moveright:[ig.KEY.D,ig.KEY.RIGHT_ARROW],
			moveleft:[ig.KEY.A,ig.KEY.LEFT_ARROW],
			shoot:[ig.KEY.S,ig.KEY.DOWN_ARROW,ig.KEY.SPACE]
		},
		init:function()
		{
			// Keyboard	
			for(var key in this.bindings)
			{
				this[key] = key;
				for(var i = 0;i<this.bindings[key].length;i++)
				{
					ig.input.bind(this.bindings[key][i],key);
				}
			}
		},
	});
});