'use strict';
import Sequelize from 'sequelize';
import dotenv from 'dotenv';

const env = dotenv.config();
const hostname = "208.97.173.174";
const database = "winpixelpub";
const username = "winpixelpub";
const password = "wrathIncarnate";

var connection = new Sequelize(database, username, password, {
    host    : hostname,
    logging : false,
    dialect : "mysql",
    pool    : {
        max:     10,
        min:     0,
        acquire: 1000000,
        idle:    10000,
        timeout: 10000000
    },
    define : {
        paranoid:        false,
        timestamps:      true,
        freezeTableName: true,
        underscored:     true
      }
});

export default connection;

