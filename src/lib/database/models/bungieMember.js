'use strict';
import Sqlize from 'sequelize';

export default function Model(database) {
    return database.define('bungie_member', 
        {
            bungie_id:  Sqlize.BIGINT,
            destiny_id: Sqlize.BIGINT,
            last_seen:  Sqlize.DATE,
            type:       Sqlize.STRING,
            data:       Sqlize.TEXT,
            name:       Sqlize.STRING,
            deleted:    Sqlize.BOOLEAN
        }
    );
}