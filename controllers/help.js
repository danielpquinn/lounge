
// Help

// Dependencies

var Promise = require('bluebird');
var jade = require('jade');

// Constructor

function Help() {}

// Get help text

Help.getHelp = function (command) {
  var message;

  // Find template in views/help and render
  
  var renderTemplate = function (fileName) {
    return jade.renderFile(__dirname + '/../views/help/' + fileName + '.jade');
  };

  // If getting help with a specific command, look it up here
  
  switch (command) {
    case 'drop': message = renderTemplate('drop'); break;
    case 'help': message = renderTemplate('help'); break;
    case 'look': message = renderTemplate('look'); break;
    case 'me': message = renderTemplate('me'); break;
    case 'move': message = renderTemplate('move'); break;
    case 'pickup': message = renderTemplate('pickup'); break;
    case 'resetpassword': message = renderTemplate('resetpassword'); break;
    case 'signin': message = renderTemplate('signin'); break;
    case 'signout': message = renderTemplate('signout'); break;
    case 'signup': message = renderTemplate('signup'); break;
    case 'updateaccount': message = renderTemplate('updateaccount'); break;
    case 'resetpassword': message = renderTemplate('resetpassword'); break;
    case 'users': message = renderTemplate('users'); break;
    default: message = renderTemplate('overview');
  }

  return new Promise(function (resolve, reject) {
    resolve({
      command: 'help',
      text: message
    });
  });
};

// Exports

module.exports = Help;