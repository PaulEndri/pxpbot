import ClanRefresh from './lib/tasks/clanRefresh';
import Inactive from './lib/commands/inactive';
import RegisterTask from './lib/commands/register';
import ResponseMessage from './lib/util/responseMessage';
import Ark from './lib/ark/ark';

var refreshing = false;

export default class ModeratorApp {
    constructor(db) {
        this.db = db;
    }

    updateclan(ctx, message) {
        const registerTask = new RegisterTask(this.db);

        return registerTask
            .setPlatform(ctx[1], ctx[2])
            .then(response => message.channel.send(response))
            .catch(e => message.channel.send('An error has occured'))
    }

    registerclan(ctx, message) {
        const registerTask = new RegisterTask(this.db);
        
        return registerTask
            .run(ctx[1], ctx[2])
            .then(clan => {
                message.channel.send(`Succesfully registered ${clan.name} for platform ${clan.platform}`);
            })
            .catch(e => {
                message.channel.send(`An error has occured`);
            })
    }

    inactive(ctx, message) {
        const InactiveTask = new Inactive(this.db);
        let response       = new ResponseMessage(message);        
        let span           = parseInt(ctx[1]) || 30;
        let clanId         = parseInt(ctx[2]) || false;

        return InactiveTask
            .run(span, clanId)
            .then(r => response.send(r))
            .then(results => {
                message.channel.send(`A total of ${results.length} members have been inactive for ${span} days`);
            });
    }

    inactivecount(ctx, message) {
        const InactiveTask = new Inactive(this.db);
        let span           = parseInt(ctx[1]) || 30;

        return InactiveTask
            .run(span)
            .then(results => {
                message.channel.send(`A total of ${results.length} members have been inactive for ${span} days`);
            });
    }

    refresh(ctx, message) {
        if(refreshing === true) {
            message.channel.send("Another refresh instance is occuring, please wait until it's completed");
            return false;
        }
    
        let task   = new ClanRefresh(this.db, message);
        refreshing = true;

        // after 15 seconds, even if we're still processing, allow another refresh
        setTimeout(()=>{refreshing=false}, 15000);

        return task
            .run(ctx[1], this.client)
            .then(results => {
                refreshing = false;
                // do nothing
            })
            .catch(e => {
                console.log(e);
                refreshing = false;
                message.channel.send("An error has occurred.");
            });
    }
}