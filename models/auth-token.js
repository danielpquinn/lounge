
// Auth token model

// Dependencies

var mongoose = require('mongoose');
var twoWeeksMs = (14 * 7 * 24 * 60 * 60 * 1000);

// Schema

var schema = mongoose.Schema({
  expires: { type: Date, default: function () { return Date.now() + twoWeeksMs; } },
  token: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

// Exports

module.exports = mongoose.model('AuthToken', schema);