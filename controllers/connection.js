
// Handles connections from clients

// Dependencies

var CommandController = require('./command');
var Expander = require('../lib/expander');
var Message = require('../models/message');
var AutoLinker = require('autolinker');
var session = require('./session');
var striptags = require('striptags');
var UserController = require('./user');
var winston = require('winston');

// Exports

module.exports = function (socket) {
  var io = this;
  var currentUser, user, message;

  // Remove user from logged in users on disconnect
  
  socket.on('disconnect', function (data) {

    if (!currentUser) { return; }

    // Remove user from session singleton

    session.removeUser(currentUser);

    // Send message to clients

    io.emit('message', {
      username: 'system',
      text: '<span class="info">' + currentUser.username + ' has disconnected</span>'
    });
  });

  // Handle message from client

  socket.on('message', function (data) {

    // Ignore message if there is no text property

    if (!data.text) { return; }

    // Authenticate on every message

    UserController.authenticate(data.token)
      .then(function (doc) {
        var command, messageText;

        user = doc;

        // Add user to session
        
        if (user) { currentUser = user; session.addUser(user); }

        // If this is a command, run it

        if (data.text.charAt(0) === '/') {
          return CommandController.runCommand(user, data.text)
            .then(function (result) {
        
              // Log result

              winston.log('info', result);

              // Send result back to client

              // If this was a me or a move command, tell everybody

              if ([ 'me', 'move', 'pickup', 'drop', 'removelastmessage' ].indexOf(result.command) >= 0) {
                io.emit('command', result);
              } else {
                socket.emit('command', result);
              }
            });
        }

        // Strip tags from user input

        messageText = striptags(data.text);

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

        return message.saveAsync();
      })
      .then(function () {
        var text = message.text;

        var response = {
          username: user.username,
          _id: message._id
        };

        // Expand links

        text = Expander.youtube(text);
        text = Expander.image(text);
        text = AutoLinker.link(text);

        response.text = text;

        // Send newly saved message out to all clients

        io.emit('message', response);
      })
      .catch(function (err) {
        
        // Log error

        winston.log('error', err);

        // Let user know what went wrong

        socket.emit('warning', err.message);
      });
  });
};