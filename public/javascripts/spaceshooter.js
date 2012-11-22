
var spaceshooter = function (socket){

    var canvas = null,
        ctx = null,
        items = {},
        controls = null;

    var Ship = {
      x : 0,
      y : 0,
      angle : 0,
      color : null,
      init : function (x, y, color, angle) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.angle = angle;
      },
      draw : function (ctx) {
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
    };
   
   var repaint = function (ctx){
        ctx.fillStyle = "rgb(140,140,140)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        for(var key in items) {
          if (items.hasOwnProperty(key)) {
            items[key].draw(ctx);
          }
        }
   };
   
   var Controls = {
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
        controls = Object.create(Controls);
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
      var ships = JSON.parse(data);
      for(var key in ships) {
        if (ships.hasOwnProperty(key)) {
            var s = Object.create(Ship);
            s.init(ships[key].x,ships[key].y,ships[key].color,ships[key].angle);
            items[key] = s; 
        }
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