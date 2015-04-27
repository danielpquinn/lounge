var AuthToken = require('../models/auth-token');
var email = require('../clients/email');
var Promise = require('bluebird');
var User = require('../models/user');

function UserController() {}

UserController.prototype.createAccount = function (username, email, password) {
  var d = new Promise().defer();
  var user = new User({
    username: username,
    email: email,
    password: password
  });

  user.save(function (err) {
    if (err) { return d.reject(err); }

  });

  return d.promise;
};

module.exports = UserController;