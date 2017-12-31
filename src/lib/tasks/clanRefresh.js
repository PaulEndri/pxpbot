import _BungieClan from '../database/models/bungieClan';
import _BungieMembership from '../database/models/bungieMembership';
import _BungieMember from '../database/models/bungieMember';
import _BungieMemberError from '../database/models/bungieMemberError';
import BungieSDK from 'bungie-sdk-alpha';
import dotenv from 'dotenv';

const env    = dotenv.config();

export default class ClanRefresh {
    constructor(db, msg) {
        this.db  = db;
        this.msg = msg;
    }

    async getClan(id) {
        const BungieClan = _BungieClan(this.db);
        let queryObject  = {
            order : [['synced_at', 'ASC']],
            limit : 1
        };

        if(!isNaN(id) && id !== 0) {
            queryObject.where = {group_id : id};
        }

        return await BungieClan.find(queryObject);
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

    async refreshMemberData(member, clan) {
        const bungieMemberError = _BungieMemberError(this.db);

        try {
            let membership  = await this.refreshMembership(member, clan);
            
            try {            
                let destinyInfo = member.destinyUserInfo;        
                let profile     = await BungieSDK.DestinyProfile.getProfile(destinyInfo.membershipType, [100], destinyInfo.membershipId);
                let memberData  = await this.refreshMember(membership, profile.profile.data);
            }
            catch(e) {
                await bungieMemberError
                    .create({
                        membership_id: membership.id,
                        response:      JSON.stringify(e),
                        data:          JSON.stringify(member)
                    })
                console.log("[ERROR]");
                console.log(e);
            }
        }
        catch(e) {
            console.log("[ERROR]");
            console.log(e);
        }

        return true;
    }

    refreshMembership(member, clan) {
        const BungieMembership = _BungieMembership(this.db);
        let destinyInfo        = member.destinyUserInfo;

        let query = {
            where : {destiny_member_id : destinyInfo.membershipId}
        };

        let contents = {
            clan_id:           clan.id,
            bungie_clan_id:    clan.group_id,
            membership_type:   destinyInfo.membershipType,
            destiny_member_id: destinyInfo.membershipId,
            deleted:           0
        }

        if(destinyInfo.bungieNetUserInfo !== undefined) {
            contents.bungie_member_id = destinyInfo.bungieNetUserInfo.membershipId
        };
        
        return new Promise((resolve, reject) => {
            BungieMembership
                .findOrCreate(query)
                .spread((member, created) => {
                    member
                        .update(contents)
                        .then(_member => {
                            resolve(_member);
                        });
                })
        });
    }

    run(id, client) {
        return new Promise(async (resolve, reject) => {
            let clan  = await this.getClan(id);

            this.log(`Refreshing next clan in queue: ${clan.name}`);

            let group = await new BungieSDK.Group(clan.group_id);
            let updates = {
                data:         JSON.stringify(group.clean()),
                name:         group.detail.name,
                member_count: group.detail.memberCount,
                synced_at:    new Date()
            };
    
            clan
                .update(updates)
                .then(async _clan => {
                    await this.db.query(`update bungie_membership set deleted = 1 where bungie_clan_id = ${clan.group_id}`);
    
                    let members = await group.getMembers();                
                    let updates = members.members.map(member => this.refreshMemberData(member, clan));
    
                    Promise
                        .all(updates)
                        .then(() => {
                            this.log("Refresh succesfully completed");

                            if(group.detail.memberCount >= 75 && _clan.latest == 1 && client !== null) {
                                client.guilds.map(guild => {
                                    guild.owner.send(`Sup, ${updates.name} is one of the latest 4 clans and is at ${member_count}/100 members`);
                                });
                            }

                            resolve();
                        })
                        .catch(e => {
                            console.log(e);
                            this.log("An error has occured.");
                        });
                });    
        })
    }
}