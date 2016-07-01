"use strict";

// App component

(function (context) {

  // Namespaces

  var LOUNGE = context.LOUNGE = context.LOUNGE || {};
  var components = LOUNGE.components = LOUNGE.components || {};

  // Exports

  components.App = React.createClass({

    // Auth token reference, might be provided by template variable

    token: null,

    // Connect socket

    socket: null,

    // Application wide messages store

    messages: new LOUNGE.stores.Messages(),

    // Application wide activities store

    activities: new LOUNGE.stores.Activities(),

    render: function () {
      var chat = React.createElement(components.Chat, { messages: this.messages, onSubmit: this.onCommandInputSubmit });
      var activity = React.createElement(components.Activities, { activities: this.activities });
      return React.createElement('div', { className: 'app' }, chat, activity);
    },

    // Set up event handlers after initial render

    componentDidMount: function () {

      // Connect to server

      this.socket = io.connect('http://' + context.IP + ':' + context.PORT);

      // If token was provided by template, set local storage item

      if (context.TOKEN !== '') {
        localStorage.setItem('token', context.TOKEN);
      }

      // Fetch initial list of messages and activities

      this.messages.fetchRecent();
      this.activities.fetchRecent();

      // Pull token from localstorage

      this.token = localStorage.getItem('token');

      this.socket.on('connect', this.onConnect);
      this.socket.on('warning', this.onSocketWarning);
      this.socket.on('command', this.onSocketCommand);
      this.socket.on('message', this.onSocketMessage);
      this.socket.on('activity', this.onSocketActivity);
    },

    // Add connection event to activity log

    onConnect: function () {
      this.socket.emit('visit', this.token);
    },

    // Add a warning to messages

    onSocketWarning: function (data) {
      this.messages.add({
        _id: Date.now(),
        text: data,
        username: 'system',
        level: 'warning'
      });
    },

    // Add a user message

    onSocketMessage: function (data) {
      this.messages.add({
        _id: data._id,
        text: data.text,
        username: data.username,
        level: data.level
      });
    },

    // Set token localstorage item, effectively logging in the user

    signin: function (token) {
        localStorage.setItem('token', token);
        this.token = token;
    },

    // Remove invalidated token from localstorage

    signout: function () {
        localStorage.removeItem('token');
    },

    // Handle command responses

    onSocketCommand: function (data) {
      switch (data.command) {
        case 'removelastmessage':
        this.removeLastMessage(data._id);
        break;
        case 'signin':
        this.signin(data.token);
        break;
        case 'signout':
        this.signout();
        break;
      }

      // If there's no text, don't show a message

      if (data.text === undefined) { return; }

      this.messages.add({
        _id: Date.now(),
        text: data.text,
        username: 'system',
        level: 'info'
      });
    },

    // Handle a new activity item

    onSocketActivity: function (data) {
      this.activities.add(data);
    },

    // Send a new message to the server

    onCommandInputSubmit: function (command) {
      var self = this;

      this.socket.emit('message', {
        token: self.token,
        text: command
      });
    },

    // Remove user's most recent message from store

    removeLastMessage: function (_id) {
      this.messages.remove(_id);
    }
  });

})(this);