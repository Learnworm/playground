###
Module dependencies.
###

express = require('express')
stylus = require('stylus')
nib = require('nib')
sio = require('socket.io')

###
App.
###

app = express.createServer()

###
App configuration.
###

app.configure( -> 
  compile = (str, path) ->
    return stylus(str).set('filename', path).use(nib())

  app.use(stylus.middleware({ src: __dirname + '/public', compile: compile }))
  app.use(express.static(__dirname + '/public'))
  app.set('views', __dirname)
  app.set('view engine', 'jade'))

###
App routes.
###

app.get('/', (req, res) ->
  res.render('index', { layout: false }))

###
App listen.
###

app.listen(3000, ->
  addr = app.address();
  console.log('   app listening on http://' + addr.address + ':' + addr.port))

###
Socket.IO server (single process only)
###

io = sio.listen(app)
nicknames = {}

io.sockets.on('connection', (socket) ->
  socket.on('user message', (msg) ->
    socket.broadcast.emit('user message', socket.nickname, msg))

  socket.on('nickname', (nick, fn) ->
    if nicknames[nick]
      fn(true)
    else
      fn(false)
      nicknames[nick] = socket.nickname = nick
      socket.broadcast.emit('announcement', nick + ' connected')
      io.sockets.emit('nicknames', nicknames))

  socket.on('disconnect', ->
    if not socket.nickname then return

    delete nicknames[socket.nickname]
    socket.broadcast.emit('announcement', socket.nickname + ' disconnected')
    socket.broadcast.emit('nicknames', nicknames)))
