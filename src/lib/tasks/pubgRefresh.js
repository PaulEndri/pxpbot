import _PubgPlayer from '../database/models/pubgPlayer';
import _PubgMatch from '../database/models/pubgMatch';
import _PubgMatchRecord from '../database/models/pubgMatchRecord';
import {Player, Match} from 'pubg-sdk-alpha';
import dotenv from 'dotenv';

const env = dotenv.config();
const cache = {}

export default class PubgRefresion {
    constructor(db, msg) {
        this.db  = db;
        this.msg = msg;
    }

    async getPlayer() {
        const PubgPlayer = _PubgPlayer(this.db);
        let queryObject  = {
            order : [['last_pinged', 'ASC']],
            limit : 1
        };

        return await PubgPlayer.find(queryObject);
    }

    async getMatch(id) {
        const PubgPlayer = _PubgPlayer(this.db);
        let queryObject  = {
            order : [['last_pinged', 'ASC']],
            limit : 1
        };

        return await PubgPlayer.find(queryObject);
    }

    log(string) {
        if(this.msg !== false) {
            this.msg.channel.send(string);
        } else {
            console.log(string);
        }
    }

    refreshMember(membership, memberData) {
        const BungieMember = _BungieMember(this.db);
        
        let query = {
            where : {destiny_id : membership.destiny_member_id}
        };

        let contents     = {
            deleted:     false,
            name:        memberData.userInfo.displayName,
            last_seen:   memberData.dateLastPlayed,
            type:        membership.membership_type,
            bungie_id:   membership.bungie_member_id,
            destiny_id:  membership.destiny_member_id,
            type:        membership.membership_type,
            data:        JSON.stringify({
                profile: memberData
            })
        };

        return new Promise((resolve, reject) => {
            BungieMember
                .findOrCreate(query)
                .spread((member, created) => {
                    if(!membership.member_id) {
                        membership.member_id = member.id;
                        membership.save();
                    }

                    member
                        .update(contents)
                        .then(_member => {
                            resolve(_member);
                        })
                })
        })
    }

    async run(id, client) {
        let player  = await this.getPlayer();

        this.log(`Refreshing next player in queue in queue: ${player.name}`);

        let pubgPlayer = await new Player(player.pubg_id);
        let matches = pubgPlayer.matches.map(m => m.id)

        let query = {
            where : {match_id : membership.destiny_member_id}
        };
        player
            .update(updates)
            .then(async _player => {
                await this.db.query(`update bungie_membership set deleted = 1 where bungie_player_id = ${player.group_id}`);

                let members = await group.getMembers();                
                let updates = members.members.map(member => this.refreshMemberData(member, player));

                Promise
                    .all(updates)
                    .then(() => {
                        this.log("Refresh succesfully completed");

                        if(group.detail.memberCount >= 75 && _player.latest == 1 && client !== null) {
                            client.guilds.map(guild => {
                                guild.owner.send(`Sup, ${group.detail.name} is one of the latest 4 players and is at ${group.detail.memberCount}/100 members`);
                            });
                        }

                        resolve();
                    })
                    .catch(e => {
                        console.log(e);
                        this.log("An error has occured.");
                    });
            });    
    }
}