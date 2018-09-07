exports.run = async (client, message, args) => {
    message.channel.send("BEVERS' LIST: ```\n1. JayDonks\n2. Jrose\n3. Moist Accident\n4. Havoc\n5. SpInFuZoR\n6. PlsNoBuli```");
}

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: "Bot Owner"
};

exports.help = {
    name: "list",
    category: "Server",
    description: "Bevers' list.",
    usage: "?list",
    example: ["?list"]
};
