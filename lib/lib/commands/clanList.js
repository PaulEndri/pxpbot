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

var _bungieSdkAlpha = require('bungie-sdk-alpha');

var _bungieClan = require('../database/models/bungieClan');

var _bungieClan2 = _interopRequireDefault(_bungieClan);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _romanNumeralConverterMmxvi = require('roman-numeral-converter-mmxvi');

var _romanNumeralConverterMmxvi2 = _interopRequireDefault(_romanNumeralConverterMmxvi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ClanList = function () {
    function ClanList(db) {
        (0, _classCallCheck3.default)(this, ClanList);

        this.db = db;
        this.cache = [];
        this.cached = null;
    }

    (0, _createClass3.default)(ClanList, [{
        key: 'cleanUpString',
        value: function cleanUpString(string) {
            var noises = ["\t", ' ', '[EU]', 'WRATH', 'INCARNATE'];

            var val = string.split('-')[0];

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = noises[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var noise = _step.value;

                    val = val.replace(noise, '');
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            return _romanNumeralConverterMmxvi2.default.getIntegerFromRoman(val.trim());
        }
    }, {
        key: 'get',
        value: function get() {
            var _this = this;

            var active = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

            return this.getData().then(function (results) {
                return _this.processResults(results, active);
            });
        }
    }, {
        key: 'getData',
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
                var _this2 = this;

                var cache, promises, BungieClan, _clans, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, clan;

                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return this.verifyCache();

                            case 2:
                                cache = _context.sent;
                                promises = [];
                                BungieClan = (0, _bungieClan2.default)(this.db);

                                if (!cache) {
                                    _context.next = 7;
                                    break;
                                }

                                return _context.abrupt('return', this.cache);

                            case 7:
                                _context.next = 9;
                                return BungieClan.findAll({ raw: true });

                            case 9:
                                _clans = _context.sent;
                                _iteratorNormalCompletion2 = true;
                                _didIteratorError2 = false;
                                _iteratorError2 = undefined;
                                _context.prev = 13;


                                for (_iterator2 = _clans[Symbol.iterator](); !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                                    clan = _step2.value;

                                    promises.push(new _bungieSdkAlpha.Group(clan.group_id));
                                }

                                _context.next = 21;
                                break;

                            case 17:
                                _context.prev = 17;
                                _context.t0 = _context['catch'](13);
                                _didIteratorError2 = true;
                                _iteratorError2 = _context.t0;

                            case 21:
                                _context.prev = 21;
                                _context.prev = 22;

                                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                                    _iterator2.return();
                                }

                            case 24:
                                _context.prev = 24;

                                if (!_didIteratorError2) {
                                    _context.next = 27;
                                    break;
                                }

                                throw _iteratorError2;

                            case 27:
                                return _context.finish(24);

                            case 28:
                                return _context.finish(21);

                            case 29:
                                _context.next = 31;
                                return Promise.all(promises).then(function (results) {
                                    _this2.cache = results;
                                    _this2.cached = (0, _moment2.default)();

                                    return results;
                                });

                            case 31:
                                return _context.abrupt('return', _context.sent);

                            case 32:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this, [[13, 17, 21, 29], [22,, 24, 28]]);
            }));

            function getData() {
                return _ref.apply(this, arguments);
            }

            return getData;
        }()
    }, {
        key: 'processResults',
        value: function processResults(data, active) {
            var _this3 = this;

            var msges = ["Clan list :"];

            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = data[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var result = _step3.value;

                    var detail = result.detail;
                    var msg = detail.name + '\t-\t' + detail.memberCount + '/100';

                    if (detail.memberCount != 100) {
                        msg = msg.toUpperCase().replace('14', 'XIV').replace('1', 'I');
                        msg += '\t-\thttps://www.bungie.net/en/ClanV2?groupId=' + detail.groupId;
                    } else if (active === true) {
                        continue;
                    } else {
                        msg = msg.toUpperCase().replace('14', 'XIV').replace('1', 'I');
                    }

                    if (msg.indexOf('EU') >= 0) {
                        msg = "[EU] " + msg.replace(' EU', '');
                    }

                    msges.push(msg);
                }
            } catch (err) {
                _didIteratorError3 = true;
                _iteratorError3 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion3 && _iterator3.return) {
                        _iterator3.return();
                    }
                } finally {
                    if (_didIteratorError3) {
                        throw _iteratorError3;
                    }
                }
            }

            msges = msges.sort(function (a, b) {
                var aVal = _this3.cleanUpString(a);
                var bVal = _this3.cleanUpString(b);

                if (a.indexOf('EU') >= 0) {
                    aVal += 100;
                };

                if (b.indexOf('EU') >= 0) {
                    bVal += 100;
                }

                return aVal - bVal;
            });
            return msges;
        }
    }, {
        key: 'verifyCache',
        value: function () {
            var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                if (!(this.cached === null)) {
                                    _context2.next = 2;
                                    break;
                                }

                                return _context2.abrupt('return', false);

                            case 2:
                                return _context2.abrupt('return', (0, _moment2.default)().diff(this.cached, 'minutes') > 15);

                            case 3:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function verifyCache() {
                return _ref2.apply(this, arguments);
            }

            return verifyCache;
        }()
    }]);
    return ClanList;
}();

exports.default = ClanList;