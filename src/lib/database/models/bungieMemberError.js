'use strict';
import Sqlize from 'Sequelize';

export default function Model(database) {
    return database.define('bungie_error_member', 
        {
            membership_id: Sqlize.INTEGER,
            data:          Sqlize.TEXT,
            response:      Sqlize.TEXT
        }
    );
}