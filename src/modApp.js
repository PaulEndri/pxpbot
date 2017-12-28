import ClanRefresh from './lib/tasks/clanRefresh';
import Inactive from './lib/commands/inactive';
import RegisterTask from './lib/commands/register';
import ResponseMessage from './lib/util/responseMessage';

var refreshing = false;

export default class ModeratorApp {
    constructor(db) {
        this.db = db;
    }

    updates(ctx, message) {
        let messages = [
            "\nUpdates in the latest version:",
            "\t- The latest 4 clans are now recorded in the db",
            "\t- Refreshes will ping server owner if a latest clan is at 75/100"
        ]

        message.channel.send(messages.join("\n"));

        return true;
    }

    registerclan(ctx, message) {
        var registerTask = new RegisterTask(this.db);
        
        return registerTask
            .run(ctx[1])
            .then(clan => {
                message.channel.send(`Succesfully registered ${clan.name}`);
            })
            .catch(e => {
                message.channel.send(`An error has occured`);
            })
    }

    inactive(ctx, message) {
        const InactiveTask = new Inactive(this.db);
        let response       = new ResponseMessage(message);        
        let span           = parseInt(ctx[1]) || 30;

        return InactiveTask
            .run(span)
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