
// Command Controller

// Dependencies

var HelpController = require('./help');
var EnvironmentController = require('./environment');
var UserController = require('./user');
var Promise = require('bluebird');
var session = require('./session');

// Constructor

function CommandController() {}

// Parse a command from user input

CommandController.parseCommand = function (input) {
  var parts, command, args;

  // Break parts of command out into command and param/value
  // pairs. "/command -param param1"

  parts = input.match(/(^\/\w+)|(-[^-]+)/g);

  // Send back an undefined command if command could not be parsed

  if (!parts) { throw new Error('Unrecognized command'); }

  // First match will be the command to run

  command = parts[0].trim().replace('/', '');

  args = {};

  // Add args to object

  for (var i = 1; i < parts.length; i += 1) {
    var bits = parts[i].split(' ');
    var key = bits[0].replace('-', '');
    var value = bits.splice(1).join(' ').trim();
    args[key] = value;
  }

  // Return command object

  return {
    command: command,
    args: args
  };
};

// Actually run the command. Some will require a user

CommandController.runCommand = function (user, input) {
  var command = CommandController.parseCommand(input);
  var args = command.args;

  // Select command to run

  switch(command.command) {
    case 'help':
    return HelpController.getHelp(args.command || args.c);
    case 'createenvironment':
    return EnvironmentController.createEnvironment(user, args.name || args.n, args.description || args.d);
    case 'createenvironment':
    return EnvironmentController.createEnvironment(user, args.name || args.n, args.description || args.d);
    case 'connectenvironments':
    return EnvironmentController.connectEnvironments(user, args.name1, args.name2);
    case 'moveto':
    return UserController.moveTo(user, args.name || args.n);
    case 'look':
    return UserController.look(user);
    case 'removeenvironment':
    return EnvironmentController.removeEnvironment(user, args.name || args.n);
    case 'removelastmessage':
    return UserController.removeLastMessage(user);
    case 'resetpassword':
    return UserController.resetPassword(args.email || args.e);
    case 'signup':
    return UserController.signUp(args.username || args.u, args.email || args.e, args.password || args.p);
    case 'signin':
    return UserController.signIn(args.email || args.e, args.password || args.p);
    case 'signout':
    return UserController.signOut(user);
    case 'updateaccount':
    return UserController.update(user, args.username || args.u, args.email || args.e, args.password || args.p);
    case 'users':
    return session.getUsers();
    default:
    throw new Error('Unrecognized command');
  }
};

// Exports

module.exports = CommandController;