import _DiscordRoles from '../database/models/discordRoles';
import { Op } from 'sequelize';
import moment from 'moment';

export default class Role {
    constructor(db, msg) {
        this.roles     = null;
        this.reactions = null;
        this.db        = db;
        this.message   = msg;
    }

    async getRoles() {
        const Roles    = new _DiscordRoles(this.db);
        this.roles     = await Roles.findAll({ raw: true });
        this.reactions = this.roles.map(r => r.identifier);
        this.embed    = this.roles.map(r => {
            return {
                name:   `r.name ${r.reaction}`,
                inline: true
            };
        });
    }

    getFilter(m) {
        return (r, u) => this.reactions.includes(r.emoji.identifier) && u.id == m.id;
    }

    async toggle(ctx) {
        if(this.reactions === null) {
            await this.getRoles();
        }
        
        return new Promise((resolve, reject) => {
            let msg   = this.message;
            let embed = this.roles.map(r => {
                return {
                    name   : `${r.name}`,
                    value  : `${r.reaction}`,
                    inline : true
                };
            });

            msg
                .channel
                .send(`Role Toggle for <@${msg.member.id}>`, { embed: { title: "Role Toggle", fields: embed } })
                .then(message => {
                    for (let _role of this.roles) {
                        message.react(_role.identifier)
                    }

                    const collector = message.createReactionCollector(this.getFilter(msg.member), {time: 60000});
                    const init = message.reactions.clone();

                    collector.on('collect', r => {
                        let role = this.roles.find(role => role.identifier === r.emoji.identifier);

                        if(!role) {
                            return;
                        }

                        let existingRole = msg.member.roles.get(role.value);

                        if(existingRole !== undefined && existingRole !== null) {
                            msg.member.removeRole(role.value);
                            message.reactions = init;
                        } else {
                            msg.member.addRole(role.value);
                            message.reactions = init;
                        }

                    });

                    collector.on('end', () => {
                        msg.delete();
                        message.delete();
                    });
                })

        });
    }

}