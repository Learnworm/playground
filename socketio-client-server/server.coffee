io = require 'socket.io'

console.log 'asdf'

server = io.listen 8000

server.sockets.on 'connection', (socket) ->
  socket.on 'disconnect', ->
    console.log 'Client disconnected'

  socket.on 'message', (msg) ->
    console.log "Received message: #{msg}"

  socket.emit 'message', 'welcome!'
