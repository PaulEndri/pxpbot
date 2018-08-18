import db from './lib/database/sqlize';
import ModApp from './modApp';
import Roles from './lib/roles/role';

const modApp = new ModApp(db);

/**
 * Core message handling app
 */
export default class App {
    /**
     * Requires a local reference to discord client instance
     * that then gets assigned to the mod component
     * @param {Client} discordClient 
     */
    constructor(discordClient) {
        this.client   = discordClient;
        modApp.client = discordClient;
    }

    /**
     * All messages that come in get process through here
     * @todo add analytics logging here
     * 
     * @param {Message} message 
     */
    process(message) {
        if (!message.member || message.content.indexOf('!') !== 0) {
            return null;
        }

        const mod = message.member.roles.find('id', '298481589506015232') ? true : false;
        const adm = message.member.roles.find('id', '298481229316227073') ? true : false;
        const adv = mod || adm;
        const msg = message.content.toLowerCase();
        const ctx = msg.split(' ');
        const key = ctx[0].replace('!', '');
        
        if (typeof(this[key]) === 'function') {
            this[key](ctx, message);
        } else if(adv === true && typeof(modApp[key]) === 'function') {
            // pass it off the mod message handler
            modApp[key](ctx, message);
        }
    }

    roles(ctx, message) {
        let roles = new Roles(db, message);

        roles.toggle(ctx);
    }
}