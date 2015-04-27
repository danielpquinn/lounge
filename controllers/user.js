var AuthToken = require('../models/auth-token');
var bcrypt = require('bcrypt');
var config = require('../config.js');
var emailClient = require('../clients/email');
var User = require('../models/user');
var uuid = require('node-uuid');

function UserController() {}

UserController.prototype.signUp = function (username, email, password) {
  var baseUrl = config.protocol + '://' + config.host;
  var token = uuid.v4();

  if (config.port) { baseUrl += ':' + config.port; }

  var user = new User({
    username: username,
    email: email,
    password: password,
    verifyEmailToken: token
  });

 return user.saveAsync()
  .then(function () {
    return emailClient.sendMailAsync({
      from: config.email,
      to: user.email,
      subject: 'Verify your ' + config.siteName + ' account',
      html: 'Follow this link to verify your account: ' + baseUrl + '?verifyEmailToken=' + token
    });
  })
  .then(function (info) {
    return 'Account created. Check your email for a verification link.';
  });
};

UserController.prototype.signIn = function (username, email, password) {
  if ((!username || !email) || !password)
};

module.exports = UserController;