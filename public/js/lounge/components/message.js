"use strict";

// Messages component

(function (context) {

  // Namespaces

  var LOUNGE = context.LOUNGE = context.LOUNGE || {};
  var components = LOUNGE.components = LOUNGE.components || {};

  // Exports

  components.Message = React.createClass({
    render: function () {
      var message = this.props.message;

      // User input is sanitized on the server, which _should_ prevent XSS.
      // Sometimes the message will be generated server side and include html.
      // Because this is the case, we're going to use 'dangerouslySetInnerHTML'.

      var innerHTML = '<span class="username">' + message.username + '</span>' + message.text;

      return React.createElement('li', {
        className: 'message ' + message.level || 'info',
        dangerouslySetInnerHTML: { __html: innerHTML }
      });
    }
  });

})(this);