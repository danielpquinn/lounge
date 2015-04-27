var AuthToken = require('../models/auth-token');
var Message = require('../models/message');
var User = require('../models/user');
var uuid = require('node-uuid');

module.exports = function (req, res, next) {
  var user;

  Message.find().sort('-created').limit(50).execAsync()
    .then(function (messages) {
      res.locals.messages = messages;
    })
    .then(function () {
      if (req.query.verifyEmailToken) {
        return User.findOneAsync({ verifyEmailToken: req.query.verifyEmailToken });
      }
    })
    .then(function (document) {
      var authToken;
      if (document && !document.emailVerified) {
        user = document;
        authToken = new AuthToken({
          user: user._id,
          token: uuid.v4()
        });
        return authToken.saveAsync();
      }
    })
    .then(function () {
      if (user) {
        user.set('emailVerified', true);
        return user.saveAsync();
      }
    })
    .then(function (authToken) {
      if (authToken) { res.locals.authToken = authToken.token; }
      res.render('home');
    })
    .catch(next);
};