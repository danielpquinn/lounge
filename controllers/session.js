
// Session data. Who's logged in etc

// Dependencies

var Promise = require('bluebird');

// Constructor

function Session() {
  this.users = [];
  this.activities = [];
};

// Static properties

Session.MAX_ACTIVITIES = 100;

// Add a user to the list

Session.prototype.addUser = function (user) {

  // Don't add user if they have already been added

  for (var i = 0; i < this.users.length; i += 1) {
    if (this.users[i]._id.equals(user._id)) { return; }
  }

  // Add user

  this.users.push(user);
};

// Remove a user from the list

Session.prototype.removeUser = function (user) {
  this.users = this.users.filter(function (item) {
    return !item._id.equals(user._id);
  });
};

// Get list of users

Session.prototype.getUsers = function () {
  var self = this;

  return new Promise(function (resolve, reject) {

    // Generate a list of usernames

    var message = self.users.map(function (user) {
      return user.username;
    }).join(', ');

    // Return a response

    resolve({
      command: 'getUsers',
      text: message
    });
  });
};

// Add activity to session

Session.prototype.addActivity = function (activity) {
  this.activities.push(activity);
  if (this.activities.length > Session.MAX_ACTIVITIES) {
    this.activities = this.activities.slice(1);
  }
};

// Export singleton

module.exports = new Session();