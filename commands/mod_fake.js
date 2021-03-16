/**
 *    ___ ___  __  __ __  __   _   _  _ ___  ___ 
 *   / __/ _ \|  \/  |  \/  | /_\ | \| |   \/ __|
 *  | (_| (_) | |\/| | |\/| |/ _ \| .` | |) \__ \
 *   \___\___/|_|  |_|_|  |_/_/ \_\_|\_|___/|___/
 * 
 * @requires simple-event-bus
 * @requires dotenv
 * 
 * @wiki https://github.com/iotstreamers/bot-js#criar-novos-comandos
 */
require('dotenv').config();
const EventBus = require('simple-event-bus');
const command = new EventBus();

command.on("to", (params, message) => {
    if (!params[0] || !params[1]) {
        return message.reply("parametros: [usuario] [tempo] (motivo)")
    }

    const motivo = params[2]? params.slice(2).join(' '): 'nenhum';
    const tempo = params[1];
    const user = params[0];

    return message.warn(`${user} foi mutado por ${tempo}, motivo: ${motivo}.`);
});

command.on("ban", (params, message) => {
    if (!params[0]) {
        return message.reply("parametros: [usuario] (motivo)")
    }
    
    const motivo = params[1]? params.slice(1).join(' '): 'nenhum';
    const user = params[0];

    if (message.is_twitch) {
        message.send(`/timeout ${user} 1`);
    }

    return message.warn(`${user} foi banido permanentemente, motivo: ${motivo}.`);
});

module.exports = {
    twitch_tags: [process.env.TWITCH_TAG_STAFF, process.env.TWITCH_TAG_BROADCAST],
    discord_roles: [process.env.DISCORD_ROLE_STAFF, process.env.DISCORD_ROLE_BROADCAST],
    event: command
};