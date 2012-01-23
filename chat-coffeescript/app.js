
/*
Module dependencies.
*/

(function() {
  var app, express, io, nib, nicknames, sio, stylus;

  express = require('express');

  stylus = require('stylus');

  nib = require('nib');

  sio = require('socket.io');

  /*
  App.
  */

  app = express.createServer();

  /*
  App configuration.
  */

  app.configure(function() {
    var compile;
    compile = function(str, path) {
      return stylus(str).set('filename', path).use(nib());
    };
    app.use(stylus.middleware({
      src: __dirname + '/public',
      compile: compile
    }));
    app.use(express.static(__dirname + '/public'));
    app.set('views', __dirname);
    return app.set('view engine', 'jade');
  });

  /*
  App routes.
  */

  app.get('/', function(req, res) {
    return res.render('index', {
      layout: false
    });
  });

  /*
  App listen.
  */

  app.listen(3000, function() {
    var addr;
    addr = app.address();
    return console.log('   app listening on http://' + addr.address + ':' + addr.port);
  });

  /*
  Socket.IO server (single process only)
  */

  io = sio.listen(app);

  nicknames = {};

  io.sockets.on('connection', function(socket) {
    socket.on('user message', function(msg) {
      return socket.broadcast.emit('user message', socket.nickname, msg);
    });
    socket.on('nickname', function(nick, fn) {
      if (nicknames[nick]) {
        return fn(true);
      } else {
        fn(false);
        nicknames[nick] = socket.nickname = nick;
        socket.broadcast.emit('announcement', nick + ' connected');
        return io.sockets.emit('nicknames', nicknames);
      }
    });
    return socket.on('disconnect', function() {
      if (!socket.nickname) return;
      delete nicknames[socket.nickname];
      socket.broadcast.emit('announcement', socket.nickname + ' disconnected');
      return socket.broadcast.emit('nicknames', nicknames);
    });
  });

}).call(this);
