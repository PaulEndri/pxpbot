'use strict';
import Sqlize from 'sequelize';

export default function Model(database) {
    return database.define('pubg_match_record', 
        {
            id:             Sqlize.BIGINT,
            pubg_match_id:  Sqlize.STRING,
            pubg_player_id: Sqlize.STRING,
            match_id:       Sqlize.BIGINT,
            data:           Sqlize.STRING,
            kills:          Sqlize.INT,
            assists:        Sqlize.INT,
            shame:          Sqlize.INT,
            headshots:      Sqlize.INT,
            placement:      Sqlize.INT,
            teamKills:      Sqlize.INT,
            swagKills:      Sqlize.INT,
            revives:        Sqlize.INT
        }
    );
}