'use strict';
import Sqlize from 'sequelize';

export default function Model(database) {
    return database.define('bungie_error_member', 
        {
            membership_id: Sqlize.INTEGER,
            data:          Sqlize.TEXT,
            response:      Sqlize.TEXT
        }
    );
}