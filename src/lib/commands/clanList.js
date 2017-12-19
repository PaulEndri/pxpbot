import {Group} from 'bungie-sdk-alpha';
import _BungieClan from '../database/models/bungieClan';
import moment from 'moment';
import converter from 'roman-numeral-converter-mmxvi';

export default class ClanList {
    constructor(db) {
        this.db     = db;
        this.cache  = [];
        this.cached = null;
    }

    cleanUpString(string) {
        let noises = [
            "\t",
            ' ',
            '[EU]',
            'WRATH',
            'INCARNATE'
        ];

        let val = string.split('-')[0];

        for(let noise of noises) {
            val = val.replace(noise, '')
        }
        
        return converter.getIntegerFromRoman(val.trim());
    }

    get(active = false) {
        return this
            .getData()
            .then(results => this.processResults(results, active));
    }

    async getData() {
        let cache        = await this.verifyCache();
        let promises     = [];
        const BungieClan = _BungieClan(this.db);

        if(cache) {
            return this.cache;
        }

        let _clans = await BungieClan.findAll({raw: true});

        for(var clan of clans) {
            promises.push(new Group(clan.group_id));
        }

        return await Promise
            .all(promises)
            .then(results => {
                this.cache = results;
                this.cached = moment();

                return results;
            })
    }

    processResults(data, active) {
        let msges = ["Clan list :"];

        for(var result of data) {
            let detail = result.detail;
            let msg = `${detail.name}\t-\t${detail.memberCount}/100`;

            
            if(detail.memberCount != 100) {
                msg = msg.toUpperCase().replace('14', 'XIV').replace('1', 'I');                
                msg += `\t-\thttps://www.bungie.net/en/ClanV2?groupId=${detail.groupId}`;
            } else if(active === true) {
                continue;
            } else {
                msg = msg.toUpperCase().replace('14', 'XIV').replace('1', 'I');                
            }


            if(msg.indexOf('EU') >= 0) {
                msg = "[EU] " + msg.replace(' EU', '');
            }

            msges.push(msg);
        }

        msges = msges.sort((a, b) => {
            let aVal = this.cleanUpString(a);
            let bVal = this.cleanUpString(b);
            
            if(a.indexOf('EU') >= 0) {
               aVal +=100;
            };
            
            if(b.indexOf('EU') >= 0) {
                bVal+=100;
            }

            return aVal - bVal;
        })
        return msges;
    }

    async verifyCache() {
        if(this.cached === null) {
            return false;
        }

        return moment().diff(this.cached, 'minutes') > 15; 
    }

}