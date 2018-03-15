exports.run = async(client, message, [member]) => {
    
    if(client.banUse.has(message.author.id)){
        return message.reply("You can only ban one person every 6 hours. Please get a hold of an Admin to manually ban.")
    }
    
    if(message.mentions.users.size < 1){
        return message.reply("Please specify who to recruit by mentioning them.");
    } else {
        member = message.mentions.members.first();
    }

    member.ban(7)
        .then( () => message.channel.send(`${member.displayName} has been banned. Messages sent within the last 7 days has been deleted.`))
        .catch( (error) => message.reply(`You can't ban ${member.displayName} because: ${error}`));

    client.banUse.add(message.author.id);
    setTimeout(() => {
        client.banUse.delete(message.author.id);
    }, 21600000)
}

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: "Moderator"
};

exports.help = {
    name: "ban",
    category: "Moderation",
    description: "Bans someone",
    usage: "ban <mention Discord user>",
    example: ["?ban @Leavism#2011","?ban @Sam Pole#6969"]
};