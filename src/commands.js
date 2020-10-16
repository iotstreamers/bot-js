/**
 * @description Importaçao de blibiotecas
 * 
 * @requires simple-event-bus
 * 
 */
const EventBus = require('simple-event-bus');
const command = new EventBus();

/**
 * 
 *    ___ ___  __  __ __  __   _   _  _ ___  ___ 
 *   / __/ _ \|  \/  |  \/  | /_\ | \| |   \/ __|
 *  | (_| (_) | |\/| | |\/| |/ _ \| .` | |) \__ \
 *   \___\___/|_|  |_|_|  |_/_/ \_\_|\_|___/|___/
 * 
 * @description adicione aqui os seus comandos!                                          
 */

command.on("discord", (params, message) => {
    message.send("Discord dos IoT Streamers: https://discord.gg/Gk5e5Cx");
});

module.exports = command;