module.exports = (client, oldMessage, newMessage) => {

    const settings = oldMessage.guild
    ? client.settings.get(oldMessage.guild.id)
    : client.config.defaultSettings;

    if (oldMessage.author.bot) return;

    const modLogC = oldMessage.guild.channels.find("name", settings.modLogChannel);
    if(oldMessage.content.length >= 900 || newMessage.content.length >= 900){
        modLogC.send(`__${oldMessage.author} changed their old message:__`);
        modLogC.send(`${oldMessage.content}`);
        modLogC.send(`__To the new message:__`);
        modLogC.send(`${newMessage.content}`);
    } else {
        modLogC.send(`__${oldMessage.author} changed their old message:__\n\n` + 
                    `${oldMessage.content}\n\n`+
                    `__To the new message:__\n\n`+
                    `${newMessage.content}`);
    }
}