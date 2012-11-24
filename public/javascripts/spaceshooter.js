
var spaceshooter = function (socket){

    var canvas = null,
        ctx = null,
        items = {},
        controls = null;

    var ExtendShip = {
        draw: function (ctx) 
        {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angle);
            ctx.beginPath();
            ctx.moveTo(0, -20);
            ctx.lineTo(-20, 20);
            ctx.lineTo(0, 10);
            ctx.lineTo(20, 20);
            ctx.closePath();
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.lineWidth=2;
            ctx.stroke();
            ctx.restore();
        }
    }

    _.extend(exports.Ship.prototype, ExtendShip);

    var repaint = function (ctx){
        ctx.fillStyle = "rgb(140,140,140)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        for(var key in items) {
            items[key].draw(ctx);
        }
   };
   
   var controls = {
      rotateLeft : function () {
         socket.emit("action","rotateLeft");
       },
       rotateRight : function () {
         socket.emit("action","rotateRight");
       },
       forward : function () {
         socket.emit("action","forward");
       },
       backward : function () {
         socket.emit("action","backward");
       },
       shoot : function () {
         socket.emit("action", "shoot");
       }
   }
   
   var initControls = function() {
        $(window).keydown(function(e){
        switch (e.keyCode)
        {
          case 37: controls.rotateLeft();break;
          case 38: controls.forward();break;
          case 39: controls.rotateRight();break;
          case 40: controls.backward();break;
          case 32: controls.shoot();break;
        }
      });
   };

  function join() {
      socket.emit('join');
   };

  socket.on('update', function (data) {
      items = {};
      for(var key in data) {
            var s = new exports.Ship(
              data[key].x,
              data[key].y,
              data[key].color,
              data[key].angle,
              data[key].mov_x,
              data[key].mov_y,
              data[key].rotation);
            items[key] = s; 
      }
      ctx = canvas.getContext('2d');
      repaint(ctx);
  });
   
   return { start : function (canvasId) {
        canvas = $(canvasId)[0];
        join();
        initControls();   
      }
   };
};