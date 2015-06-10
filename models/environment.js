
// Environment model

// Dependencies

var mongoose = require('mongoose');
var Promise = require('bluebird');

// Schema

var schema = mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  adjacentEnvironments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Environment' }],
  occupants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

// Middleware

schema.pre('remove', function (next) {
  var saves = [];
  var self = this;

  // Remove from adjacent lists
  
  mongoose.model('Environment').findAsync()
    .then(function (rooms) {
      rooms.forEach(function (room) {
        room.adjacentEnvironments = room.adjacentEnvironments.filter(function (room) {
          return !this._id.equals(room);
          saves.push(room.saveAsync());
        });
      });

      return Promise.all(saves);
    })
    .then(function () {
      next();
    })
    .catch(next);

});

// Exports

module.exports = mongoose.model('Environment', schema);