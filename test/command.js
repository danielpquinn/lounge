
// Command unit tests

// Dependencies

var assert = require('assert');
var CommandController = require('../controllers/command');

describe('Command', function () {

  // Parse command
  
  describe('#parseCommand()', function () {

    it('should throw an unrecognized command error', function () {
      assert.throws(function () { CommandController.parseCommand(''); }, Error, /Unrecognized command/);
    });

    it('should parse a command with no arguments', function () {
      assert.deepEqual({
        command: 'foo',
        args: {}
      }, CommandController.parseCommand('/foo'));
    });

    it('should parse a command with one argument', function () {
      assert.deepEqual({
        command: 'foo',
        args: {
          bar: 'baz'
        }
      }, CommandController.parseCommand('/foo -bar baz'));
    });

    it('should parse a command with one argument but no argument name', function () {
      assert.deepEqual({
        command: 'foo',
        args: {
          default: 'bar'
        }
      }, CommandController.parseCommand('/foo bar'));
    })
  });
});