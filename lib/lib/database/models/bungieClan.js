'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = Model;

var _sequelize = require('sequelize');

var _sequelize2 = _interopRequireDefault(_sequelize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Model(database) {
    return database.define("bungie_clan", {
        data: _sequelize2.default.TEXT,
        deleted: _sequelize2.default.BOOLEAN,
        group_id: _sequelize2.default.INTEGER,
        synced_at: _sequelize2.default.DATE,
        name: _sequelize2.default.STRING,
        member_count: _sequelize2.default.INTEGER,
        latest: _sequelize2.default.BOOLEAN
    });
};