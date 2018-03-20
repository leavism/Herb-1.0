const Discord = require("discord.js");

module.exports = (client, message) => {

    if(!message.guild) return;

    const settings = message.guild
    ? client.settings.get(message.guild.id)
    : client.config.defaultSettings;

    const modLogC = message.guild.channels.find("name", settings.modLogChannel);


    if (message.author.bot) return;
    // Quick message filter (0.02 seconds)
    if(client.talkRecently.has(message.author.id)) {
        client.spamTalk.add(message.author.id)
    }
    client.talkRecently.add(message.author.id);
    setTimeout(() => {
        client.talkRecently.delete(message.author.id);
    }, 200);
    if(client.spamTalk.has(message.author.id)){
        modLogC.send(`${message.member.displayName} could be spamming in ${message.channel}. **Be aware I don't consider the conversation context.**.\nCase: Sending consecutive messages within 0.02 seconds.`)
    }
    setTimeout(() => {
        client.spamTalk.delete(message.author.id)
    }, 60000)

    //Repeated content filter
    let counter = 0;
    message.channel.fetchMessages({limit: 4})
        .then(messages => {
            messages.some(function(msg) {
                if (msg.content === message.content && msg.id !== message.id && msg.member.id === message.member.id ) {
                    counter++;
                }
                if(counter >= 2){
                    return modLogC.send(`${message.member.displayName}#${message.member.user.discriminator} could be spamming in ${message.channel}. **Be aware I don't consider the conversation context.**\nCase: Sending repetitive content.`);
                }
            })
        })

    // Profanity filter
    var bannedWords = ["nigga", "nibba", "nigger", "gay", "gaylord", "fag", "faggot", "fgt", "gays", "niggas", "nigg", "fags", "faggots", "ni🇧 🇧a", "ni🅱🅱a", "ni🅱 🅱a", "ghey", "autism", "autistic", "autist"]
    var words = message.content.replace(/[.,\/#!?$%\^&\*;:{}=\-_`~()]/g, "");

    words = words.toLowerCase();
    words = words.split(" ");

    for(var word of words){
        if((bannedWords.indexOf(word) > -1)){
            if(message.content.length >= 1900){
                modLogC.send(`${message.member.user.username}#${message.member.user.discriminator}sent in ${message.channel}(${message.createdAt}) the message:`);
                modLogC.send(message.content);
                modLogC.send(`Which contains "${word}".\nThis is just an alert and does not take into account the context.`);
            } else {
                modLogC.send(`${message.member.user.username}#${message.member.user.discriminator} sent in ${message.channel}(${message.createdAt}) the message:\n\n${message.content}\n\nWhich contains "${word}".\nThis is just an alert and does not take into account the context.`)
            }
        }
    }
}