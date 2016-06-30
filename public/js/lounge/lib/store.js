"use strict";

// Store base class

(function(context) {

  // Namespace

  var LOUNGE = context.LOUNGE = context.LOUNGE || {};
  var lib = LOUNGE.lib = LOUNGE.lib || {};

  // Store constructor

  function Store() {

    // List of items

    this.items = [];
  }

  // Add an item, notify subscribers of change

  Store.prototype.add = function (item, quiet) {
    this.items.push(item);

    // Allow caller to skip event triggering.

    if (quiet !== true) {
      this.trigger('add', item);
      this.trigger('change');
    }
  };

  // Remove an item, notify subscribers of change

  Store.prototype.remove = function (_id, quiet) {
    this.items = this.items.filter(function (item) {
      return item._id != _id;
    });

    // Allow caller to skip event triggering.

    if (quiet !== true) {
      this.trigger('remove');
      this.trigger('change');
    }
  };

  // Mix in event

  Object.assign(Store.prototype, lib.event);

  // Exports

  lib.Store = Store;

})(this);