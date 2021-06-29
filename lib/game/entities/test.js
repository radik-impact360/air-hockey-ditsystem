ig.module('game.entities.test')
.requires(
	'impact.entity'
)
.defines(function() {
    EntityTest = ig.Entity.extend({
        zIndex:99999,
        pos:new Vector2(0,0),
        size:new Vector2(20,20),
        color:new ColorRGB(125,255,125,1),
        init:function(x,y,settings){
            this.parent(x,y,settings);
            //console.log(this.color.getStyle());
            //console.log(this.color.getHex());
        },
        update:function(){
            
            this.parent();
            
        },
        draw:function(){
            this.parent();
            var ctx=ig.system.context;
            ctx.fillStyle=this.color.getHex();
            ctx.fillRect(this.pos.x,this.pos.y,this.size.x,this.size.y);
        }
    });
});