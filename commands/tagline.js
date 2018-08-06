exports.run = async(client, message, [member]) => {
    if(message.mentions.users.size < 1){
        return message.reply("Please specify who to recruit by mentioning them.");
    } else {
        member = message.mentions.members.first();
    }

    general.send(msg);
    var msg = `Hello there ${member}! Welcome to Simbad! This is the welcome channel. I am Bevers, your guide today. How may I be of assistance? https://giphy.com/gifs/mrw-top-escalator-Nx0rz3jtxtEre`
    message.channel.send(msg)
}

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: "Regular"
};

exports.help = {
    name: "welcome",
    category: "Server",
    description: "Says hello to someone",
    usage: "?welcome <user>",
    example: ["?welcome @Bevers222#2642"]
};