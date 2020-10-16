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
 *   
 * @argument params (Array de Strings) contendo parametros após o comando
 * @argument message (Objeto)
 * 
 * @example message.send("sua mensagem") é utilizado para responder o comando
 * @example message.is_discord ou message.is_twitch pode ser utilizado para identificar local
 *
 */

command.on("discord", (params, message) => {
    message.send("Discord IoT Streamers: https://discord.gg/Gk5e5Cx");
});

command.on("github", (params, message) => {
    message.send("Github IoT Streamers: https://github.com/iotstreamers");
});

command.on("source", (params, message) => {
    message.send("Confira o meu código fonte: https://github.com/iotstreamers/discord-bot");
});

module.exports = command;