io = require 'socket.io-client'

socket = io.connect 'http://localhost:8000'

socket.on 'connect', ->
  console.log 'Connected to server'

socket.on 'message', (msg) ->
  console.log "Received message: #{msg}"

  socket.emit 'message', 'Thanks!'

socket.on 'disconnect', ->
  console.log 'Disconnected from server'
