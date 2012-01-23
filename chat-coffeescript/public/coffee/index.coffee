$ = jQuery

###
socket.io specific code
###

socket = io.connect()

socket.on('connect', ->
  $('#chat').addClass('connected')
)

socket.on('announcement', (msg) ->
  $('#lines').append($('<p>').append($('<em>').text(msg)))
)

socket.on('nicknames', (nicknames) ->
  $('#nicknames').empty().append($('<span>Online: </span>'))
  $('#nicknames').append($('<b>').text(nick)) for nick of nicknames
)

message = (from, msg) ->
  $('#lines').append($('<p>').append($('<b>').text(from), msg))


socket.on('user message', message)

socket.on('reconnect', ->
  $('#lines').remove()
  message('System', 'Reconnected to the server')
)

socket.on('reconnecting', ->
  message('System', 'Attempting to re-connect to the server')
)

socket.on('error', (e) ->
  message('System', e ? 'A unknown error occurred')
)


###
DOM manipulation
###

$ ->

  clear = ->
    $('#message').val('').focus()

  $('#set-nickname').submit((ev) ->
    socket.emit('nickname', $('#nick').val(), (set) ->
      if not set 
        clear()
        return $('#chat').addClass('nickname-set')
      
      $('#nickname-err').css('visibility', 'visible')
    )
    return false
  )

  $('#send-message').submit(->
    message('me', $('#message').val())
    socket.emit('user message', $('#message').val())
    clear()
    $('#lines').get(0).scrollTop = 10000000
    return false
  )


