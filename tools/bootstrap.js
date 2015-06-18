
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

addEnvironment('desk', 'Your home office space. Actually a table from Ikea in the corner of a small house you rent.');
addItem('arduino', 'An Arduino Yún you bought from Radio Shack during their going out of business sale.');
addItem('laptop', 'A 13in retina Macbook Pro.');
addItem('google cardboard', 'A DodoCase Cardboard VR headset.');
addItem('sunglasses', 'A cheap pair of sunglasses with little gold triangles next to the lenses.');

// Save environments

saveModels(environments)
  .then(function () { return saveModels(items); })
  .then(function () { return user.saveAsync(); })
  .then(function () { return EnvironmentController.addItem(user, 'desk', 'arduino'); })
  .then(function () { return EnvironmentController.addItem(user, 'desk', 'laptop'); })
  .then(function () { return EnvironmentController.addItem(user, 'desk', 'google cardboard'); })
  .then(function () { return EnvironmentController.addItem(user, 'desk', 'sunglasses'); })
  .then(function () {
    console.log('All Done');
    process.exit();
  })
  .catch(function (e) {
    console.log(e);
    process.exit(1);
  });