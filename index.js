var config = require('./config');
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var Promise = require('bluebird');
var mongoose = require('mongoose');

Promise.promisifyAll(mongoose);

mongoose.connect(config.mongoUrl);

server.listen(config.port);

app.use(express.static('public'));
app.set('view engine', 'jade');
app.get('/', require('./controllers/home'));
app.get('/api/messages', require('./controllers/messages'));
app.get('/api/activities', require('./controllers/activities'));
io.on('connection', require('./controllers/connection'));