"use strict";

// Messages component

(function (context) {

  // Namespaces

  var LOUNGE = context.LOUNGE = context.LOUNGE || {};
  var components = LOUNGE.components = LOUNGE.components || {};

  // Exports

  components.Messages = React.createClass({
    render: function () {
      var messages = this.props.messages.items.map(function (message) {
        return React.createElement(LOUNGE.components.Message, { key: message._id, message: message });
      });
      return React.createElement('ul', { className: 'messages' }, messages);
    },

    // Update state when messages store is updated

    componentDidMount: function () {
      this.props.messages.on('change', this.updateState);
    },

    // Clean up event handlers before component is destroyed

    componentWillUnmount: function () {
      this.props.messages.off('change', this.updateState);
    },

    componentDidUpdate: function () {
      var domNode = ReactDOM.findDOMNode(this);
      domNode.scrollTop = domNode.scrollHeight;
    },

    // Manually re-render component

    updateState: function () {
      this.setState(this.state || {});
    }
  });

})(this);