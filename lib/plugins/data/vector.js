/**
 *  Vector
 *  Created by Justin Ng on 2015-03-05.
 *  Copyright (c) 2015 MarketJS. All rights reserved.
 */
ig.module('plugins.data.vector')
.requires(
)
.defines(function () {
    Vector2 = function(x,y){

    	this.x = x || 0;
    	this.y = y || 0;
    };
    Vector2.prototype = {
        valType:"number",
    	neg: function() {
    		this.x = -this.x;
    		this.y = -this.y;
    		return this;
    	},
		row:function(y){
			if(typeof(y)===this.valType)
			{
				this.y = y;
			}
			return this.y;
		},

		col:function(x){
			if(typeof(x)===this.valType)
			{
				this.x=x;
			}
			return this.x;
		},
        
    	add: function(v) {
    		if (v instanceof Vector2) {
    			this.x += v.x;
    			this.y += v.y;
    		} else {
    			this.x += v;
    			this.y += v;
    		}
    		return this;
    	},
    	sub: function(v) {
    		if (v instanceof Vector2) {
    			this.x -= v.x;
    			this.y -= v.y;
    		} else {
    			this.x -= v;
    			this.y -= v;
    		}
    		return this;
    	},
    	mul: function(v) {
    		if (v instanceof Vector2) {
    			this.x *= v.x;
    			this.y *= v.y;
    		} else {
    			this.x *= v;
    			this.y *= v;
    		}
    		return this;
    	},
    	div: function(v) {
    		if (v instanceof Vector2) {
    			if(v.x != 0) this.x /= v.x;
    			if(v.y != 0) this.y /= v.y;
    		} else {
    			if(v != 0) {
    				this.x /= v;
    				this.y /= v;
    			}
    		}
    		return this;
    	},
    	equals: function(v) {
    		return this.x == v.x && this.y == v.y;
    	},
    	dot: function(v) {
    		return this.x * v.x + this.y * v.y;
    	},
    	cross: function(v) {
    		return this.x * v.y - this.y * v.x
    	},
    	length: function() {
    		return Math.sqrt(this.dot(this));
    	},
    	norm: function() {
    		return this.divide(this.length());
    	},
    	min: function() {
    		return Math.min(this.x, this.y);
    	},
    	max: function() {
    		return Math.max(this.x, this.y);
    	},
    	toAngles: function() {
    		return -Math.atan2(-this.y, this.x);
    	},
    	angleTo: function(a) {
    		return Math.acos(this.dot(a) / (this.length() * a.length()));
    	},
    	toArray: function(n) {
    		return [this.x, this.y].slice(0, n || 2);
    	},
    	clone: function() {
    		return new Vector2(this.x, this.y);
    	},
    	set: function(x, y) {
    		this.x = x; this.y = y;
    		return this;
    	},
        unit: function(){
            var mag = this.length();
            //Magnitude should not be negative ever since its the product of the squares of x and y, square root.
            //If Magnitude is 0 then we have a divide by 0 error.
            if(mag > 0){
                return new Vector2(this.x/mag, this.y/mag);
            }
            else
            {
                throw ("Divide by 0 error in unitVector function of vector:"+this);
                return new Vector2(0, 0);
            }
        },
        /**
        * Assumes y axis points down else this is turn left
        */
        turnRight:function(){
            var temp = this.x;
            this.x = -this.y;
            this.y = temp;
            return this;
        },
        /**
        * Assumes y axis points down else this is turn right
        */
        turnLeft:function(){
            var temp = this.x;
            this.x = this.y;
            this.y = -temp;
            return this;
        },
        
        rotate:function(angle){
            var vector = this.clone();
            this.x =vector.x * Math.cos(angle) - vector.y * Math.sin(angle);
            this.y =vector.x * Math.sin(angle) + vector.y * Math.cos(angle);
            return this;
        },
    };

    /* STATIC METHODS */
    Vector2.negative = function(v) {
    	return new Vector2(-v.x, -v.y);
    };
    Vector2.add = function(a, b) {
    	if (b instanceof Vector2) return new Vector2(a.x + b.x, a.y + b.y);
    	else return new Vector2(a.x + v, a.y + v);
    };
    Vector2.subtract = function(a, b) {
    	if (b instanceof Vector2) return new Vector2(a.x - b.x, a.y - b.y);
    	else return new Vector2(a.x - v, a.y - v);
    };
    Vector2.multiply = function(a, b) {
    	if (b instanceof Vector2) return new Vector2(a.x * b.x, a.y * b.y);
    	else return new Vector2(a.x * v, a.y * v);
    };
    Vector2.divide = function(a, b) {
    	if (b instanceof Vector2) return new Vector2(a.x / b.x, a.y / b.y);
    	else return new Vector2(a.x / v, a.y / v);
    };
    Vector2.equals = function(a, b) {
    	return a.x == b.x && a.y == b.y;
    };
    Vector2.dot = function(a, b) {
    	return a.x * b.x + a.y * b.y;
    };
    Vector2.cross = function(a, b) {
    	return a.x * b.y - a.y * b.x;
    };
    
    /*
    
    Vector2 = ig.Class.extend({
		x:null,
		y:null,
		valType:"number",

		init: function (x,y){
			if(typeof(x) === this.valType
				&& typeof(y) === this.valType)
			{
				this.x=x;
				this.y=y;
			}
        },

		row:function(y){
			if(typeof(y)===this.valType)
			{
				this.y = y;
			}
			return this.y;
		},

		col:function(x){
			if(typeof(x)===this.valType)
			{
				this.x=x;
			}
			return this.x;
		},

        magnitude: function(){
            return Math.sqrt(this.squaredLength());
        },

        unit: function(){
            var mag = this.magnitude();
            //Magnitude should not be negative ever since its the product of the squares of x and y, square root.
            //If Magnitude is 0 then we have a divide by 0 error.
            if(mag > 0){
                return new Vector2(this.x/mag, this.y/mag);
            }
            else
            {
                throw ("Divide by 0 error in unitVector function of vector:"+this);
                return new Vector2(0, 0);
            }
        },
        squaredLength:function(){
            return this.x * this.x + this.y * this.y;
        },

        add: function(vector){
            this.x+=vector.x;
            this.y+=vector.y;
            return this;
        },

        sub: function(vector){
            this.x-=vector.x;
            this.y-=vector.y;
            return this;
        },

        mul:function(vector){
            this.x*=vector.x;
            this.y*=vector.y;
            return this;
        },

        mulScalar:function(val){
            this.x*=val;
            this.y*=val;
            return this;
        },
        

        div:function(vector){
            this.x/=vector.x;
            this.y/=vector.y;
            return this;
        },

        divScalar:function(val){
            this.x/=val;
            this.y/=val;
            return this;
        },
        
        /**
        * Dot product between two vectors
        */
    /*
        dot: function(vector){
            return (this.x*vector.x + this.y*vector.y);
        },
        
        /**
        * Returns the z component of the cross product of the two vectors augmented to 3D.
        */
    /*
        cross:function(vector){
            return this.x * vector.y - this.y * vector.x;
        },
        /**
        * Assumes y axis points down else this is turn left
        */
    /*
        turnRight:function(){
            var temp = this.x;
            this.x = -this.y;
            this.y = temp;
            return this;
        },
        /**
        * Assumes y axis points down else this is turn right
        */
    /*
        turnLeft:function(){
            var temp = this.x;
            this.x = this.y;
            this.y = -temp;
            return this;
        },
        
        rotate:function(angle){
            var vector = this.clone();
            this.x =vector.x * Math.cos(angle) - vector.y * Math.sin(angle);
            this.y =vector.x * Math.sin(angle) + vector.y * Math.cos(angle);
            return this;
        },
        
        //In radians
        angle:function(){
            return Math.atan2(this.y,this.x);
        },
        
        clone:function(){
            return new Vector2(this.x,this.y);
        },
        
        
        testAll:function(){
            var vectortest = this.clone();
            var vectortest2 = new Vector2(10,15);
            console.log(vectortest);
            console.log(vectortest.add(vectortest2));
            console.log(vectortest.sub(vectortest2));
            console.log(vectortest.mul(vectortest2));
            console.log(vectortest.div(vectortest2));
            console.log(vectortest.turnRight());
            console.log(vectortest.turnLeft());

            console.log(vectortest.dot(vectortest2));
            console.log(vectortest.cross(vectortest2));
            

            console.log(vectortest.angle());

            console.log(vectortest.angle()*180/Math.PI);
            
            console.log(vectortest.rotate(Math.PI));

            console.log(vectortest.squaredLength());
            console.log(vectortest.magnitude());
            console.log(vectortest.unit());
            
        }
    
    });
    */
});
