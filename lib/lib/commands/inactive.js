'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

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

var _bungieSdkAlpha = require('bungie-sdk-alpha');

var _bungieSdkAlpha2 = _interopRequireDefault(_bungieSdkAlpha);

var _sequelize = require('sequelize');

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var typeMap = {
    "1": "XB1",
    "2": "PS4",
    "4": "PC"
};
// I love sequelize - Not

var Inactive = function () {
    function Inactive(db) {
        (0, _classCallCheck3.default)(this, Inactive);

        this.db = db;
    }

    (0, _createClass3.default)(Inactive, [{
        key: 'run',
        value: function run(span) {
            var BungieMember = (0, _bungieMember2.default)(this.db);
            var BungieMembership = (0, _bungieMembership2.default)(this.db);
            var BungieClan = (0, _bungieClan2.default)(this.db);

            BungieMember.hasOne(BungieMembership, {
                foreignKey: 'member_id',
                as: 'Member'
            });

            BungieMembership.belongsTo(BungieClan, {
                foreignKey: 'clan_id',
                as: 'Clan'
            });

            var threshold = (0, _moment2.default)().subtract(span, 'days').valueOf();

            return new Promise(function (resolve, reject) {
                BungieMember.findAll({
                    include: [{
                        association: 'Member',
                        where: { deleted: false },
                        include: [{ association: 'Clan' }]
                    }],
                    where: {
                        last_seen: (0, _defineProperty3.default)({}, _sequelize.Op.lte, threshold),
                        deleted: false
                    },
                    raw: true
                }).then(function (results) {
                    resolve(results.map(function (_result) {
                        var _lastSeen = (0, _moment2.default)(_result.last_seen).format('MM/DD/YYYY');
                        var clanName = _result['Member.Clan.name'];
                        var type = typeMap[_result['Member.membership_type']];
                        return '[' + clanName + ']-[' + type + '] - ' + _result.name + ' was last seen ' + _lastSeen;
                    }));
                });
            });
        }
    }]);
    return Inactive;
}();

exports.default = Inactive;