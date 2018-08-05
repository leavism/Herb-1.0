exports.run = async(client, message, [member]) => {
    if(message.mentions.users.size < 1){
        return message.reply("Please specify who to recruit by mentioning them.");
    } else {
        member = message.mentions.members.first();
    }

    const general = message.guild.channels.find("name", "general");
    let recruit = message.guild.roles.find('name', 'Recruit');
    let elite = message.guild.roles.find('name', 'Elite');
    let simbian = message.guild.roles.find('name', 'Simbian');

    var msg = `You're now a member of Simbad, ${member}! This grants access to our text and voice channels, so feel free to get to know `+
    `everyone. You've also been given the Recruit role, which indiciates you're a newer member. Once you've grown into our community, you can lose `+
    `the Recruit role and celebrate with dank memes. Our group's home system is Farowalan - Bamford City, come on down! Everyone, say hello!`

    await member.addRoles([recruit, elite, simbian]).catch(err => { msg = `${member} already has those roles. That's right, no more eternal recruits!`})
    message.channel.send("Great work! Our new recruit has been welcomed in #general")
    general.send(msg);
}

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: "Regular"
};

exports.help = {
    name: "recruit",
    category: "Server",
    description: "Gives someone the Recruit, Elite, and Simbian roles.",
    usage: "?recruit <mention Discord member>",
    example: ["?recruit @Leavism#2011"]
};