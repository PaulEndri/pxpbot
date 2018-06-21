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
    function Clan(clanId) {
        (0, _classCallCheck3.default)(this, Clan);

        this.root = 'GroupV2';
        this.id = clanId;
    }

    (0, _createClass3.default)(Clan, [{
        key: 'getDetails',
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return _bungieApi2.default.getAsync(this.baseRoute + "/");

                            case 2:
                                return _context.abrupt('return', _context.sent);

                            case 3:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function getDetails() {
                return _ref.apply(this, arguments);
            }

            return getDetails;
        }()
    }, {
        key: 'getMemberPage',
        value: function getMemberPage(pageNumber) {
            var route = [this.baseRoute, 'Members', '?currentPage=' + pageNumber].join('/');

            return _bungieApi2.default.get(route);
        }
    }, {
        key: 'getData',
        value: function () {
            var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
                var clanData, members;
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.next = 2;
                                return this.getDetails();

                            case 2:
                                clanData = _context2.sent;
                                _context2.next = 5;
                                return Promise.all([this.getMemberPage(1), this.getMemberPage(2)]).then(function (results) {
                                    var _members = results.reduce(function (total, current) {
                                        return total.concat(current.results);
                                    }, []);

                                    return _members;
                                });

                            case 5:
                                members = _context2.sent;
                                return _context2.abrupt('return', Object.assign({}, clanData, {
                                    members: members
                                }));

                            case 7:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function getData() {
                return _ref2.apply(this, arguments);
            }

            return getData;
        }()
    }, {
        key: 'baseRoute',
        get: function get() {
            return this.root + '/' + this.id;
        }
    }]);
    return Clan;
}();

exports.default = Clan;