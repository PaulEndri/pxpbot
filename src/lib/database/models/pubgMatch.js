'use strict';
import Sqlize from 'sequelize';

export default function Model(database) {
    return database.define('pubg_match', 
        {
            id          : Sqlize.BIGINT,
            pubg_id     : Sqlize.STRING,
            data        : Sqlize.STRING,
            map         : Sqlize.STRING,
            type        : Sqlize.STRING,
            length      : Sqlize.BIGINT,
            date        : Sqlize.DATE
        }
    );
}