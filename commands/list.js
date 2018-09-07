exports.run = async (client, message, args) => {
    message.channel.send("BEVERS' LIST:\n ```\n1. JayDonks\n 2. Jrose\n 3. Moist Accident\n 4. Havoc\n 5. SpInFuZoR\n 6. PlsNoBuli```");
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
