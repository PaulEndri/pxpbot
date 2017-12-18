import _BungieClan from '../database/models/bungieClan';
import { Group } from 'bungie-sdk-alpha';

// I love sequelize - Not
export default class RegisterTask {
    constructor(db) {
        this.db = db;
    }

    run(id) {
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
                        member_count: results.detail.memberCount
                    }

                    BungieClan
                        .create(content)
                        .then(clan => {
                            resolve(clan)
                        });
                })
                .catch(e => {
                    reject(e)
                });
        });

    }
}