var express = require('express');
var http = require('http');
var path = require('path');
var app = express();

// all environments
app.set('port', process.env.PORT || 8001);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// app.get('/', function(req, res) {
//     res.send("Hello from Kalukis-Server");
// });

var server = http.createServer(app).listen(app.get('port'), function(){
  console.log('Kalukis-Server listening on port ' + app.get('port'));
});
var io = require('socket.io').listen(server);

io.sockets.on('connection', function (socket) {
    socket.on('brushmove', function (data) {
        socket.broadcast.emit('brushmove', data);
    });
    socket.on('brushup', function () {
        socket.broadcast.emit('brushup');
    });
    socket.on('brushdown', function (data) {
        socket.broadcast.emit('brushdown', data);
    });

    socket.on('createText', function (data) {
        socket.broadcast.emit('createText', data);
    });

    socket.on('createShirt', function (data) {
        socket.broadcast.emit('createShirt', data);
    });

    socket.on('controlObject', function (data) {
        socket.broadcast.emit('controlObject', data);
    });

    socket.on('canvasClear', function (data) {
        socket.broadcast.emit('canvasClear', data);
    });

    socket.on('canvasRemove', function (data) {
        socket.broadcast.emit('canvasRemove', data);
    });

    socket.on('brushProperties', function (data) {
        socket.broadcast.emit('brushProperties', data);
    });

    socket.on('brushActive', function (data) {
        socket.broadcast.emit('brushActive', data);
    });

    socket.on('outlineBrush', function (data) {
        socket.broadcast.emit('outlineBrush', data);
    });

    socket.on('imagePainter', function (data) {
        socket.broadcast.emit('imagePainter', data);
    });
});