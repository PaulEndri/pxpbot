import _BungieClan from '../database/models/bungieClan';
import _BungieMembership from '../database/models/bungieMembership';
import _BungieMember from '../database/models/bungieMember';
import BungieSDK from 'bungie-sdk-alpha';
import {Op} from 'sequelize';
import moment from 'moment';

const typeMap = {
    "1" : "XB1",
    "2" : "PS4",
    "4" : "PC"
};
// I love sequelize - Not
export default class Inactive {
    constructor(db) {
        this.db = db;
    }

    run(span) {
        const BungieMember     = _BungieMember(this.db);
        const BungieMembership = _BungieMembership(this.db);
        const BungieClan       = _BungieClan(this.db);

        BungieMember.hasOne(BungieMembership, {
            foreignKey: 'member_id',
            as        : 'Member'
        });

        BungieMembership.belongsTo(BungieClan, {
            foreignKey: 'clan_id',
            as        : 'Clan'
        });
        
        let threshold = moment().subtract(span, 'days').valueOf();

        return new Promise((resolve, reject) => {
            BungieMember.findAll({
                include : [
                    {association: 'Member', include:[{association: 'Clan'}]}
                ],
                where : {
                    last_seen : {
                        [Op.lte]: threshold
                    },
                    deleted : false
                },
                raw : true
            })
                .then(results => {
                    resolve(results.map(_result => {
                        let _lastSeen = moment(_result.last_seen).format('MM/DD/YYYY');
                        let clanName  = _result['Member.Clan.name'];
                        let type      = typeMap[_result['Member.membership_type']];
                        return `[${clanName}]-[${type}] - ${_result.name} was last seen ${_lastSeen}`;
                    }));
                });
        });
    }
}