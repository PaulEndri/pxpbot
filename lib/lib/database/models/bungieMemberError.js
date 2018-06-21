'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = Model;

var _sequelize = require('sequelize');

var _sequelize2 = _interopRequireDefault(_sequelize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Model(database) {
    return database.define('bungie_error_member', {
        membership_id: _sequelize2.default.INTEGER,
        data: _sequelize2.default.TEXT,
        response: _sequelize2.default.TEXT
    });
}