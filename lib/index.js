'use strict';

var _discord = require('discord.js');

var _discord2 = _interopRequireDefault(_discord);

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

var _app = require('./app');

var _app2 = _interopRequireDefault(_app);

var _tasks = require('./tasks');

var _tasks2 = _interopRequireDefault(_tasks);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var env = _dotenv2.default.config();
var client = new _discord2.default.Client();
var app = new _app2.default(client, env);

client.on('ready', function () {
    console.log('ready');
});

client.on('message', function (message) {
    app.process(message);
});

_tasks2.default.begin(client, env);

client.login(env.parsed.BOT_TOKEN);