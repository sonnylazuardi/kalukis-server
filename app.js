
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 80);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

var users = {};
var activeUser = "";

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

var server = http.createServer(app).listen(app.get('port'), function(){
  console.log('QuizBell server listening on port ' + app.get('port'));
});
var io = require('socket.io').listen(server);

io.sockets.on('connection', function (socket) {
    socket.on('addUser', function (nama) {
        socket.nama = nama;
        users[nama] = nama;
        io.sockets.emit('updateUser', {users: users, message: nama + ' baru saja terhubung'});
    });
    socket.on('updateBulb', function (data) {
        if (data.status == 'bulb_on') {
            if (activeUser == "") {
                activeUser = data.user;
                io.sockets.emit('updateBulb', data);
            }
        } else if (data.status == 'bulb_off') {
            if (activeUser == data.user) {
                activeUser = "";
            }
            io.sockets.emit('updateBulb', data);
        }
    });
    socket.on('disconnect', function () {
        delete users[socket.nama];
        io.sockets.emit('updateUser', {users: users, message: socket.nama + ' terputus'});
    });
});