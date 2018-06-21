'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

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

var _bungieMembership = require('../database/models/bungieMembership');

var _bungieMembership2 = _interopRequireDefault(_bungieMembership);

var _bungieMember = require('../database/models/bungieMember');

var _bungieMember2 = _interopRequireDefault(_bungieMember);

var _bungieMemberError = require('../database/models/bungieMemberError');

var _bungieMemberError2 = _interopRequireDefault(_bungieMemberError);

var _bungieSdkAlpha = require('bungie-sdk-alpha');

var _bungieSdkAlpha2 = _interopRequireDefault(_bungieSdkAlpha);

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var env = _dotenv2.default.config();

var ClanRefresh = function () {
    function ClanRefresh(db, msg) {
        (0, _classCallCheck3.default)(this, ClanRefresh);

        this.db = db;
        this.msg = msg;
    }

    (0, _createClass3.default)(ClanRefresh, [{
        key: 'getClan',
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(id) {
                var BungieClan, queryObject;
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                BungieClan = (0, _bungieClan2.default)(this.db);
                                queryObject = {
                                    order: [['synced_at', 'ASC']],
                                    limit: 1
                                };


                                if (!isNaN(id) && id !== 0) {
                                    queryObject.where = { group_id: id };
                                }

                                _context.next = 5;
                                return BungieClan.find(queryObject);

                            case 5:
                                return _context.abrupt('return', _context.sent);

                            case 6:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function getClan(_x) {
                return _ref.apply(this, arguments);
            }

            return getClan;
        }()
    }, {
        key: 'log',
        value: function log(string) {
            if (this.msg !== false) {
                this.msg.channel.send(string);
            } else {
                console.log(string);
            }
        }
    }, {
        key: 'refreshMember',
        value: function refreshMember(membership, memberData) {
            var _contents;

            var BungieMember = (0, _bungieMember2.default)(this.db);

            var query = {
                where: { destiny_id: membership.destiny_member_id }
            };

            var contents = (_contents = {
                deleted: false,
                name: memberData.userInfo.displayName,
                last_seen: memberData.dateLastPlayed,
                type: membership.membership_type,
                bungie_id: membership.bungie_member_id,
                destiny_id: membership.destiny_member_id,
                active_clan_id: membership.clan_id
            }, (0, _defineProperty3.default)(_contents, 'type', membership.membership_type), (0, _defineProperty3.default)(_contents, 'data', JSON.stringify({
                profile: memberData
            })), _contents);

            return new Promise(function (resolve, reject) {
                BungieMember.findOrCreate(query).spread(function (member, created) {
                    if (!membership.member_id) {
                        membership.member_id = member.id;
                        membership.save();
                    }

                    member.update(contents).then(function (_member) {
                        resolve(_member);
                    });
                });
            });
        }
    }, {
        key: 'refreshMemberData',
        value: function () {
            var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(member, clan) {
                var bungieMemberError, membership, destinyInfo, profile, memberData;
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                bungieMemberError = (0, _bungieMemberError2.default)(this.db);
                                _context2.prev = 1;
                                _context2.next = 4;
                                return this.refreshMembership(member, clan);

                            case 4:
                                membership = _context2.sent;
                                _context2.prev = 5;
                                destinyInfo = member.destinyUserInfo;
                                _context2.next = 9;
                                return _bungieSdkAlpha2.default.DestinyProfile.getProfile(destinyInfo.membershipType, [100], destinyInfo.membershipId);

                            case 9:
                                profile = _context2.sent;
                                _context2.next = 12;
                                return this.refreshMember(membership, profile.profile.data);

                            case 12:
                                memberData = _context2.sent;
                                _context2.next = 21;
                                break;

                            case 15:
                                _context2.prev = 15;
                                _context2.t0 = _context2['catch'](5);
                                _context2.next = 19;
                                return bungieMemberError.create({
                                    membership_id: membership.id,
                                    response: JSON.stringify(_context2.t0),
                                    data: JSON.stringify(member)
                                });

                            case 19:
                                console.log("[ERROR]");
                                console.log(_context2.t0);

                            case 21:
                                _context2.next = 27;
                                break;

                            case 23:
                                _context2.prev = 23;
                                _context2.t1 = _context2['catch'](1);

                                console.log("[ERROR]");
                                console.log(_context2.t1);

                            case 27:
                                return _context2.abrupt('return', true);

                            case 28:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this, [[1, 23], [5, 15]]);
            }));

            function refreshMemberData(_x2, _x3) {
                return _ref2.apply(this, arguments);
            }

            return refreshMemberData;
        }()
    }, {
        key: 'refreshMembership',
        value: function refreshMembership(member, clan) {
            var BungieMembership = (0, _bungieMembership2.default)(this.db);
            var destinyInfo = member.destinyUserInfo;

            var query = {
                where: { destiny_member_id: destinyInfo.membershipId }
            };

            var contents = {
                clan_id: clan.id,
                bungie_clan_id: clan.group_id,
                membership_type: destinyInfo.membershipType,
                destiny_member_id: destinyInfo.membershipId,
                deleted: 0
            };

            if (destinyInfo.bungieNetUserInfo !== undefined) {
                contents.bungie_member_id = destinyInfo.bungieNetUserInfo.membershipId;
            };

            return new Promise(function (resolve, reject) {
                BungieMembership.findOrCreate(query).spread(function (member, created) {
                    member.update(contents).then(function (_member) {
                        resolve(_member);
                    });
                });
            });
        }
    }, {
        key: 'run',
        value: function run(id, client) {
            var _this = this;

            return new Promise(function () {
                var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(resolve, reject) {
                    var clan, group, updates;
                    return _regenerator2.default.wrap(function _callee4$(_context4) {
                        while (1) {
                            switch (_context4.prev = _context4.next) {
                                case 0:
                                    _context4.next = 2;
                                    return _this.getClan(id);

                                case 2:
                                    clan = _context4.sent;


                                    _this.log('Refreshing next clan in queue: ' + clan.name);

                                    _context4.next = 6;
                                    return new _bungieSdkAlpha2.default.Group(clan.group_id);

                                case 6:
                                    group = _context4.sent;
                                    updates = {
                                        data: JSON.stringify(group.clean()),
                                        name: group.detail.name,
                                        member_count: group.detail.memberCount,
                                        synced_at: new Date()
                                    };


                                    clan.update(updates).then(function () {
                                        var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(_clan) {
                                            var members, updates;
                                            return _regenerator2.default.wrap(function _callee3$(_context3) {
                                                while (1) {
                                                    switch (_context3.prev = _context3.next) {
                                                        case 0:
                                                            _context3.next = 2;
                                                            return _this.db.query('update bungie_membership set deleted = 1 where bungie_clan_id = ' + clan.group_id);

                                                        case 2:
                                                            _context3.next = 4;
                                                            return _this.db.query('update bungie_member set active_clan_id = NULL where active_clan_id = ' + clan.group_id);

                                                        case 4:
                                                            _context3.next = 6;
                                                            return group.getMembers();

                                                        case 6:
                                                            members = _context3.sent;
                                                            updates = members.members.map(function (member) {
                                                                return _this.refreshMemberData(member, clan);
                                                            });


                                                            Promise.all(updates).then(function () {
                                                                _this.log("Refresh succesfully completed");

                                                                if (group.detail.memberCount >= 75 && _clan.latest == 1 && client !== null) {
                                                                    client.guilds.map(function (guild) {
                                                                        guild.owner.send('Sup, ' + group.detail.name + ' is one of the latest 4 clans and is at ' + group.detail.memberCount + '/100 members');
                                                                    });
                                                                }

                                                                resolve();
                                                            }).catch(function (e) {
                                                                console.log(e);
                                                                _this.log("An error has occured.");
                                                            });

                                                        case 9:
                                                        case 'end':
                                                            return _context3.stop();
                                                    }
                                                }
                                            }, _callee3, _this);
                                        }));

                                        return function (_x6) {
                                            return _ref4.apply(this, arguments);
                                        };
                                    }());

                                case 9:
                                case 'end':
                                    return _context4.stop();
                            }
                        }
                    }, _callee4, _this);
                }));

                return function (_x4, _x5) {
                    return _ref3.apply(this, arguments);
                };
            }());
        }
    }]);
    return ClanRefresh;
}();

exports.default = ClanRefresh;