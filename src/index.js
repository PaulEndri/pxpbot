import Discord from 'discord.js';
import dotenv from 'dotenv';
import App from './app';
import Tasks from './tasks';

const env    = dotenv.config();
const client = new Discord.Client();
const app    = new App(client, env);

client.on('ready', () => {
    console.log('ready');
});

client.on('message', message => {
    app.process(message);    
});

Tasks.begin(client, env);

client.login(env.parsed.BOT_TOKEN);