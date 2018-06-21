'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = Model;

var _sequelize = require('sequelize');

var _sequelize2 = _interopRequireDefault(_sequelize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Model(database) {
    return database.define('bungie_membership', {
        member_id: _sequelize2.default.BIGINT,
        clan_id: _sequelize2.default.BIGINT,
        bungie_clan_id: _sequelize2.default.BIGINT,
        bungie_member_id: _sequelize2.default.BIGINT,
        destiny_member_id: _sequelize2.default.BIGINT,
        membership_type: _sequelize2.default.STRING,
        deleted: _sequelize2.default.BOOLEAN
    });
}