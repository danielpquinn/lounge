
// Event mixin

(function (context) {

  // Namespace

  var LOUNGE = context.LOUNGE = context.LOUNGE || {};
  var lib = LOUNGE.lib = LOUNGE.lib || {};

  // Exports

  lib.event = {

    // Register a new event handler on this object

    on: function (name, handler) {
      this.events[name] = this.events[name] || [];
      this.events[name].push(handler);
    },

    // Mapping of event names to one or more handler functions

    events: {},

    // Remove one or all handlers from given register

    off: function (name, handler) {

      // Bail if there are no events registered with this name

      if (this.events[name] === undefined) { return; }

      // If no handler is passed, remove all event handlers

      if (handler === undefined) {
        delete this.events[name];
        return;
      }

      // Remove the provided handler from registered handlers

      this.events[name] = this.events[name].filter(function (otherHandler) {
        return handler != otherHandler;
      });
    },

    // Call handlers for named event with provided params

    trigger: function (name, params) {

      // Bail if there are no handlers for this type of event

      if (this.events[name] === undefined) { return; }
      this.events[name].forEach(function (handler) {
        handler.apply(this, params);
      });
    }
  }

})(this);