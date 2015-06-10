
// Help unit tests

// Dependencies

var assert = require('assert');
var HelpController = require('../controllers/help');

describe('Help', function () {

  // Get help
  
  describe('#getHelp()', function () {

    it('return some health text', function () {
      assert.deepEqual({
        command: 'help',
        text: '<p>---------------------------------</p><p>Provides user with instructions on how to use this program.</p><p><strong>Example:</strong></p><p>/help -command signup</p><p><strong>Parameters:</strong></p><ul><li><strong>c</strong> or <strong>command</strong>: Name of command you wish to run.</li></ul>'
      }, HelpController.getHelp('help'));
    });
  });
});