
var spaceshooter = function (socket){

    var canvas = null,
        ctx = null,
        items = [],
        controls = null;
      
    _.extend(exports.Ship.prototype, {
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
    });

    _.extend(exports.Bullet.prototype, {
        draw: function (ctx) {
          ctx.save();
          ctx.beginPath();
          ctx.arc(this.x, this.y, 10, 0, 2 * Math.PI, false);
          ctx.closePath();
          ctx.fillStyle = 'green';
          ctx.fill();
          ctx.lineWidth = 2;
          ctx.strokeStyle = '#003300';
          ctx.stroke();
          ctx.restore();
        }
    });

    var repaint = function (ctx){
        ctx.fillStyle = "rgb(140,140,140)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        _.each(items, function (item){
            item.draw(ctx);
        });
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
      console.log(data);
      items = [];
      for(var key in data.ships) {
          items.push(new exports.Ship(
            data.ships[key].x,
            data.ships[key].y,
            data.ships[key].color,
            data.ships[key].angle,
            data.ships[key].mov_x,
            data.ships[key].mov_y,
            data.ships[key].rotation));
          }
          _.each(data.bullets, function (bullet){
               items.push(new exports.Bullet(
                  bullet.x,
                  bullet.y,
                  bullet.angle,
                  bullet.id
              ));
           });
  });
   
   return { start : function (canvasId) {
        canvas = $(canvasId)[0];
        ctx = canvas.getContext('2d');
        repaint(ctx);
        join();
        initControls();   
        setInterval(function (){
            repaint(ctx);
            _.each(items, function (item){
              item.move();
            });
        },1000 / exports.FPS);
      }
   };
};