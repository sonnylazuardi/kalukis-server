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
});