
if(typeof exports == 'undefined'){
    var exports = {};
}

exports.FPS = 50;

exports.Ship = function(x, y, color, angle, m_x, m_y, rot) {
      
      this.x = x;
      this.y = y;
      this.color = color;
      this.angle = angle;
      this.mov_x = m_x;
      this.mov_y = m_y;
      this.rotation = rot;
      var canvas = { height: 600, width: 800 }
      , speed = 4;
     
      this.move = function () {
         this.assertXYReset.apply(this);
         this.angle += this.rotation;
         this.x += this.mov_x * speed;
         this.y += this.mov_y * speed;
     }

     this.assertXYReset = function () {
	     if (this.x < 0){
	        this.x = canvas.width;
	     }
	     if (this.x > canvas.width){
	        this.x = 0;
	     }
	     if (this.y < 0){
	        this.y = canvas.height;
	     }
	     if (this.y > canvas.height){
	        this.y = 0;
	     }
 	}
};