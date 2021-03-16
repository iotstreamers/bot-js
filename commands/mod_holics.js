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

command.on("sh-iot", (params, message) => {
    message.reply("Vamos divulgar a galera!");
    for (const channel of message.channels) {
        message.send(message.is_discord?`https://twitch.tv/${channel}`: `!sh-so @${channel}`);
    }
});

module.exports = {
    twitch_tags: [process.env.TWITCH_TAG_STAFF, process.env.TWITCH_TAG_BROADCAST],
    discord_roles: [process.env.DISCORD_ROLE_STAFF, process.env.DISCORD_ROLE_BROADCAST],
    event: command
};