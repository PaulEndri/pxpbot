'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = Model;

var _sequelize = require('sequelize');

var _sequelize2 = _interopRequireDefault(_sequelize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Model(database) {
    return database.define('bungie_member', {
        bungie_id: _sequelize2.default.BIGINT,
        destiny_id: _sequelize2.default.BIGINT,
        last_seen: _sequelize2.default.DATE,
        type: _sequelize2.default.STRING,
        data: _sequelize2.default.TEXT,
        name: _sequelize2.default.STRING,
        deleted: _sequelize2.default.BOOLEAN,
        active_clan_id: _sequelize2.default.BIGINT
    });
}