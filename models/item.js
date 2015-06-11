
// Item model

// Dependencies

var mongoose = require('mongoose');
var Promise = require('bluebird');

// Schema

var schema = mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true }
});

// Middleware

schema.pre('remove', function (next) {
  var saves = [];
  var self = this;

  // Remove from user inventories
  
  mongoose.model('User').findAsync()
    .then(function (users) {
      users.forEach(function (user) {
        user.inventory = user.inventory.filter(function (item) {
          return !self._id.equals(item);
        });
        saves.push(user.saveAsync());
      });

      return Promise.all(saves);
    })
    .then(function () {
      next();
    })
    .catch(next);

});

// Exports

module.exports = mongoose.model('Item', schema);