module.exports = (client, message) => {

    const settings = message.guild
    ? client.settings.get(message.guild.id)
    : client.config.defaultSettings;

    const modLogC = message.guild.channels.find("name", settings.modLogChannel);
    const adminRole = message.guild.roles.find("name", settings.adminRole);

    // Bot spamming filter
    if (message.author.bot) return;
    var muteRole = message.guild.roles.find("name","Mute");

    if(client.talkRecently.has(message.author.id)) {
        return modLogC.send(`${message.member.displayName} could be spamming in ${message.channel}.`)
    }
    client.talkRecently.add(message.author.id);
    setTimeout(() => {
        client.talkRecently.delete(message.author.id);
    }, 200);


    // Profanity filter
    var bannedWords = ["nigga", "nibba", "nigger", "gay", "gaylord", "fag", "faggot", "fgt", "gays", "niggas", "nigg", "fags", "faggots", "ni🇧 🇧a", "ni🅱🅱a", "ni🅱 🅱a", "ghey"]
    var words = message.content.replace(/[.,\/#!?$%\^&\*;:{}=\-_`~()]/g, "");

    words = words.toLowerCase();
    words = words.split(" ");

    for(var word of words){
        if((bannedWords.indexOf(word) > -1)){
            if(message.content.length >= 1900){
                modLogC.send(`${message.member.user.username}#${message.member.user.discriminator}sent in ${message.channel}(${message.createdAt}) the message:`);
                modLogC.send(message.content);
                modLogC.send(`Which contains "${word}".`);
            } else {
                modLogC.send(`${message.member.user.username}#${message.member.user.discriminator} sent in ${message.channel}(${message.createdAt}) the message:\n\n${message.content}\n\nWhich contains "${word}".`)
            }
        }
    }
}