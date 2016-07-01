"use strict";

// Activity component

(function (context) {

  // Namespaces

  var LOUNGE = context.LOUNGE = context.LOUNGE || {};
  var components = LOUNGE.components = LOUNGE.components || {};

  // Exports

  components.Activity = React.createClass({
    render: function () {
      var date = new Date(parseInt(this.props.created));
      var formattedDate = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes();
      var created = React.createElement('span', { className: 'created' }, formattedDate);
      return React.createElement('li', { className: 'activity' }, created, this.props.activity);
    }
  });

})(this);