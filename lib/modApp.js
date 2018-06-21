'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _clanRefresh = require('./lib/tasks/clanRefresh');

var _clanRefresh2 = _interopRequireDefault(_clanRefresh);

var _inactive = require('./lib/commands/inactive');

var _inactive2 = _interopRequireDefault(_inactive);

var _register = require('./lib/commands/register');

var _register2 = _interopRequireDefault(_register);

var _responseMessage = require('./lib/util/responseMessage');

var _responseMessage2 = _interopRequireDefault(_responseMessage);

var _ark = require('./lib/ark/ark');

var _ark2 = _interopRequireDefault(_ark);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var refreshing = false;

var ModeratorApp = function () {
    function ModeratorApp(db) {
        (0, _classCallCheck3.default)(this, ModeratorApp);

        this.db = db;
    }

    (0, _createClass3.default)(ModeratorApp, [{
        key: 'updates',
        value: function updates(ctx, message) {
            var messages = ["\nUpdates in the latest version:", "\t- The latest 4 clans are now recorded in the db", "\t- Refreshes will ping server owner if a latest clan is at 75/100"];

            message.channel.send(messages.join("\n"));

            return true;
        }
    }, {
        key: 'registerclan',
        value: function registerclan(ctx, message) {
            var registerTask = new _register2.default(this.db);

            return registerTask.run(ctx[1]).then(function (clan) {
                message.channel.send('Succesfully registered ' + clan.name);
            }).catch(function (e) {
                message.channel.send('An error has occured');
            });
        }
    }, {
        key: 'inactive',
        value: function inactive(ctx, message) {
            var InactiveTask = new _inactive2.default(this.db);
            var response = new _responseMessage2.default(message);
            var span = parseInt(ctx[1]) || 30;

            return InactiveTask.run(span).then(function (r) {
                return response.send(r);
            }).then(function (results) {
                message.channel.send('A total of ' + results.length + ' members have been inactive for ' + span + ' days');
            });
        }
    }, {
        key: 'inactivecount',
        value: function inactivecount(ctx, message) {
            var InactiveTask = new _inactive2.default(this.db);
            var span = parseInt(ctx[1]) || 30;

            return InactiveTask.run(span).then(function (results) {
                message.channel.send('A total of ' + results.length + ' members have been inactive for ' + span + ' days');
            });
        }
    }, {
        key: 'refresh',
        value: function refresh(ctx, message) {
            if (refreshing === true) {
                message.channel.send("Another refresh instance is occuring, please wait until it's completed");
                return false;
            }

            var task = new _clanRefresh2.default(this.db, message);
            refreshing = true;

            // after 15 seconds, even if we're still processing, allow another refresh
            setTimeout(function () {
                refreshing = false;
            }, 15000);

            return task.run(ctx[1], this.client).then(function (results) {
                refreshing = false;
                // do nothing
            }).catch(function (e) {
                console.log(e);
                refreshing = false;
                message.channel.send("An error has occurred.");
            });
        }
    }, {
        key: 'ark',
        value: function ark(ctx, message) {
            var response = new _responseMessage2.default(message);

            return _ark2.default.handle(ctx, message).then(function (results) {
                return response.send(results);
            }).catch(function (e) {
                console.log(e);
                message.channel.send("An error has occured");
            });
        }
    }]);
    return ModeratorApp;
}();

exports.default = ModeratorApp;