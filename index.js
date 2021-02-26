/**
 * @description Importaçao de blibiotecas e preparação de ambiente
 * 
 * @requires discord.js
 * @requires tmi.js
 * 
 */
require('dotenv').config()
const channels = process.env.TWITCH_CHANNELS.split(',');
const DiscordConnect = require('discord.js');
const commands = require('./src/commands.js');
const modcmds = require('./src/moderation.js');
const tmi = require('tmi.js');
const discord = {};
const twitch = {};

/**
 * @description Carregamento assicrono das API's
 */
discord.promise = new Promise(async (resolve) => {
    discord.client = new DiscordConnect.Client();
    resolve(console.log('[!] loading discord client...'));
});
twitch.promise = new Promise(async (resolve) => {
    twitch.client = new tmi.client({
        "twitch_options": {
            "identity": {
                "username": process.env.TWITCH_BOT_USERNAME,
                "password": process.env.TWITCH_OAUTH_TOKEN
            },
            "channels": channels.map((channel) => '#' + channel)
        }
    });
    resolve(console.log('[!] loading twitch options...'));
});


/**
 * @description Conexão com as APIS
 */
discord.promise.then(async () => {
    await discord.client.login(process.env.DISCORD_SECRET_TOKEN);
    console.log(`[!] discord connected!`);
});
twitch.promise.then(async () => {
    await twitch.client.connect();
    console.log(`[!] twitch connected!`);
});


/**
 * @description Quando alguem envia menssagem pela twitch
 * @see raw_message tem os dados brutos de qualquer evento de chat da live (messangem, highlight, host, raid)
 */
twitch.promise.then(async () => {
    console.log(`[!] creating twitch commands...`);
    twitch.client.on("raw_message", (messageCloned, message) => {
        // ignorar quando não for uma menssagem no chat ou comando
        if (message.command != "PRIVMSG" || message.params[1][0] != process.env.TWITCH_COMMAND_PREFIX) {
            return;
        }

        // preparar para executar comand
        let is_moderator = typeof(message.tags["badges"]) == 'string' && (message.tags["badges"].indexOf("moderator") != -1 || message.tags["badges"].indexOf("broadcaster") != -1);
        let channel = message.params[0];
        let params = message.params[1].slice(1).split(' ');
        let command = params.shift().toLowerCase(); 
        let author = message.tags['display-name'];

        // não possui permissão
        if (modcmds.handlersCount(command) && !is_moderator) {
            twitch.client.say(channel, `@${author}, Você não é um moderador!`);
            return;
        } 
        
        // executar comando
        commands.emit(command, params, {
            is_twitch: true,
            is_discord: false,
            is_moderator: is_moderator,
            reply: (text) => twitch.client.say(channel, `@${author}, ${text}`),
            send: (text) => twitch.client.say(channel, text),
            channels: channels
        });
        
        // executar comando administrativo
        modcmds.emit(command, params, {
            is_twitch: true,
            is_discord: false,
            is_moderator: is_moderator,
            reply: (text) => twitch.client.say(channel, `@${author}, ${text}`),
            send: (text) => twitch.client.say(channel, text),
            channels: channels
        });
    });
});

/**
 * @description Quando alguem envia menssagem pelo discord
 * @see message retorna objeto com api do discord para responder a menssagem
 */
discord.promise.then(async () => {
    console.log(`[!] creating discord commands...`);
    discord.client.on('message', (message) => {
        // ignorar quando não for um comando
        if (message.content[0] != process.env.DISCORD_COMMAND_PREFIX) {
            return;
        }

        // preparar para executar comandos
        let is_moderator = message.member.roles.cache.has("763399481332334683");
        let params = message.content.slice(1).split(' ');
        let command = params.shift().toLowerCase(); 

        // não possui permissão
        if (modcmds.handlersCount(command) && !is_moderator) {
            message.reply("Você não é um moderador!");
            return;
        } 

        // executar comando
        commands.emit(command, params, {
            is_twitch: false,
            is_discord: true,
            is_moderator: is_moderator,
            reply: (text) => message.reply(text),
            send: (text) => message.channel.send(text),
            channels: channels
        });

        // executar comando administrativo
        modcmds.emit(command, params, {
            is_twitch: false,
            is_discord: true,
            is_moderator: is_moderator,
            reply: (text) => message.reply(text),
            send: (text) => message.channel.send(text),
            channels: channels
        });
    });
});