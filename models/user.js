var mongoose = require('mongoose');

var schema = mongoose.Schema({
  authToken: { type: String },
  email: { type: String, required: true },
  password: { type: String, required: true },
  username: { type: String, required: true },
  verificationToken: { type: String }
});

module.exports = mongoose.Model('User', schema);