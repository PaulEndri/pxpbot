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

var _bungieClan = require('../database/models/bungieClan');

var _bungieClan2 = _interopRequireDefault(_bungieClan);

var _bungieSdkAlpha = require('bungie-sdk-alpha');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// I love sequelize - Not
var RegisterTask = function () {
    function RegisterTask(db) {
        (0, _classCallCheck3.default)(this, RegisterTask);

        this.db = db;
    }

    (0, _createClass3.default)(RegisterTask, [{
        key: 'run',
        value: function run(id) {
            var _this = this;

            var BungieClan = (0, _bungieClan2.default)(this.db);

            return new Promise(function (resolve, reject) {
                _bungieSdkAlpha.Group.get(id).then(function (results) {
                    var content = {
                        data: JSON.stringify(results.detail),
                        deleted: 0,
                        group_id: id,
                        name: results.detail.name,
                        member_count: results.detail.memberCount,
                        latest: 1
                    };

                    BungieClan.create(content).then(function () {
                        var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(clan) {
                            return _regenerator2.default.wrap(function _callee$(_context) {
                                while (1) {
                                    switch (_context.prev = _context.next) {
                                        case 0:
                                            _context.next = 2;
                                            return _this.db.query('update bungie_clan set latest = 0 where id in (select id from oldest_latest_clan_view)');

                                        case 2:
                                            resolve(clan);

                                        case 3:
                                        case 'end':
                                            return _context.stop();
                                    }
                                }
                            }, _callee, _this);
                        }));

                        return function (_x) {
                            return _ref.apply(this, arguments);
                        };
                    }());
                }).catch(function (e) {
                    reject(e);
                });
            });
        }
    }]);
    return RegisterTask;
}();

exports.default = RegisterTask;