var utils = {};

utils.degToRad = function (d){
    // Converts degrees to radians
    return d * 0.0174532925199432957;
}

var spaceshooter = (function (){

    var canvas = null,
        ctx = null,
        items = [],
        ship = null;

        
    var Ship = function(x,y,rot){
       this.x = x;
       this.y = y;
       this.mov_x = 0;
       this.mov_y = 0;
       this.angle = 0;
       this.rotation = 0;
       
       this.move = function (){
         this.angle += this.rotation;
         this.x += this.mov_x;
         this.y += this.mov_y;
       };
       
       this.rotateLeft = function (){
         this.rotation = -0.13;
       }
       
       this.rotateRight = function (){
         this.rotation = 0.13;
       }
       
       this.forward = function (){
         this.rotation = 0;
         this.mov_x = Math.sin(this.angle) * 3;
         this.mov_y = -Math.cos(this.angle) * 3;
       }
       
       this.backward = function (){
         this.rotation = 0;
         this.mov_x = -Math.sin(this.angle) * 3;
         this.mov_y = Math.cos(this.angle) * 3; 
       }
       
       this.draw = function (ctx){
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.beginPath();
        ctx.moveTo(0, -20);
        ctx.lineTo(-20, 20);
        ctx.lineTo(0, 10);
        ctx.lineTo(20, 20);
        ctx.closePath();
        ctx.fillStyle = 'blue';
        ctx.fill();
        ctx.lineWidth=2;
        ctx.stroke();
        ctx.restore();
       }
    }    
   
   var repaint = function (ctx){
        ctx.fillStyle = "rgb(140,140,140)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        _.each(items,function (item){
          item.draw(ctx);
        });
   };
   
   
   var initControls = function() {
        $(window).keydown(function(e){
        switch (e.keyCode)
        {
         case 37: ship.rotateLeft();break;
         case 38: ship.forward();break;
         case 39: ship.rotateRight();break;
         case 40: ship.backward();break;
        }
      });
   };
   
   return { start : function (canvasId){
      canvas = $(canvasId)[0];
      ctx = canvas.getContext('2d');
      ship = new Ship(500,500,0.13)
      items.push(ship);
      items.push(new Ship(200,200,0));
      initControls();
      setInterval(function (){
         repaint(ctx);
         _.each(items,function (item){
           item.move();
         });
      },20);
   }
   };
})();