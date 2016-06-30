"use strict";

// Messages store

(function (context) {

  // Namespace

  var LOUNGE = context.LOUNGE = context.LOUNGE || {};
  var stores = LOUNGE.stores = LOUNGE.stores || {};

  // Extend Store base class

  function Messages() {
    LOUNGE.lib.Store.call(this);
  }

  Messages.prototype = Object.create(LOUNGE.lib.Store.prototype);
  Messages.prototype.constructor = Messages;

  // Get a list of messages from the JSON api

  Messages.prototype.fetchRecent = function () {
    var req = new XMLHttpRequest();

    // Handle a successful get

    var onFetchSuccess = function () {
      var self = this;
      var items;

      try {
        items = JSON.parse(req.responseText);
      } catch (e) {
        return console.warn(e);
      }

      items.forEach(function (item) {
        self.add(item, true);
      });

      this.trigger('add');
      this.trigger('change');
    };

    // Handle an error response

    var onFetchError = function (e) {
      console.warn(e);
    };

    // Handle an error

    req.open('GET', '/api/messages');
    req.addEventListener('load', onFetchSuccess.bind(this));
    req.addEventListener('error', onFetchError.bind(this));
    req.send();
  };

  // New store instance

  stores.Messages = Messages;

})(this);