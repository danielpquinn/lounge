
// Home page controller

// Dependencies

var config = require('../config');
var AuthToken = require('../models/auth-token');
var Message = require('../models/message');
var User = require('../models/user');
var UserController = require('./user');
var uuid = require('node-uuid');

// Exports

module.exports = function (req, res, next) {
  var user;
  var promise;

  // Add url data to locals
  
  res.locals.title = config.siteName;
  res.locals.protocol = config.protocol;
  res.locals.host = config.host;
  res.locals.ip = config.ip;
  res.locals.port = config.port;
  res.locals.siteBanner = config.siteBanner;
  res.locals.messages = [];

  // Check query parameters for actions, route to appropriate
  // controller method if necessary

  if (req.query.verifyEmailToken) {
    promise = UserController.verifyEmail(req.query.verifyEmailToken);
  } else if (req.query.resetPasswordToken) {
    promise = AuthToken.findOne({ token: req.query.resetPasswordToken })
      .populate('user')
      .execAsync();
  } else {
    promise = new Promise(function (resolve, reject) { resolve(); });
  }
  
  promise.then(function (authToken) {
    var message;

    // If the previous action returned an auth token, add it to
    // locals. Client will send this along with future requests,
    // effectively logging in the user

    if (authToken) {
      message = { username: authToken.user.username };

      res.locals.authToken = authToken.token;

      // Add appropriate messaging to initial page render

      if (req.query.verifyEmailToken) {
        message.text = '<span class="info">Email verified, signed in as ' + authToken.user.username + '</span>';
      }
      if (req.query.resetPasswordToken) {
        message.text = '<span class="info">Signed in as ' + authToken.user.username + '. to update your password type "/updateaccount -p yourpassword"</span>';
      }

      res.locals.messages.push(message);
    } else {

      // Add welcome message
      
      res.locals.messages.push({
        username: 'system',
        text: '<span class="info">Welcome. type "/help" and hit enter if you\'re not sure what to do next</span>'
      });
    }

    // Render home page

    res.render('home');
  })
  .catch(next);
};