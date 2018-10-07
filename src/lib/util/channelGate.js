const RECORD = {};
const HOUR_DIFF = 3600000;

export default class ChannelGate {
    async handle(message, isStaff) {
        const {channel, createdAt, member} = message;

        if (RECORD[member.id] === undefined || isStaff === true) {
            RECORD[member.id] = createdAt.getTime();

            if (isStaff) {
                console.log('Yes hello there pal')
            }
        } else {
            const lastMessage = RECORD[member.id];
            const curMessage  = createdAt.getTime();
            const diff        = Math.abs(curMessage - lastMessage) / HOUR_DIFF;

            if (diff < 24) {
                return await message.delete();
            } else {
                record[member.id] = curMessage;
            }
        }
    }
}