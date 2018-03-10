module.exports = (client, message) => {

    const settings = message.guild
    ? client.settings.get(message.guild.id)
    : client.config.defaultSettings;

    if (message.author.bot) return;

    const modLogC = message.guild.channels.find("name", settings.modLogChannel);
    if(message.content.length >= 1900){
        modLogC.send(`${message.author} deleted their message:\n\n`)
        modLogC.send(`${message.content}`);
    } else {
        modLogC.send(`${message.author} deleted their message:\n\n ${message.content}`);
    }
}