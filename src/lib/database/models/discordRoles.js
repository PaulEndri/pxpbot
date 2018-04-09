'use strict';
import Sqlize from 'sequelize';

export default function Model(database) {
    return database.define("discord_roles",
        {
            value:      Sqlize.STRING,
            name:       Sqlize.STRING,
            reaction:   Sqlize.STRING,
            identifier: Sqlize.STRING
        }
    )
};