import Discord from 'discord.js';
import dotenv from 'dotenv';
import App from './src/app';
import Tasks from './src/tasks';

const env    = dotenv.config();
const client = new Discord.Client();
const app    = new App();

client.on('ready', () => {
    console.log('ready');
});

client.on('message', message => {
    app.process(message);    
});

Tasks.begin();

client.login(env.parsed.BOT_TOKEN);