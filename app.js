
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', routes.index);

app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});

var FPS = 50;
var ships = {};
var colors = ["red", "blue"];

var Ship = function(x, y, color) {

       this.x = x;
       this.y = y;
       this.color = color;
       this.angle = 0;

       var canvas = { height: 600, width: 800 }
     
       var mov_x = 0,
           mov_y = 0,
           rotation = 0,
           speed = 4;
       
       this.move = function (){
         assertXYReset.apply(this);
         this.angle += rotation;
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

       this.shoot = function () {
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

// Socket IO

var io = require('socket.io').listen(app);

io.sockets.on('connection', function (socket) {
  console.log(socket.id+' connectorz!');
  
  socket.on('server y', function (qstn){
     console.log(qstn);
     socket.emit('reshpwns',"accualy is dolan");
  });

  socket.on('join', function (ship) {
     console.log("Join: " + socket.id);
     var s = new Ship(500,500,colors.pop()); 
     ships[socket.id] = s;
     ship(s);
  });
  
  socket.on('action', function (dir){
    console.log("socket.id "+socket.id+" does action: "+dir);
  }); 

});

setInterval(function (){
  for(var key in ships) {
    if (ships.hasOwnProperty(key)) {
      ships[key].move();
    }
  }
  io.sockets.emit('update', JSON.stringify(ships));
},1000 / FPS);
