
// Environment model

// Dependencies

var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
var Promise = require('bluebird');

// Schema

var schema = mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  items: [{ type: ObjectId, ref: 'Item' }],
  requiredItems: [{ type: ObjectId, ref: 'Item' }],
  adjacentEnvironments: [{ type: ObjectId, ref: 'Environment' }],
  occupants: [{ type: ObjectId, ref: 'User' }]
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
          return !self._id.equals(room);
        });
        saves.push(room.saveAsync());
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