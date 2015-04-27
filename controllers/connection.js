var CommandController = require('./command');
var Message = require('../models/message');
var striptags = require('striptags');
var UserController = require('./user');

module.exports = function (socket) {
  var io = this;

  socket.on('message', function (data) {
    var command;
    var messageText;

    if (!data.text) { return; }

    messageText = striptags(data.text);

    if (messageText.charAt(0) === '/') {
      new CommandController()
        .runCommand(data.text)
        .then(function (result) { socket.emit('info', result); })
        .catch(function (result) {
          socket.emit('warning', (result ? (result.message || result) : 'Error'));
        });
    } else {
      var message = new Message({ text: messageText });
      message.saveAsync(function () {
        io.emit('message', message.toObject());
      })
      .catch(function (err) {
        socket.emit('warning', err.message);
      });
    }
  });
};