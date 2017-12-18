import _BungieClan from '../database/models/bungieClan';
import _BungieMembership from '../database/models/bungieMembership';
import _BungieMember from '../database/models/bungieMember';
import BungieSDK from 'bungie-sdk-alpha';

export default class ClanRefresh {
    constructor(db, msg) {
        this.db  = db;
        this.msg = msg;
    }

    async getClan() {
        const BungieClan = _BungieClan(this.db);
        let queryObject  = {
            order : [['updated_at', 'ASC']],
            limit : this.limit
        };

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
        try {
            let membership  = await this.refreshMembership(member, clan);
            let destinyInfo = member.destinyUserInfo;        
            let profile     = await BungieSDK.DestinyProfile.getProfile(destinyInfo.membershipType, [100], destinyInfo.membershipId);
            let memberData  = await this.refreshMember(membership, profile.profile.data);
        }
        catch(e) {
            // do error stuff here later
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

    run() {
        return new Promise(async (resolve, reject) => {
            let clan  = await this.getClan();

            this.log(`Refreshing next clan in queue: ${clan.name}`);

            let group = await new BungieSDK.Group(clan.group_id);
            let updates = {
                data : JSON.stringify(group.clean()),
                member_count : group.detail.memberCount
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