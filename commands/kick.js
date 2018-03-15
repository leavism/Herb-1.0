exports.run = async(client, message, [member]) => {
    
    if(client.kickUse.has(message.author.id)){
        return message.reply("You can only kick one person every 6 hours. Please get a hold of an Admin to manually ban.")
    }
    
    if(message.mentions.users.size < 1){
        return message.reply("Please specify who to kick by mentioning them.");
    } else {
        member = message.mentions.members.first();
    }

    member.kick()
        .then(
            () => message.channel.send(`${member.displayName} has been kicked.`)
        )
        .catch(
            (error) => message.reply(`You couldn't kick ${member.displayName} because: ${error}`)
        )

    client.kickUse.add(message.author.id);
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
    name: "kick",
    category: "Moderation",
    description: "Kicks someone",
    usage: "kick <mention Discord member>",
    example: ["?kick @Leavism#2011", "?kick @Sam Pole#6969"]
};