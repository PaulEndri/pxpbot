'use strict';
import Sqlize from 'sequelize';

export default function Model(database) {
    return database.define("bungie_clan",
        {
            data:         Sqlize.TEXT,
            deleted:      Sqlize.BOOLEAN,
            group_id:     Sqlize.INTEGER,
            synced_at:    Sqlize.DATE,
            name:         Sqlize.STRING,
            member_count: Sqlize.INTEGER
        }
    )
};