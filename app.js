
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , shared = require('./public/javascripts/shared.js')
  , _und = require('underscore');

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

var ships = {};
var colors = ["red", "blue"];

_und.extend(shared.Ship.prototype, {
       rotateLeft: function (){
         this.rotation = -0.07;
       },
       rotateRight: function (){
         this.rotation = 0.07;
       },
       forward: function (){
         this.rotation = 0;
         this.mov_x = Math.sin(this.angle);
         this.mov_y = -Math.cos(this.angle);
       },
       backward: function (){
         this.rotation = 0;
         this.mov_x = -Math.sin(this.angle);
         this.mov_y = Math.cos(this.angle); 
       },
       shoot: function () {
       }
  });

// Socket IO

var io = require('socket.io').listen(app);
io.set('log level', 1);

io.sockets.on('connection', function (socket) {
  
  socket.on('join', function (ship) {
     console.log("Join: " + socket.id);         
     var s = new shared.Ship(500,500,colors.pop(),0,0,0,0);
     ships[socket.id] = s;
     io.sockets.emit('update', ships);
  });

  socket.on('disconnect', function () {
    colors.push(ships[socket.id].color);
    delete ships[socket.id];
    io.sockets.emit('update', ships);
  });
  
  socket.on('action', function (dir){
    console.log("socket.id "+socket.id+" does action: "+dir);
    switch (dir)
    {
      case "rotateLeft" : 
            ships[socket.id].rotateLeft(); 
            break;
      case "forward" : 
            ships[socket.id].forward();
            break;
      case "rotateRight" :
            ships[socket.id].rotateRight(); 
            break;
      case "backward": 
            ships[socket.id].backward();
            break;
      case "shoot": 
            ships[socket.id].shoot();
            break; 
    }
    io.sockets.emit('update', ships);
  }); 

});

setInterval(function (){
  for(var key in ships) {
      ships[key].move();
  }
},1000 / shared.FPS);
