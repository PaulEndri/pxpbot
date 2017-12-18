'use strict';
import Sqlize from 'sequelize';

export default function Model(database) {
    return database.define('bungie_membership', 
        {
            member_id:         Sqlize.BIGINT,
            clan_id:           Sqlize.BIGINT,
            bungie_clan_id:    Sqlize.BIGINT,
            bungie_member_id:  Sqlize.BIGINT,
            destiny_member_id: Sqlize.BIGINT,
            membership_type:   Sqlize.STRING,
            deleted:           Sqlize.BOOLEAN
        }
    );
}