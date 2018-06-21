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

var _discordRoles = require('../database/models/discordRoles');

var _discordRoles2 = _interopRequireDefault(_discordRoles);

var _sequelize = require('sequelize');

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Role = function () {
    function Role(db, msg) {
        (0, _classCallCheck3.default)(this, Role);

        this.roles = null;
        this.reactions = null;
        this.db = db;
        this.message = msg;
    }

    (0, _createClass3.default)(Role, [{
        key: 'getRoles',
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
                var Roles;
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                Roles = new _discordRoles2.default(this.db);
                                _context.next = 3;
                                return Roles.findAll({ raw: true });

                            case 3:
                                this.roles = _context.sent;

                                this.reactions = this.roles.map(function (r) {
                                    return r.identifier;
                                });
                                this.embed = this.roles.map(function (r) {
                                    return {
                                        name: 'r.name ' + r.reaction,
                                        inline: true
                                    };
                                });

                            case 6:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function getRoles() {
                return _ref.apply(this, arguments);
            }

            return getRoles;
        }()
    }, {
        key: 'getFilter',
        value: function getFilter(m) {
            var _this = this;

            return function (r, u) {
                return _this.reactions.includes(r.emoji.identifier) && u.id == m.id;
            };
        }
    }, {
        key: 'toggle',
        value: function () {
            var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(ctx) {
                var _this2 = this;

                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                if (!(this.reactions === null)) {
                                    _context2.next = 3;
                                    break;
                                }

                                _context2.next = 3;
                                return this.getRoles();

                            case 3:
                                return _context2.abrupt('return', new Promise(function (resolve, reject) {
                                    var msg = _this2.message;
                                    var embed = _this2.roles.map(function (r) {
                                        return {
                                            name: '' + r.name,
                                            value: '' + r.reaction,
                                            inline: true
                                        };
                                    });

                                    msg.channel.send('Role Toggle for <@' + msg.member.id + '>', { embed: { title: "Role Toggle", fields: embed } }).then(function (message) {
                                        var _iteratorNormalCompletion = true;
                                        var _didIteratorError = false;
                                        var _iteratorError = undefined;

                                        try {
                                            for (var _iterator = _this2.roles[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                                                var _role = _step.value;

                                                message.react(_role.identifier);
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

                                        var collector = message.createReactionCollector(_this2.getFilter(msg.member), { time: 60000 });
                                        var init = message.reactions.clone();

                                        collector.on('collect', function (r) {
                                            var role = _this2.roles.find(function (role) {
                                                return role.identifier === r.emoji.identifier;
                                            });

                                            if (!role) {
                                                return;
                                            }

                                            var existingRole = msg.member.roles.get(role.value);

                                            if (existingRole !== undefined && existingRole !== null) {
                                                msg.member.removeRole(role.value);
                                                message.reactions = init;
                                            } else {
                                                msg.member.addRole(role.value);
                                                message.reactions = init;
                                            }
                                        });

                                        collector.on('end', function () {
                                            msg.delete();
                                            message.delete();
                                        });
                                    });
                                }));

                            case 4:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function toggle(_x) {
                return _ref2.apply(this, arguments);
            }

            return toggle;
        }()
    }]);
    return Role;
}();

exports.default = Role;