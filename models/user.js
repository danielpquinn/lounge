
// User model

// Dependencies

var bcrypt = require('bcrypt');
var mongoose = require('mongoose');

// Schema

var schema = mongoose.Schema({
  created: { type: Date, default: Date.now },
  email: { type: String, required: true, unique: true },
  emailVerified: { type: Boolean, default: false },
  password: { type: String, required: true },
  username: { type: String, required: true },
  oldId: { type: String }
});

// Encrypt password when it is updated

schema.pre('save', function (next) {
  var self = this;

  // If password is modified, generate salt
  // and use it to hash the password

  if (self.isModified('password')) {
    return bcrypt.genSalt(10, function (err, salt) {
      if (err) { return next(err); }
      bcrypt.hash(self.password, salt, function (err, hash) {
        self.set('password', hash);
        next();
      });
    });
  }

  next();
});

// Exports

module.exports = mongoose.model('User', schema);