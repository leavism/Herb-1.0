module.exports = (client, message) => {

    const settings = message.guild
    ? client.settings.get(message.guild.id)
    : client.config.defaultSettings;

    const modLogC = message.guild.channels.find("name", settings.modLogChannel);
    const adminRole = message.guild.roles.find("name", settings.adminRole);

    // Spam and SelfBott Monitoring
    if (message.author.bot) return;
    var muteRole = message.guild.roles.find("name","Mute");

    // if(message.embeds.length != 0) {
    //     message.member.roles.forEach(r => {
    //         message.member.removeRole(r).catch(console.error);
    //     })
    //     message.member.addRole(muteRole);
    //     modLogC.send(`${adminRole}\n${message.member} has been muted for potentially self-botting.`)
    //     return message.channel.send(`${message.member} has been muted for potentially self-botting.`);
    // }

    if(client.talkRecently.has(message.author.id)) {
        message.member.roles.forEach(r => {
            message.member.removeRole(r).catch(console.error);
        })
        message.member.addRole(muteRole);
        modLogC.send(`${adminRole}\n${message.member} has been muted for potential spam.`)
        return message.channel.send(`${message.member} has been muted for potential spam.`);
    }
    client.talkRecently.add(message.author.id);
    setTimeout(() => {
        client.talkRecently.delete(message.author.id);
    }, 200);

    var bannedWords = ["nigga", "nibba", "nigger", "gay", "gaylord", "fag", "faggot", "gays", "niggas", "nigg", "fags", "faggots", "ni🇧 🇧a", "ni🅱🅱a", "ni🅱 🅱a"]
    var words = message.content.replace(/[.,\/#!?$%\^&\*;:{}=\-_`~()]/g, "");
    words = words.split(" ");

    for(var word of words){
        if((bannedWords.indexOf(word) > -1)){
            if(message.content.length >= 1900){
                modLogC.send(`${message.author} sent in ${message.channel}(${message.createdAt}) the message:`);
                modLogC.send(message.content);
                modLogC.send(`Which contains "${word}".`);
            } else {
                modLogC.send(`${message.author} sent in ${message.channel}(${message.createdAt}) the message:\n\n${message.content}\n\nWhich contains "${word}".`)
            }
        }
    }
}