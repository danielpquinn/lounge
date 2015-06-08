
// Email client

// Dependencies

var config = require('../config');
var nodemailer = require('nodemailer');
var Promise = require('bluebird');
var transporter = nodemailer.createTransport(config.emailTransport);

// Promisify transporter API

Promise.promisifyAll(transporter);

// Exports

module.exports = transporter;