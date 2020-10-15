/**
 * @description Importaçao de blibiotecas
 * 
 * @requires discord.js
 * @requires tmi.js
 * @requires fs (filesystem)
 * 
 */
const DiscordConnect = require('discord.js');
const tmi = require('tmi.js');
const fs = require('fs');

/**
 * @description Configurar Opções
 */
const configuration = JSON.parse(fs.readFileSync('config.json'));
const twitch = new tmi.client(configuration.twitch_options);
const discord = new DiscordConnect.Client();

/**
 * @description Eventos de carregamento
 */
discord.on('ready', () => {
    console.log(`Discord Ready!`);
    console.log(`Logged in as ${discord.user.tag}!`);
});

twitch.on("connected", () => {
    console.log(`Twitch Ready!`);
});

/**
 * @description Concetar nas apis
 * 
 * @api twitch
 * @api discord
 */
discord.login(configuration.bot_discord_token);
twitch.connect();