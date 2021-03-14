/**
 * @description Importaçao de blibiotecas e preparação de ambiente
 * 
 * @requires discord.js
 * @requires tmi.js
 * @requires dotenv
 * @requires fs
 */
require('dotenv').config()
const channels = process.env.TWITCH_CHANNELS.split(',');
const DiscordConnect = require('discord.js');
const express = require('express')
const tmi = require('tmi.js');
const fs = require('fs');
const discord = {};
const twitch = {};

/**
 * @description Startup message
 */
console.log(fs.readFileSync('startup.txt', 'utf8').toString());

/**
 * @description Carregamento assicrono das API's
 */
delete new Promise(async (resolve) => {
    const api = express()
    // não instanciar endpoint de status
    if (typeof(process.env.COMMON_API_PORT) == 'undefined') {
        resolve(console.log(' > api status offline'));
        return;
    }
    
    // estado de funcionamento
    api.get('/', (req, res) => {
        res.send('ok');
    });

    // acesso para api
    api.listen(process.env.COMMON_API_PORT, () => {
        resolve(console.log(' > api status online'));
    });
});
discord.promise = new Promise(async (resolve) => {
    discord.client = new DiscordConnect.Client();
    resolve(console.log(' > loading discord client'));
});
twitch.promise = new Promise(async (resolve) => {
    twitch.client = new tmi.client({
        // authentication
        identity: {
            username: process.env.TWITCH_BOT_USERNAME,
            password: process.env.TWITCH_OAUTH_TOKEN
        },
        // protect channels array
        channels: [...channels] 
    });
    resolve(console.log(' > loading twitch options'));
});


/**
 * @description Conexão com as APIS
 */
discord.promise.then(async () => {
    await discord.client.login(process.env.DISCORD_SECRET_TOKEN);
    console.log(` > discord connected.`);
});
twitch.promise.then(async () => {
    await twitch.client.connect();
    console.log(` > twitch connected.`);
});


/**
 * @description Adicionar comandos no discord
 */
discord.promise.then(async () => {
    console.log(' > add discord commands');
    const commands = [];

    /**
     * Leitura de comandos disponivéis
     */
     await fs.readdirSync('./commands').forEach(file => {
        var command = require(`./commands/${file}`);
        commands.push({
            permit: typeof (command.discord_roles) != 'undefined'? command.discord_roles: [],
            event: command.event
        });
    });

    discord.client.on('message', (message) => {
        // ignorar quando não for um comando
        if (message.content[0] != process.env.DISCORD_COMMAND_PREFIX) {
            return;
        }

        // preparar para executar comandos
        let params = message.content.slice(1).split(' ');
        let cmdtext = params.shift().toLowerCase(); 

        // buscar pelo commando
        commands.forEach((command) => {
            // verificar pelas permissões
            if (command.event.handlersCount(cmdtext) && command.permit.length) {
                if(!command.permit.find(tag => (message.member.roles.cache.has(tag)))) {
                    message.reply(`Você não tem permissão para executar esse comando!`);
                    return;
                }
            }

            // efetuar commando
            command.event.emit(cmdtext, params, {
                is_twitch: false,
                is_discord: true,
                reply: (text) => message.reply(text),
                send: (text) => message.channel.send(text),
                channels: channels
            });
        });
    });
});

/**
 * @description Adicionar comandos na twitch
 */
twitch.promise.then(async () => {
    console.log(' > add twitch commands');
    const commands = [];

    /**
     * Leitura de comandos disponivéis
     */
    await fs.readdirSync('./commands').forEach(file => {
        var command = require(`./commands/${file}`);
        commands.push({
            permit: typeof (command.twitch_tags) != 'undefined'? command.twitch_tags: [],
            event: command.event
        });
    });

    /**
     * @see raw_message É chamado quando qualquer event ocorre na twitch e possui dados brutos das mensagens
     */
    await twitch.client.on("raw_message", (messageCloned, message) => {
        // ignorar quando não for uma menssagem no chat ou comando
        if (message.command != "PRIVMSG" || message.params[1][0] != process.env.TWITCH_COMMAND_PREFIX) {
            return;
        }
    
        // preparar para executar comando
        let channel = message.params[0];
        let params = message.params[1].slice(1).split(' ');
        let cmdtext = params.shift().toLowerCase(); 
        let author = message.tags['display-name'];

        // buscar pelo commando
        commands.forEach((command) => {
            // verificar pelas permissões
            if (command.event.handlersCount(cmdtext) && command.permit.length) {
                // não possui nenhuma tag
                if(typeof(message.tags["badges"]) != 'string'){
                    twitch.client.say(channel, `@${author}, Você não tem permissão para executar esse comando!`);
                    return;
                }
                
                // se possui tag necessária
                if(!command.permit.find(tag => (message.tags["badges"].includes(tag)))) {
                    twitch.client.say(channel, `@${author}, Você não tem permissão para executar esse comando!`);
                    return;
                }
            }

            // efetuar commando
            command.event.emit(cmdtext, params, {
                is_twitch: true,
                is_discord: false,
                reply: (text) => twitch.client.say(channel, `@${author}, ${text}`),
                send: (text) => twitch.client.say(channel, text),
                channels: channels
            });
        });
    });
});