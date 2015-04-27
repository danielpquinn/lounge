var bcrypt = require('bcrypt');
var mongoose = require('mongoose');

var schema = mongoose.Schema({
  authToken: { type: String },
  email: { type: String, required: true },
  emailVerified: { type: Boolean, default: false },
  password: { type: String, required: true },
  username: { type: String, required: true },
  verifyEmailToken: { type: String }
});

schema.pre('save', function (next) {
  var self = this;

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

module.exports = mongoose.model('User', schema);