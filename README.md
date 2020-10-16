Integration Bot
===============

## Utilização do Bot ##

### Instalação ###
baixe o arquivo ou clone o repositório, e execute o comando de instalar as depedencias de terceiros
```SHELL
npm install
```

### Configuração ###
crie um arquivo `config.json` na raiz do projeto com as seguintes configurações
```JSON
{
    "bot_discord_token": "",
    "twitch_options": {
        "identity": {
            "username": "",
            "password": ""
        },
        "channels": [
            "canal1",
            "...",
        ]
    }
}
```

### Utilização ###
para testar o comando em seu terminal para testar o bot
```SHELL
node index.js
```

## Criar novos comandos ##
edite o arquivo [`src/commands.js`](https://github.com/iotstreamers/discord-bot/blob/master/src/commands.js) e adicione novos comandos como o exemplo
```Javascript
command.on("ping", (params, message) => {
    message.send("!pong");
});
```