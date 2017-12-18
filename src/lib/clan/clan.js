'use strict';
import BungieApi from '../api/bungieApi';

export default class Clan {
    constructor(clanId) {
        this.root = 'GroupV2';
        this.id   = clanId;
    }

    get baseRoute() {
        return `${this.root}/${this.id}`;
    }

    async getDetails() {
        return await BungieApi.getAsync(this.baseRoute+"/");
    }

    getMemberPage(pageNumber) {
        let route = [
            this.baseRoute,
            'Members',
            '?currentPage='+pageNumber,
        ].join('/');

        return BungieApi.get(route);
    }

    async getData() {
        let clanData = await this.getDetails()
        let members  = await Promise
            .all([
                this.getMemberPage(1),
                this.getMemberPage(2)
            ])
            .then(results => {
                let _members = results.reduce((total, current) => total.concat(current.results), []);

                return _members;
            });

        return Object.assign({}, clanData, {
            members : members
        });
    }
}
