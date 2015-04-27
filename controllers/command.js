var UserController = require('./user');
var Promise = require('bluebird');

function CommandController() {}

CommandController.prototype.parseCommand = function (input) {
  var parts, command, args;
  parts = input.match(/(^\/\w+)|(-[^-]+)/g);
  if (!parts) { return { command: 'undefined', args: {} }; }
  command = parts[0].trim().replace('/', '');
  args = {};
  for (var i = 1; i < parts.length; i += 1) {
    var bits = parts[i].split(' ');
    args[bits[0].replace('-', '')] = bits[1].trim();
  }
  return {
    command: command,
    args: args
  };
};

CommandController.prototype.runCommand = function (input) {
  var command = this.parseCommand(input);

  if (!command) { return this.unrecognizedCommand(); }

  switch(command.command) {
    case 'signup':
    return this.signUp(command);
    default:
    return this.unrecognizedCommand(command);
  }
};

CommandController.prototype.unrecognizedCommand = function (command) {
  return new Promise(function (resolve, reject) {
    reject('Unrecognized command "' + command.command + '"');
  });
};

CommandController.prototype.signUp = function (command) {
  var args = command.args;
  return new UserController().signUp(args.username || args.u, args.email || args.e, args.password || args.p);
};

module.exports = CommandController;