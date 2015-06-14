
// Bootstrap a map

// Dependencies

var mongoose = require('mongoose');
var Promise = require('bluebird');

var config = require('../config');
var User = require('../models/user');
var Environment = require('../models/environment');
var Item = require('../models/item');
var EnvironmentController = require('../controllers/environment');
var ItemController = require('../controllers/item');

// Create admin user

var user = new User({
  email: 'admin@' + config.siteName + '.com',
  emailVerified: true,
  password: 'admin',
  role: 'admin',
  username: 'admin'
});

// Helper functions

var environments = [];
var items = [];

var addEnvironment = function (name, description) {
  environments.push(new Environment({
    name: name,
    description: description
  }));
};

var addItem = function (name, description) {
  items.push(new Item({
    name: name,
    description: description
  }));
};

// Save multiple models

var saveModels = function (models) {
  return models.reduce(function (last, current) {
    return last.then(function () { return current.saveAsync(); });
  }, new Promise(function (r) { return r(); }));
};

// Promisify mongoose api

Promise.promisifyAll(mongoose);

// Connect to database

mongoose.connect(config.mongoUrl);

// Environments

addEnvironment('parking lot', 'A mostly empty parking lot.');
addEnvironment('sidewalk', 'A pretty normal sidewalk. Looking up you can see a tall, somewhat ominous looking building. A logo above the entrance reads "GloboCorp"');
addEnvironment('lawn', 'What you first thought was a well maintained lawn turns out to be astroturf.');
addEnvironment('lobby', 'A cool draft floats through the lobby. The floors are sparkling clean.');
addItem('keycard', 'A GloboCorp keycard. I wonder what happened to the employee who lost it.');

// Save environments

saveModels(environments)
  .then(function () { return saveModels(items); })
  .then(function () { return user.saveAsync(); })
  .then(function () { return EnvironmentController.addItem(user, 'lawn', 'keycard'); })
  .then(function () { return EnvironmentController.addRequiredItem(user, 'lobby', 'keycard'); })
  .then(function () { return EnvironmentController.connectEnvironments(user, 'parking lot', 'sidewalk'); })
  .then(function () { return EnvironmentController.connectEnvironments(user, 'sidewalk', 'lawn'); })
  .then(function () { return EnvironmentController.connectEnvironments(user, 'sidewalk', 'lobby'); })
  .then(function () {
    console.log('All Done');
    process.exit();
  })
  .catch(function (e) {
    console.log(e);
    process.exit(1);
  });