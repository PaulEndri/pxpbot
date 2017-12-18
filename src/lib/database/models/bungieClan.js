'use strict';
import Sqlize from 'Sequelize';

export default function Model(database) {
    return database.define("bungie_clan",
        {
            data:         Sqlize.TEXT,
            deleted:      Sqlize.BOOLEAN,
            group_id:     Sqlize.INTEGER,
            name:         Sqlize.STRING,
            member_count: Sqlize.INTEGER
        }
    )
};