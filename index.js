import Discord from 'discord.js';
import dotenv from 'dotenv';
import App from './src/app';
const env = dotenv.config();
const client = new Discord.Client();

client.on('ready', () => {
    console.log('ready');
});

client.on('message', message => {
    App.process(message);    
});

App.beginTasks();

client.login(env.parsed.BOT_TOKEN);