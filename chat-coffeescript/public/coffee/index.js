(function() {
  var $, message, socket;

  $ = jQuery;

  /*
  socket.io specific code
  */

  socket = io.connect();

  socket.on('connect', function() {
    return $('#chat').addClass('connected');
  });

  socket.on('announcement', function(msg) {
    return $('#lines').append($('<p>').append($('<em>').text(msg)));
  });

  socket.on('nicknames', function(nicknames) {
    var nick, _results;
    $('#nicknames').empty().append($('<span>Online: </span>'));
    _results = [];
    for (nick in nicknames) {
      _results.push($('#nicknames').append($('<b>').text(nick)));
    }
    return _results;
  });

  message = function(from, msg) {
    return $('#lines').append($('<p>').append($('<b>').text(from), msg));
  };

  socket.on('user message', message);

  socket.on('reconnect', function() {
    $('#lines').remove();
    return message('System', 'Reconnected to the server');
  });

  socket.on('reconnecting', function() {
    return message('System', 'Attempting to re-connect to the server');
  });

  socket.on('error', function(e) {
    return message('System', e != null ? e : 'A unknown error occurred');
  });

  /*
  DOM manipulation
  */

  $(function() {
    var clear;
    clear = function() {
      return $('#message').val('').focus();
    };
    $('#set-nickname').submit(function(ev) {
      socket.emit('nickname', $('#nick').val(), function(set) {
        if (!set) {
          clear();
          return $('#chat').addClass('nickname-set');
        }
        return $('#nickname-err').css('visibility', 'visible');
      });
      return false;
    });
    return $('#send-message').submit(function() {
      message('me', $('#message').val());
      socket.emit('user message', $('#message').val());
      clear();
      $('#lines').get(0).scrollTop = 10000000;
      return false;
    });
  });

}).call(this);
