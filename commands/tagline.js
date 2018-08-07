exports.run = async(client, message, [member]) => {
    if(message.mentions.users.size < 1){
        return message.reply("Who am I welcoming? Please mention them.");
    } else {
        member = message.mentions.members.first();
    }
    var msg = `Hello there ${member}! Welcome to Simbad! This is the welcome channel. I am your guide today. How may I be of assistance? https://giphy.com/gifs/mrw-top-escalator-Nx0rz3jtxtEre`
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