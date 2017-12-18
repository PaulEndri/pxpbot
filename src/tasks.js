import ClanRefresh from './lib/tasks/clanRefresh';
import cron from 'node-cron';
import db from './lib/database/sqlize';

export default class Tasks {
    static begin() {
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