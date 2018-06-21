'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = Model;

var _sequelize = require('sequelize');

var _sequelize2 = _interopRequireDefault(_sequelize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Model(database) {
    return database.define("discord_roles", {
        value: _sequelize2.default.STRING,
        name: _sequelize2.default.STRING,
        reaction: _sequelize2.default.STRING,
        identifier: _sequelize2.default.STRING
    });
};