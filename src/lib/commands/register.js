import _BungieClan from '../database/models/bungieClan';
import { Group } from 'bungie-sdk-alpha';

// I love sequelize - Not
export default class RegisterTask {
    constructor(db) {
        this.db = db;
    }

    async setPlatform(id, platform) {
        const BungieClan = _BungieClan(this.db);
        const clan       = await BungieClan.findOne({where: {group_id: id}});

        if (!clan) {
            return 'Clan not found'
        }

        await clan.update({platform})

        return 'Clan platform succesfully updated'
    }

    run(id, platform) {
        const BungieClan = _BungieClan(this.db);
        
        return new Promise((resolve, reject) => {
            Group
                .get(id)
                .then(results => {
                    let content = {
                        data:         JSON.stringify(results.detail),
                        deleted:      0,
                        group_id:     id,
                        name:         results.detail.name,
                        member_count: results.detail.memberCount,
                        platform:     platform,
                        latest:       1
                    }

                    BungieClan
                        .create(content)
                        .then(async clan => {
                            await this.db.query(`update bungie_clan set latest = 0 where id in (select id from oldest_latest_clan_view)`);
                            resolve(clan)
                        });
                })
                .catch(e => {
                    reject(e)
                });
        });

    }
}