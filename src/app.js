import ClanList from './lib/commands/clanList';
import db from './lib/database/sqlize';
import ModApp from './modApp';

const modApp = new ModApp(db);

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
        let clanlist = new ClanList(db);

        clanlist
            .get(ctx[1] === 'open')
            .then(results => {
                let _response = results.join("\n");
                
                if(_response.length < 2000) {
                    message.channel.send(_response);
                } else {
                    let partCount = Math.ceil(_response.length/2000);
                    let resultSize = Math.ceil(results.length/partCount);

                    for(let i = 0; i < partCount; i++) {
                        let chunk = results.slice(i*resultSize, (i*resultSize)+resultSize); 
                        
                        message.channel.send(chunk.join("\n"));
                    }
                }
            })
    }
}