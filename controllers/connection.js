
// Handles connections from clients

// Dependencies

var CommandController = require('./command');
var Message = require('../models/message');
var AutoLinker = require('autolinker');
var striptags = require('striptags');
var UserController = require('./user');
var winston = require('winston');

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
        
              // Log result

              winston.log('info', result);

              // Send result back to client

              socket.emit('command', result);
            });
        }

        // If no command matched and user is not signed in
        // throw an error

        if (!user) {
          throw new Error('You are not signed in');
        }

        // Create a new message

        message = new Message({
          text: messageText,
          user: user._id
        });

        // Save message

        return message.saveAsync(function () {
          var response = {
            username: user.username,
            text: AutoLinker.link(message.text),
            _id: message._id
          };
        
          // Log message

          winston.log('info', response);

          // Send newly saved message out to all clients

          io.emit('message', response);
        });
      })
      .catch(function (err) {
        
        // Log error

        winston.log('error', err);

        // Let user know what went wrong

        socket.emit('warning', err.message);
      });
  });
};