
// Sends back most recent messages in reverse chronological order

// Dependencies

var Message = require('../models/message');
var Expander = require('../lib/expander');
var AutoLinker = require('autolinker');

// Export express route handler

module.exports = function (req, res, next) {

  // Get 25 most recent messages

  Message.find()
    .sort('-created')
    .limit(25)
    .populate('user')
    .execAsync()
    .then(function (messages) {

      // Newest message should appear at bottom of list

      messages.reverse();

      // Add messages to locals

      messages = messages.map(function (message) {
        var text = message.text;

        // Expand links

        text = Expander.youtube(text);
        text = Expander.image(text);
        text = AutoLinker.link(text);

        return {
          username: message.user ? message.user.username : 'anonymous',
          text: text,
          _id: message._id
        };
      });

      res.json(messages);
    })
    .catch(next);
};