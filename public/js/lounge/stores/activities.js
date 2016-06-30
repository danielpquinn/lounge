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

  // New store instance

  stores.Activities = Activities;

})(this);