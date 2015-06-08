
// Message model

// Dependencies

var mongoose = require('mongoose');

// Schema

var schema = mongoose.Schema({
  created: { type: Date, default: Date.now },
  text: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

// Exports

module.exports = mongoose.model('Message', schema);