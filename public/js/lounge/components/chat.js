"use strict";

// Chat component

(function (context) {

  // Namespaces

  var LOUNGE = context.LOUNGE = context.LOUNGE || {};
  var components = LOUNGE.components = LOUNGE.components || {};

  // Exports

  components.Chat = React.createClass({

    // Render component

    render: function () {
      var messages = React.createElement(LOUNGE.components.Messages, { messages: this.props.messages });
      var commandInput = React.createElement(LOUNGE.components.CommandInput, { onSubmit: this.props.onSubmit });

      return React.createElement('div', { className: 'chat' }, messages, commandInput);
    }
  });

})(this);