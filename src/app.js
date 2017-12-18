import ClanList from './lib/commands/clanList';
import ModApp from './modApp';

const modApp = new ModApp();

export default class App {
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
        ClanList
            .get(ctx[1] === 'open')
            .then(results => {
                message.channel.send(results.join("\n"));
            })
    }
}