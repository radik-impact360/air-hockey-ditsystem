ig.module('game.entities.pointer-selector')
.requires(
	'game.entities.pointer'
)
.defines(function() {
	EntityPointerSelector = EntityPointer.extend({
		zIndex:1000,
		
		_wmDrawBox: true,
		_wmBoxColor: 'rgba(0, 0, 255, 0.7)',
		
		size:{x:1,y:1},
		
		init:function(x,y,settings){
			this.parent(x,y,settings);
		}		
	});
});