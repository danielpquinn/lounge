
// Handles connections from clients

// Dependencies

var CommandController = require('./command');
var Message = require('../models/message');
var AutoLinker = require('autolinker');
var striptags = require('striptags');
var UserController = require('./user');

// Exports

module.exports = function (socket) {
  var io = this;

  // Handle message from client

  socket.on('message', function (data) {

    // Ignore message if there is no text property

    if (!data.text) { return; }

    // Authenticate on every message

    UserController.authenticate(data.token)
      .then(function (user) {
        var command, message, messageText;

        // Strip tags from user input

        messageText = striptags(data.text);

        // If this is a command, run it

        if (messageText.charAt(0) === '/') {
          return CommandController.runCommand(user, data.text)
            .then(function (result) {

              // Send result back to client

              socket.emit('command', result);
            });
        }

        // Create a new message

        message = new Message({
          text: messageText,
          user: user ? user._id : undefined
        });

        // Save message

        return message.saveAsync(function () {

          // Send newly saved message out to all clients

          io.emit('message', {
            username: user ? user.username : 'anonymous',
            text: AutoLinker.link(message.text)
          });
        });
      })
      .catch(function (err) {

        // Let user know what went wrong

        socket.emit('warning', err.message);
      });
  });
};