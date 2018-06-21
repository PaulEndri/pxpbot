'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _clanList = require('./lib/commands/clanList');

var _clanList2 = _interopRequireDefault(_clanList);

var _sqlize = require('./lib/database/sqlize');

var _sqlize2 = _interopRequireDefault(_sqlize);

var _modApp = require('./modApp');

var _modApp2 = _interopRequireDefault(_modApp);

var _responseMessage = require('./lib/util/responseMessage');

var _responseMessage2 = _interopRequireDefault(_responseMessage);

var _role = require('./lib/roles/role');

var _role2 = _interopRequireDefault(_role);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var modApp = new _modApp2.default(_sqlize2.default);

var App = function () {
    function App(discordClient) {
        (0, _classCallCheck3.default)(this, App);

        this.client = discordClient;
        modApp.client = discordClient;
    }

    (0, _createClass3.default)(App, [{
        key: 'process',
        value: function process(message) {
            if (!message.member || message.content.indexOf('!') !== 0) {
                return null;
            }

            var mod = message.member.roles.find('name', 'Moderator') ? true : false;
            var adm = message.member.roles.find('name', 'Administrator') ? true : false;
            var adv = mod || adm;
            var msg = message.content.toLowerCase();
            var ctx = msg.split(' ');
            var key = ctx[0].replace('!', '');

            if (typeof this[key] === 'function') {
                this[key](ctx, message);
            } else if (adv === true && typeof modApp[key] === 'function') {
                modApp[key](ctx, message);
            }
        }
    }, {
        key: 'roles',
        value: function roles(ctx, message) {
            var roles = new _role2.default(_sqlize2.default, message);

            roles.toggle(ctx);
        }
    }, {
        key: 'clanlist',
        value: function clanlist(ctx, message) {
            var clanlist = new _clanList2.default(_sqlize2.default);
            var response = new _responseMessage2.default(message);

            clanlist.get(['open', 'active', 'available'].includes(ctx[1])).then(function (r) {
                return response.send(r);
            });
        }
    }]);
    return App;
}();

exports.default = App;