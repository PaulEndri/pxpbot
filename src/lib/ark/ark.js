import SourceQuery from 'sourcequery';

const timeoutBuffer = 3000;
const ArkServer     = '45.35.132.58';
const ArkPort       = '20716';
const query         = new SourceQuery(timeoutBuffer);

query.open(ArkServer, ArkPort);

export default class Ark {
    static handle(ctx, message) {
        let parameter = ctx[1];

        if (Ark[parameter] !== undefined && parameter != 'handle') {
            return Ark[parameter](ctx, message);
        }

        return Promise.resolve("Invalid Parameter");
    }

    static players(ctx, message) {
        let players = ["Players active on Pixelpub Server:"];

        return new Promise((resolve, reject) => {
            query.getPlayers((error, playerList) => {
                
                if(error) {
                    return reject(error);
                }

                for(var player of playerList) {
                    players.push(`\t- ${player.name} - Online for ` + Math.round(parseFloat(player.online)/60) + ' minutes');
                }

                if(players.length === 1) {
                    players.push("\t- No players available at this time");
                }

                resolve(players);
            });
        });
    }

    static server(ctx, message) {

        return new Promise((resolve, reject) => {
            query.getInfo((error, information) => {
                if (error) {
                    return reject(error);
                }

                query.getRules((error, rules) => {
                    if (error) {
                        return reject(error);
                    }

                    let worldTime;

                    try {
                        worldTime = rules.find(r => r.name === 'DayTime_s').value.toString();
                        worldTime = worldTime.length === 3 ? worldTime + "0" : worldTime;
                        worldTime = worldTime.substring(0, 2) + ":" + worldTime.substring(2);
                    } catch(e) {
                        worldTime = 'Unknown'
                    }
                    
                    let serverInformation = [
                        "Information on the Pixelpub Ark: Survival Evolved Server",
                        `\tServer Name: ${information.name}`,
                        `\tMap: ${information.map}`,
                        `\tPlayers: ${information.players}/${information.maxplayers}`,
                        '\tWorld Time: ' + worldTime,
                        '\tDedicated: ' + (information.servertype === "d" ? "Yes" : "No"),
                        '\tPlatform: ' + (information.environment === "w" ? "Windows" : information.environment === "l" ? "Linux" : "Mac")
                    ];

                    resolve(serverInformation);
                });
            });
        });
    }
}