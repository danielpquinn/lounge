"use strict";

// Command input component

(function (context) {

  // Namespaces

  var LOUNGE = context.LOUNGE = context.LOUNGE || {};
  var components = LOUNGE.components = LOUNGE.components || {};

  // Exports

  components.CommandInput = React.createClass({

    // Command history

    history: [],

    // Place in history

    historyIndex: -1,

    getInitialState: function () { return { command: '' }; },

    render: function () {
      var commandInput = React.createElement('input', {
        ref: 'commandInput',
        onChange: this.onCommandChange,
        type: 'text',
        name: 'command',
        autoComplete: 'off',
        value: this.state.command
      });
      return React.createElement('form', { onSubmit: this.onSubmit }, commandInput);
    },

    // Auto focus input after component is rendered

    componentDidMount: function () {
      var self = this;

      setTimeout(function () {
        self.refs.commandInput.focus();
      }, 50);

      // Bind event handlers

      document.addEventListener('keydown', this.onKeyDown);
    },

    // Clean up event handlers

    componentWillUnmount: function () {
      document.removeEventListener('keydown', this.onKeyDown);
    },

    // Set command to previous item in history

    previousHistoryItem: function () {
      var self = this;

      self.historyIndex += 1;

      if (self.historyIndex > self.history.length - 1) {
        self.historyIndex = self.history.length - 1;
      }

      self.setState({
        command: self.history[self.historyIndex] || ''
      });
    },

    // Set command to next item in history

    nextHistoryItem: function () {
      var self = this;

      self.historyIndex -= 1;

      if (self.historyIndex < 0) {
        self.historyIndex = 0;
      }

      self.setState({
        command: self.history[self.historyIndex] || ''
      });
    },

    // Handle keyboard input

    onKeyDown: function (e) {
      switch (e.keyCode) {
        case 38:
          this.previousHistoryItem();
          break;
        case 40:
          this.nextHistoryItem();
          break;
      }
    },

    // Update state when input is changed

    onCommandChange: function (e) {
      this.setState({ command: e.target.value });
    },

    // Pass command to parent component and reset form

    onSubmit: function (e) {
      e.preventDefault();
      this.historyIndex = -1;
      this.history.unshift(this.state.command);
      this.props.onSubmit(this.state.command);
      this.setState(this.getInitialState());
    }
  });

})(this);