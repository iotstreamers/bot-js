/**
 * @description Importaçao de blibiotecas
 * 
 * @requires simple-event-bus
 * 
 */
const EventBus = require('simple-event-bus');
const command = new EventBus();

/**
 *    ___ ___  __  __ __  __   _   _  _ ___  ___ 
 *   / __/ _ \|  \/  |  \/  | /_\ | \| |   \/ __|
 *  | (_| (_) | |\/| | |\/| |/ _ \| .` | |) \__ \
 *   \___\___/|_|  |_|_|  |_/_/ \_\_|\_|___/|___/
 * 
 * @see commands.js
 * @description adicione aqui os seus comandos administrativos!
 */

command.on("sh-iot", (params, message) => {
    message.reply("Vamos divulgar a galera!");

    for (const index in message.channels) {
        if (message.is_discord) {
            message.send(`https://twitch.tv/${message.channels[index]}`);
        }
        else if(message.is_twitch) {
            message.send(`!sh-so ${message.channels[index]}`);
        }
    }
});

module.exports = command;