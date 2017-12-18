'use strict';
import BungieApi from '../api/bungieApi';
export default class Clan {
    constructor(member) {
        this.root = 'Destiny2';
        this.type = member.membership_type || 2;
        this.id   = member.destiny_member_id
    }

    get baseRoute() {
        return `${this.root}/${this.type}`;
    }

    async getProfile() {
        return await BungieApi.getAsync(this.baseRoute+`/Profile/${this.id}/?components=100`);
    }
}
