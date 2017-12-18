import ClanList from './lib/commands/clanList';
import db from './lib/database/sqlize';
import ClanRefresh from './lib/tasks/clanRefresh';
import Inactive from './lib/commands/inactive';
import RegisterTask from './lib/commands/register';
import cron from 'node-cron';

export default class App {
    static process(message) {
        let mod = message.member.roles.find('name', 'Moderator') ? true : false;
        let adm = message.member.roles.find('name', 'Administrator') ? true : false;
        let adv = mod || adm;
        let msg = message.content.toLowerCase();
        let ctx = msg.split(' ');
        let key = ctx[0];

        if(key === '!registerclan' && adv) {
            var registerTask = new RegisterTask(db);

            registerTask
                .run(ctx[1])
                .then(clan => {
                    message.channel.send(`Succesfully registered ${clan.name}`);
                })
                .catch(e => {
                    message.channel.send(`An error has occured`);
                })
        }

        if(key === '!inactive' && adv) {
            const InactiveTask = new Inactive(db);
            let span = parseInt(ctx[1]) || 30;

            InactiveTask
                .run(span)
                .then(results => {
                    message.channel.send(results.join("\n"));
                });
        }

        if(key === '!refresh' && adv) {
            let task = new ClanRefresh(db, message);

            task
                .run()
                .then(results => {
                    // do nothing
                })
                .catch(e => {
                    console.log(e);
                    message.channel.send("An error has occurred.");
                });
        }

        if(key === '!clanlist') {
            ClanList
                .get(ctx[1] === 'open')
                .then(results => {
                    message.channel.send(results.join("\n"));
                })
        };
        
    }

    static beginTasks() {
        cron.schedule('*/10 * * * *', () => {
            let task = new ClanRefresh(db, false);

            console.log("Beginning automated task run");
            task
                .run()
                .then(() => {
                    console.log("Succesfully completed automated clan refresh");
                })
                .catch(e => {
                    console.log("An error occured with automated clan refresh");
                    console.log(e);
                })
        })
    }
}