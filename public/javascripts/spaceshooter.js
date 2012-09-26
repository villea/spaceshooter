var utils = {};

utils.degToRad = function (d){
    // Converts degrees to radians
    return d * 0.0174532925199432957;
}



var spaceshooter = (function (){

    var FPS = 50;

    var canvas = null,
        ctx = null,
        items = [],
        ship = null;

        
    var Ship = function(x,y,color){
       this.x = x;
       this.y = y;
       var mov_x = 0,
           mov_y = 0,
           angle = 0,
           rotation = 0,
           speed = 4;
       
       this.move = function (){
         assertXYReset.apply(this);
         angle += rotation;
         this.x += mov_x * speed;
         this.y += mov_y * speed;
       };
       
       this.rotateLeft = function (){
         rotation = -0.07;
       }
       
       this.rotateRight = function (){
         rotation = 0.07;
       }
       
       this.forward = function (){
         rotation = 0;
         mov_x = Math.sin(angle);
         mov_y = -Math.cos(angle);
       }
       
       this.backward = function (){
         rotation = 0;
         mov_x = -Math.sin(angle);
         mov_y = Math.cos(angle); 
       }
       
       this.draw = function (ctx){
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.moveTo(0, -20);
        ctx.lineTo(-20, 20);
        ctx.lineTo(0, 10);
        ctx.lineTo(20, 20);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
        ctx.lineWidth=2;
        ctx.stroke();
        ctx.restore();
       }
       
       var assertXYReset = function (){
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
      ship = new Ship(500,500,'red')
      items.push(ship);
      items.push(new Ship(200,200,'blue'));
      initControls();
      setInterval(function (){
         repaint(ctx);
         _.each(items,function (item){
           item.move();
         });
      },1000 / FPS);
   }
   };
})();