"use strict";

// Activity store

(function (context) {

  // Namespace

  var LOUNGE = context.LOUNGE = context.LOUNGE || {};
  var stores = LOUNGE.stores = LOUNGE.stores || {};

  // Extend Store base class

  function Activities() {
    LOUNGE.lib.Store.call(this);
  }

  Activities.prototype = Object.create(LOUNGE.lib.Store.prototype);
  Activities.prototype.constructor = Activities;

  // Get a list of activities from the JSON api

  Activities.prototype.fetchRecent = function () {
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

    req.open('GET', '/api/activities');
    req.addEventListener('load', onFetchSuccess.bind(this));
    req.addEventListener('error', onFetchError.bind(this));
    req.send();
  };

  // New store instance

  stores.Activities = Activities;

})(this);