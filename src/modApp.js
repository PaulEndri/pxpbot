import db from './lib/database/sqlize';
import ClanRefresh from './lib/tasks/clanRefresh';
import Inactive from './lib/commands/inactive';
import RegisterTask from './lib/commands/register';

var refreshing = false;

export default class ModeratorApp {
    updates(ctx, message) {
        let messages = [
            "\nUpdates in the latest version:",
            "\t- This command!",
            "\t- !refresh now accepts an optional parameters of a bungie Group Id to forcefully refresh a specific group",
            "\t- !inactive now filters out users already deleted"
        ]

        message.channel.send(messages.join("\n"));

        return true;
    }

    registerclan(ctx, message) {
        var registerTask = new RegisterTask(db);
        
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
        const InactiveTask = new Inactive(db);
        let span = parseInt(ctx[1]) || 30;

        return InactiveTask
            .run(span)
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

                message.channel.send(`A total of ${results.length} members have been inactive for ${span} days`);
            });
    }

    refresh(ctx, message) {
        if(refreshing === true) {
            message.channel.send("Another refresh instance is occuring, please wait until it's completed");
            return false;
        }
    
        let task   = new ClanRefresh(db, message);
        refreshing = true;

        return task
            .run(ctx[1])
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