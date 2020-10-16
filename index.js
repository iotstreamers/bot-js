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
    if (message.command != "PRIVMSG" || message.params[0][0] != "!") {
        return;
    }

    // preparar para executar comandos
    let is_highlight = message.tags["msg-id"] == 'highlighted-message';
    let channel = message.params[0];
    let params = message.params[1].slice(1).split(' ');
    let command = params.shift().toLowerCase(); 
    
    // chamar evento
    commands.emit(command, params, {
        is_twitch: true,
        is_discord: false,
        send: (text) => {
            twitch.say (channel, text);
        }
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
    let params = message.content.slice(1).split(' ');
    let command = params.shift().toLowerCase(); 

    // chamar evento
    commands.emit(command, params, {
        is_twitch: false,
        is_discord: true,
        send: (text) => {
            message.reply(text);
        }
    });
});