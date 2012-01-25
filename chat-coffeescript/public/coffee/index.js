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

  socket.on('announcement', function(dirty_msg) {
    return $('#lines').append($('<p>').append($('<em>').text(dirty_msg)));
  });

  socket.on('nicknames', function(dirty_nicknames) {
    var dirty_nick, _results;
    $('#nicknames').empty().append($('<span>Online: </span>'));
    _results = [];
    for (dirty_nick in dirty_nicknames) {
      _results.push($('#nicknames').append($('<b>').text(dirty_nick)));
    }
    return _results;
  });

  message = function(dirty_from, dirty_msg) {
    return $('#lines').append($('<p>').append($('<b>').text(dirty_from), $('<span>').text(dirty_msg)));
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
