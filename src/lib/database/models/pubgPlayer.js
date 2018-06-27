'use strict';
import Sqlize from 'sequelize';

export default function Model(database) {
    return database.define('bungie_membership', 
        {
            id          : Sqlize.BIGINT,
            pubg_id     : Sqlize.STRING,
            name        : Sqlize.STRING,
            last_pinged : Sqlize.DATE,
        }
    );
}