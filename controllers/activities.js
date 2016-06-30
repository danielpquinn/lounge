
// Dependencies

var session = require('./session');

// Export express route handler

module.exports = function (req, res, next) {
  res.json(session.activities);
};