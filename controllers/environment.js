
// Environment controller

// Dependencies

var Environment = require('../models/environment');
var Item = require('../models/item');
var Promise = require('bluebird');

// Constructor

function EnvironmentController() {}

// Create a environment

EnvironmentController.createEnvironment = function (user, name, description) {
  var environment;

  // Must be admin to create a environment
  
  if (!user || user.role !== 'admin') { throw new Error('Access denied'); }

  // Make sure all arguments are present
  
  if (!name || !description) { throw new Error('Must supply name and description arguments'); }

  environment = new Environment({
    name: name,
    description: description
  });

  return environment.saveAsync()
    .then(function () {

      // Send environment created message back
      
      return {
        command: 'createEnvironment',
        text: 'Successfully created environment ' + environment.name
      };
    });
};

// Connect Environments

EnvironmentController.connectEnvironments = function (user, name1, name2) {
  var environment1, environment2;

  // Must be admin to connect environments
  
  if (!user || user.role !== 'admin') { throw new Error('Access denied'); }

  // Make sure all arguments are present
  
  if (!name1 || !name2) { throw new Error('Must supply environment1name and environment2name arguments'); }

  // Look up environment one
  
  return Environment.findOneAsync({ name: name1 })
    .then(function (doc) {

      // If no environment, throw error

      if (!doc) { throw new Error('No environment with name ' + name1); }

      environment1 = doc;

      return Environment.findOneAsync({ name: name2 });
    }).then(function (doc) {

      // If no environment, throw error

      if (!doc) { throw new Error('No environment with name ' + name2); }

      environment2 = doc;

      // Connect environments

      environment1.adjacentEnvironments.push(environment2._id);
      environment2.adjacentEnvironments.push(environment1._id);

      // Save connection

      return Promise.all([environment1.saveAsync(), environment2.saveAsync()]);
    }).then(function () {

      // Send successfull message
      
      return {
        command: 'connectEnvironments',
        text: 'Connected ' + name1 + ' to ' + name2
      };
    });
};

// Remove a environment

EnvironmentController.removeEnvironment = function (user, name) {

  // Must be admin to remove a environment
  
  if (!user || user.role !== 'admin') { throw new Error('Access denied'); }

  // Make sure all arguments are present
  
  if (!name) { throw new Error('Must supply name argument'); }

  // Look up environment by name
  
  return Environment.findOneAsync({ name: name })
    .then(function (environment) {

      // Throw error if no environment found

      if (!environment) { throw new Error('Could not find environment with name ' + name); }

      // Remove environment

      return environment.removeAsync();
    })
    .then(function () {

      // Send success message

      return {
        command: 'removeEnvironment',
        text: 'Removed environment ' + name
      };
    });
};

// Add an item to this environment

EnvironmentController.addItem = function (user, environmentName, itemName) {
  var environment, item;

  // Must be admin to add an item to an environment
  
  if (!user || user.role !== 'admin') { throw new Error('Access denied'); }

  // Look up environment

  return Environment.findOneAsync({ name: environmentName })
    .then(function (doc) {

      // Throw error if no environment found

      if (!doc) { throw new Error('Could not find environment with name ' + environmentName); }

      environment = doc;

      return Item.findOneAsync({ name: itemName });
    }).then(function (doc) {

      // Throw error if no environment found

      if (!doc) { throw new Error('Could not find item with name ' + itemName); }

      item = doc;

      // Add item to environment

      environment.items.push(item);

      return environment.saveAsync();
    }).then(function () {

      // Send an item added message
      
      return {
        command: 'addItem',
        text: 'Added ' + itemName + ' to ' + environmentName
      };
    });
};

// Exports

module.exports = EnvironmentController;