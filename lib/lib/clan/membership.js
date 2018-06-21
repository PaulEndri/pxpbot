'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _bungieApi = require('../api/bungieApi');

var _bungieApi2 = _interopRequireDefault(_bungieApi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Clan = function () {
    function Clan(member) {
        (0, _classCallCheck3.default)(this, Clan);

        this.root = 'Destiny2';
        this.type = member.membership_type || 2;
        this.id = member.destiny_member_id;
    }

    (0, _createClass3.default)(Clan, [{
        key: 'getProfile',
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return _bungieApi2.default.getAsync(this.baseRoute + ('/Profile/' + this.id + '/?components=100'));

                            case 2:
                                return _context.abrupt('return', _context.sent);

                            case 3:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function getProfile() {
                return _ref.apply(this, arguments);
            }

            return getProfile;
        }()
    }, {
        key: 'baseRoute',
        get: function get() {
            return this.root + '/' + this.type;
        }
    }]);
    return Clan;
}();

exports.default = Clan;