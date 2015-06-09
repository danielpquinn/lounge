
// User related operations

// Dependencies

var AuthToken = require('../models/auth-token');
var bcrypt = require('bcrypt');
var config = require('../config.js');
var emailClient = require('../clients/email');
var Promise = require('bluebird');
var User = require('../models/user');
var Message = require('../models/message');
var uuid = require('node-uuid');

// Constructor

function UserController() {}

// Sign up

UserController.signUp = function (username, email, password) {
  var baseUrl = config.protocol + '://' + config.host;
  var user;
  var authToken;

  // Add port to config if one is supplied

  if (config.port) { baseUrl += ':' + config.port; }

  // Create a new user

  user = new User({
    username: username,
    email: email,
    password: password
  });

  // Attempt to save the newly created user

  return user.saveAsync()
    .then(function () {

      // Generate a new auth token

      authToken = new AuthToken({
        token: uuid.v4(),
        user: user._id
      });

      // Save auth token

      return authToken.saveAsync();
    })
    .then(function () {

      // Send user an email verification link. Link will contain
      // the token generated above, which will log the user in when they
      // land on the page and mark their email address as validated

      return emailClient.sendMailAsync({
        from: config.email,
        to: user.email,
        subject: 'Verify your ' + config.siteName + ' account',
        html: 'Follow this link to verify your account: ' + baseUrl + '?verifyEmailToken=' + authToken.token
      });
    })
    .then(function (info) {

      // Show user a successfull account created message

      return {
        command: 'signup',
        message: 'Account created. Check your email for a verification link'
      };
    });
};

// Sign in

UserController.signIn = function (email, password) {
  var user;

  // Find user with supplied email address

  return User.findOne({ email: email })
    .execAsync()
    .then(function (doc) {
      var compare = Promise.promisify(bcrypt.compare);

      // No user with this email address was found, thow an error

      if (!doc) { throw new Error('Invalid email or password'); }

      // Set user to doc

      user = doc;

      // Use bcrypt to compare supplied password with on in db
      
      return compare(password, user.password);
    }).then(function (res) {

      // Passwords don't match, throw an error

      if (!res) { throw new Error('Invalid email or password'); }

      // Remove all of this user's tokens

      return AuthToken.removeAsync({ user: user._id });
    }).then(function () {

      // Create a new token for this user

      return new AuthToken({
        token: uuid.v4(),
        user: user._id
      }).saveAsync();
    })
    .then(function (token) {

      // Send back a successful login response. Client will store token
      // and use it to authenticate future requests

      return {
        command: 'signin',
        token: token[0].token,
        message: 'signed in as ' + user.username
      };
    });
};

// Sign out

UserController.signOut = function (user) {

  // Prevent users from logging other users out

  if (!user) { throw new Error('You are not signed in'); }

  // Remove user's tokens

  return AuthToken.removeAsync({ user: user._id })
    .then(function () {

      // Send a signout message back to the user

      return {
        command: 'signout',
        message: 'l8r h8r'
      }
    });
};

// Verify a user's email address

UserController.verifyEmail = function (token) {
  var authToken, user;

  // Find a user with a matching token

  return AuthToken.findOne({ token: token })
    .populate('user')
    .execAsync()
    .then(function (doc) {

      // Couldn't find a user with that token

      if (!doc) { throw new Error('Invalid token'); }

      authToken = doc;

      // Return a new user so emailVerified property can
      // be updated

      return User.findOneAsync({ _id: authToken.user });
    })
    .then(function (doc) {
      user = doc;

      // Set emailVerified to true

      user.set('emailVerified', true);

      // Save update

      return user.saveAsync();
    })
    .then(function () {

      // Send back token

      return authToken;
    });
};

// Authenticate a user. Happens on every message from client

UserController.authenticate = function (token) {
  var user;

  // Apparently this is a promise anti-pattern,
  // but I couldn't figure out a better way to return
  // a resolved promise

  if (!token) { return new Promise(function (r) { r(); }); }

  // Find an auth token that matches the on in the client request

  return AuthToken.findOne({ token: token })
    .populate('user')
    .execAsync()
    .then(function (authToken) {

      // Return a user object, or undefined if authentication failed

      return authToken ? authToken.user : undefined;
    });
};

// Request a password reset link

UserController.resetPassword = function (email) {
  var baseUrl = config.protocol + '://' + config.host;
  var user;
  var authToken;

  if (config.port) { baseUrl += ':' + config.port; }

  // Find a user with the supplied email

  return User.findOneAsync({ email: email })
    .then(function (doc) {

      // Email doesn't match anything in database, throw error

      if (!doc) { throw new Error('Could not find a user with that email address'); }

      user = doc;

      // Create a new token

      authToken = new AuthToken({
        token: uuid.v4(),
        user: user._id
      });

      // Save token

      return authToken.saveAsync();
    })
    .then(function () {

      // Send user a password reset link, which includes the token.
      // Clicking the link will log the user in and show them how to
      // reset their password using the /updateaccount command

      return emailClient.sendMailAsync({
        from: config.email,
        to: user.email,
        subject: 'Reset your ' + config.siteName + ' password',
        html: 'Follow this link to reset your password: ' + baseUrl + '?resetPasswordToken=' + authToken.token
      });
    })
    .then(function (info) {

      // Let user know that an email has been sent

      return {
        command: 'resetPassword',
        message: 'Check your email for a password reset link'
      };
    });
};

// Update a user

UserController.update = function (user, username, email, password) {

  // Must be signed in to update a user

  if (!user) { throw new Error('You are not signed in'); }

  // Nothing to update, throw error

  if (!username && !email && !password) { throw new Error('No fields supplied'); }

  // Set properties if supplied

  if (username) { user.set('username', username); }
  if (email) { user.set('email', email); }
  if (password) { user.set('password', password); }

  // Save updates

  return user.saveAsync()
    .then(function () {
      return {
        message: 'Account updated'
      };
    });
};

// Remove the most recent message

UserController.removeLastMessage = function (user) {
  var message;

  // Must be signed in to update a user

  if (!user) { throw new Error('You are not signed in'); }

  // First find message so it's _id can be passed back to the client

  return Message.find({ user: user._id })
    .sort('-created')
    .limit(1)
    .findAsync()
    .then(function (docs) {

      // Throw error if nothing was found

      if (!docs[0]) { throw new Error('No message to remove'); }

      message = docs[0];

      // Actuall remove the message

      return message.removeAsync();
    }).then(function () {

      // Send id back to client so it can be removed

      return {
        command: 'removelastmessage',
        _id: message._id
      }
    });
};

// Exports

module.exports = UserController;