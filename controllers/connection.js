var Message = require('../models/message');
var striptags = require('striptags');

module.exports = function (socket) {
  var io = this;

  var parseCommand = function (input) {
    var parts, command, args;
    parts = input.match(/(^\/\w+)|(-[^-]+)/g);
    if (!parts) { return; }
    command = parts[0].trim().replace('/', '');
    args = [];
    for (var i = 1; i < parts.length; i += 1) {
      var bits = parts[i].split(' ');
      var arg = {};
      arg[bits[0].replace('-', '')] = bits[1].trim();
      args.push(arg);
    }
    return {
      command: command,
      args: args
    };
  };

  socket.on('message', function (data) {
    var command;
    var messageText = striptags(data.message)

    if (messageText.charAt(0) === '/') {
      console.log(parseCommand(messageText));
    } else {
      var message = new Message({ text: messageText });
      message.save(function (err) {
        if (err) {
          return socket.emit('error', {
            error: err.message
          });
        }
        console.log(message.toObject());
        io.emit('message', message.toObject());
      });
    }
  });
};