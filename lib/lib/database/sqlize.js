'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _sequelize = require('sequelize');

var _sequelize2 = _interopRequireDefault(_sequelize);

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var env = _dotenv2.default.config();
var hostname = "208.97.173.174";
var database = "winpixelpub";
var username = "winpixelpub";
var password = "wrathIncarnate";

var connection = new _sequelize2.default(database, username, password, {
    host: hostname,
    logging: false,
    dialect: "mysql",
    pool: {
        max: 10,
        min: 0,
        acquire: 1000000,
        idle: 10000,
        timeout: 10000000
    },
    define: {
        paranoid: false,
        timestamps: true,
        freezeTableName: true,
        underscored: true
    }
});

exports.default = connection;