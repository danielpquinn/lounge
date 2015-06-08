
// Home page controller

// Dependencies

var AuthToken = require('../models/auth-token');
var AutoLinker = require('autolinker');
var Message = require('../models/message');
var User = require('../models/user');
var UserController = require('./user');
var uuid = require('node-uuid');

// Exports

module.exports = function (req, res, next) {
  var user;

  // First find the 25 most recent messages

  Message.find()
    .sort('-created')
    .limit(25)
    .populate('user')
    .execAsync()
    .then(function (messages) {

      // Newest message should appear at bottom of list

      messages.reverse();

      // Add messages to locals

      res.locals.messages = messages.map(function (message) {
        return {
          username: message.user ? message.user.username : 'anonymous',
          text: AutoLinker.link(message.text)
        }
      });
    })
    .then(function () {

      // Check query parameters for actions, route to appropriate
      // controller method if necessary

      if (req.query.verifyEmailToken) {
        return UserController.verifyEmail(req.query.verifyEmailToken);
      }
      if (req.query.resetPasswordToken) {
        return AuthToken.findOne({ token: req.query.resetPasswordToken })
          .populate('user')
          .execAsync();
      }
    })
    .then(function (authToken) {
      var message;

      // If the previous action returned an auth token, add it to
      // locals. Client will send this along with future requests,
      // effectively logging in the user

      if (authToken) {
        message = { username: authToken.user.username };

        res.locals.authToken = authToken.token;

        // Add appropriate messaging to initial page render

        if (req.query.verifyEmailToken) {
          message.text = 'Email verified, signed in as ' + authToken.user.username;
        }
        if (req.query.resetPasswordToken) {
          message.text = 'Signed in as ' + authToken.user.username + '. to update your password type "/updateaccount -p yourpassword"';
        }

        res.locals.messages.push(message);
      }

      // Render home page

      res.render('home');
    })
    .catch(next);
};