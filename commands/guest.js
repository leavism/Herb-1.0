exports.run = async(client, message, [member]) => {
    if(message.mentions.users.size < 1){
        return message.reply("Please specify who to recruit by mentioning them.");
    } else {
        member = message.mentions.members.first();
    }

    let guest = message.guild.roles.find('name', 'Guest');

    var msg = `You're now a guest of Simbad, ${member}! This grants access to some of our text and voice channels, so feel free to hang out and get to know `+
    `everyone. You can always request to become a full member at any time by contacting any of our leadership team! Welcome!`

    await member.addRoles([guest]).catch(err => { msg = `${member} already has those roles.`})
    message.channel.send(msg);
}

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: "Regular"
};

exports.help = {
    name: "guest",
    category: "Server",
    description: "Gives someone the Guest role.",
    usage: "?guest <mention Discord member>",
    example: ["?guest @Leavism#2011"]
};