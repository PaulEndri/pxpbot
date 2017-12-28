import ClanList from './lib/commands/clanList';
import db from './lib/database/sqlize';
import ModApp from './modApp';
import ResponseMessage from './lib/util/responseMessage';

const modApp = new ModApp(db);

export default class App {
    constructor(discordClient) {
        this.client   = discordClient;
        modApp.client = discordClient;
    }

    process(message) {
        if(!message.member || message.content.indexOf('!') !== 0) {
            return null;
        }

        let mod = message.member.roles.find('name', 'Moderator') ? true : false;
        let adm = message.member.roles.find('name', 'Administrator') ? true : false;
        let adv = mod || adm;
        let msg = message.content.toLowerCase();
        let ctx = msg.split(' ');
        let key = ctx[0].replace('!', '');
        
        if(typeof(this[key]) === 'function') {
            this[key](ctx, message);
        } else if(adv === true && typeof(modApp[key]) === 'function') {
            modApp[key](ctx, message);
        }
    }

    clanlist(ctx, message) {
        let clanlist = new ClanList(db);
        let response = new ResponseMessage(message);

        clanlist
            .get(['open', 'active', 'available'].includes(ctx[1]))
            .then((r) => response.send(r))
    }
}