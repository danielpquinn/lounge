
// User model

// Dependencies

var bcrypt = require('bcrypt');
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

// Definitions

var roleOptions = [ 'user', 'admin' ];

// Schema

var schema = mongoose.Schema({
  created: { type: Date, default: Date.now },
  email: { type: String, required: true, unique: true },
  emailVerified: { type: Boolean, default: false },
  items: [{ type: ObjectId, ref: 'Item' }],
  password: { type: String, required: true },
  role: { type: String, enum: roleOptions, default: roleOptions[0] },
  username: { type: String, requirevd: true }
});

// Encrypt password when it is updated

schema.pre('save', function (next) {
  var self = this;

  // Make sure email is lowercase
  
  if (self.isModified('email')) {
    self.set('email', self.email.toLowerCase());
  }

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

// Add to environment upon creation

schema.pre('save', function (next) {
  var self = this;

  // Skip if not new
  
  if (!self.isNew) { return next(); }

  // Find environment
  
  mongoose.model('Environment').findOneAsync()
    .then(function (environment) {

      // Throw error if no environment exists
      
      if (!environment) { return next(new Error('Could not add user to environment')); }

      // Add user to occupants and save
      
      environment.occupants.push(self);

      return environment.saveAsync();
    })
    .then(function () { return next(); })
    .catch(next)

});

// Exports

module.exports = mongoose.model('User', schema);