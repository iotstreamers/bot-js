/**
 * @description Importaçao de blibiotecas
 * 
 * @requires discord.js
 * @requires tmi.js
 * @requires fs (filesystem)
 * 
 */
const DiscordConnect = require('discord.js');
const commands = require('./src/commands.js');
const modcmds = require('./src/moderation.js');
const tmi = require('tmi.js');
const fs = require('fs');

/**
 * @description Configurar Opções
 */
const configuration = JSON.parse(fs.readFileSync('config.json'));
const twitch = new tmi.client(configuration.twitch_options);
const discord = new DiscordConnect.Client();

/**
 * @description Conexão com as APIS
 */
twitch.connect();

twitch.on("connected", () => {
    console.log(`Twitch Ready!`);
    discord.login(configuration.bot_discord_token);   
});

discord.on('ready', () => {
    console.log(`Discord Ready!`);
});

/**
 * @description Quando alguem envia menssagem pela twitch
 * @see raw_message tem os dados brutos de qualquer evento de chat da live (messangem, highlight, host, raid)
 */
twitch.on("raw_message", (messageCloned, message) => {
    // ignorar quando não for uma menssagem no chat ou comando
    if (message.command != "PRIVMSG" || message.params[1][0] != "!") {
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
        twitch.say(channel, `@${author}, Você não é um moderador!`);
        return;
    } 
    
    // executar comando
    commands.emit(command, params, {
        is_twitch: true,
        is_discord: false,
        is_moderator: is_moderator,
        reply: (text) => twitch.say(channel, `@${author}, ${text}`),
        send: (text) => twitch.say(channel, text),
        channels: configuration.twitch_options.channels.map((channel) => channel.slice(1))
    });
    
    // executar comando administrativo
    modcmds.emit(command, params, {
        is_twitch: true,
        is_discord: false,
        is_moderator: is_moderator,
        reply: (text) => twitch.say(channel, `@${author}, ${text}`),
        send: (text) => twitch.say(channel, text),
        channels: configuration.twitch_options.channels.map((channel) => channel.slice(1))
    });
});

/**
 * @description Quando alguem envia menssagem pelo discord
 * @see message retorna objeto com api do discord para responder a menssagem
 */
discord.on('message', (message) => {
    // ignorar quando não for um comando
    if (message.content[0] != "!") {
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
        channels: configuration.twitch_options.channels.map((channel) => channel.slice(1))
    });

    // executar comando administrativo
    modcmds.emit(command, params, {
        is_twitch: false,
        is_discord: true,
        is_moderator: is_moderator,
        reply: (text) => message.reply(text),
        send: (text) => message.channel.send(text),
        channels: configuration.twitch_options.channels.map((channel) => channel.slice(1))
    });
});