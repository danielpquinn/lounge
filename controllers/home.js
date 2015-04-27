var Message = require('../models/message');

module.exports = function (req, res, next) {
  Message.find().sort('-created').exec(function (err, messages) {
    res.locals.messages = messages;
    res.render('home');
  });
};