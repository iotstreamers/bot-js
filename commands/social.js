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

command.on("discord", (params, message) => {
    message.send("Discord IoT Streamers: https://discord.gg/Gk5e5Cx");
});

command.on("github", (params, message) => {
    message.send("Github IoT Streamers: https://github.com/iotstreamers");
});

command.on("source", (params, message) => {
    message.send("Confira o meu código fonte: https://github.com/iotstreamers/bot-js");
});

module.exports = {
    event: command
};