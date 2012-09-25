var utils = {};

utils.degToRad = function (d){
    // Converts degrees to radians
    return d * 0.0174532925199432957;
}

var spaceshooter = (function (){

    var canvas = null,
        ctx = null,
        items = [];

        
    var Ship = function(x,y,rot){
       this.x = x;
       this.y = y;
       this.angle = 0;;
       
       this.move = function (){
         this.angle += rot;
       };
       
       this.draw = function (ctx){
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.beginPath();
        ctx.moveTo(0, -20);
        ctx.lineTo(-20, 20);
        //ctx.lineTo(0, 10);
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
   
   return { start : function (canvasId){
      canvas = $(canvasId)[0];
      ctx = canvas.getContext('2d');
      items.push(new Ship(100,100,0.13));
      items.push(new Ship(200,200,-0.03));
      setInterval(function (){
         repaint(ctx);
         _.each(items,function (item){
           item.move();
         });
      },20);
   }
   };
})();