var config = require('../config');
var nodemailer = require('nodemailer');
var Promise = require('bluebird');
var transporter = nodemailer.createTransport(config.emailTransport);

Promise.promisifyAll(transporter);

module.exports = transporter;