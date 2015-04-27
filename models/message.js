var mongoose = require('mongoose');

var schema = mongoose.Schema({
  text: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  created: { type: Date, defualt: Date.now }
});

module.exports = mongoose.model('Message', schema);