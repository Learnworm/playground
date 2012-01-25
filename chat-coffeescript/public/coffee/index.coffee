$ = jQuery

###
socket.io specific code
###

socket = io.connect()

socket.on('connect', ->
  $('#chat').addClass('connected'))

socket.on('announcement', (dirty_msg) ->
  $('#lines').append($('<p>').append($('<em>').text(dirty_msg))))

socket.on('nicknames', (dirty_nicknames) ->
  $('#nicknames').empty().append($('<span>Online: </span>'))
  $('#nicknames').append($('<b>').text(dirty_nick)) for dirty_nick of dirty_nicknames)

message = (dirty_from, dirty_msg) ->
  $('#lines').append($('<p>').append($('<b>').text(dirty_from), $('<span>').text(dirty_msg)))

socket.on('user message', message)

socket.on('reconnect', ->
  $('#lines').remove()
  message('System', 'Reconnected to the server'))

socket.on('reconnecting', ->
  message('System', 'Attempting to re-connect to the server'))

# TODO: Decide/determine if error strings are untrusted and should be escaped.
socket.on('error', (e) ->
  message('System', e ? 'A unknown error occurred'))


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
      
      $('#nickname-err').css('visibility', 'visible'))
    return false)

  $('#send-message').submit(->
    message('me', $('#message').val())
    socket.emit('user message', $('#message').val())
    clear()
    $('#lines').get(0).scrollTop = 10000000
    return false)
