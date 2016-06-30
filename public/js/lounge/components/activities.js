"use strict";

// Recent activity component

(function (context) {

  // Namespaces

  var LOUNGE = context.LOUNGE = context.LOUNGE || {};
  var components = LOUNGE.components = LOUNGE.components || {};

  // Export component

  components.Activities = React.createClass({
    render: function () {
      return React.createElement('div', { className: 'activities' });
    },

    // Update state when activities store is updated

    componentDidMount: function () {
      this.props.activities.on('change', this.updateState);
    },

    // Clean up event handlers before component is destroyed

    componentWillUnmount: function () {
      this.props.activities.off('change', this.updateState);
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