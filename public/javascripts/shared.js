
if(typeof exports == 'undefined'){
    var exports = {};
}

exports.FPS = 50;

exports.area = { height: 600, width: 800 };

exports.Bullet = function(x, y, angle) {
	this.x = x;
	this.y = y;
	this.angle = angle;

	var mov_x = Math.sin(angle)
		,mov_y = -Math.cos(angle) 
    	,speed = 6;

	this.move = function() {
        this.x += mov_x * speed;
        this.y += mov_y * speed;
	}
};

exports.Ship = function(x, y, color, angle, m_x, m_y, rot) {
      
      this.x = x;
      this.y = y;
      this.color = color;
      this.angle = angle;
      this.mov_x = m_x;
      this.mov_y = m_y;
      this.rotation = rot;
      var speed = 4;
     
     this.move = function () {
         this.assertXYReset.apply(this);
         this.angle += this.rotation;
         this.x += this.mov_x * speed;
         this.y += this.mov_y * speed;
     }

    this.assertXYReset = function () {
	    if (this.x < 0){
	        this.x = exports.area.width;
	    }
	    if (this.x > exports.area.width){
	        this.x = 0;
	    }
	    if (this.y < 0){
	        this.y = exports.area.height;
	    }
	    if (this.y > exports.area.height){
	        this.y = 0;
	    }
 	}
};