
// Help

// Dependencies

var Promise = require('bluebird');
var jade = require('jade');

// Constructor

function Help() {}

// Display main help text

Help.main = function (command) {
  var message;

  // Find template in views/help and render
  
  var renderTemplate = function (fileName) {
    return jade.renderFile(__dirname + '/../views/help/' + fileName + '.jade');
  };

  // If getting help with a specific command, look it up here
  
  switch (command) {
    case 'help':
    message = renderTemplate('help');
    break;
    case 'resetpassword':
    message = renderTemplate('resetpassword');
    break;
    case 'signin':
    message = renderTemplate('signin');
    break;
    case 'signout':
    message = renderTemplate('signout');
    break;
    case 'signup':
    message = renderTemplate('signup');
    break;
    case 'updateaccount':
    message = renderTemplate('updateaccount');
    break;
    case 'resetpassword':
    message = renderTemplate('resetpassword');
    break;
    default:
    message = renderTemplate('overview');
  }

  return new Promise(function (resolve, reject) {
    resolve({
      command: 'help',
      message: message
    });
  });
};

// Exports

module.exports = Help;