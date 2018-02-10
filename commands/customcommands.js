const ccmd = require("../data/customcommands/ccommands.json");
const fs = require("fs");

exports.run = async (client, message, args, level) => {
    const settings = message.guild
        ? client.settings.get(message.guild.id)
        : client.config.defaultSettings;

    return message.channel.send(`List of custom commands. To use them, precede each of the following terms with our command prefix.\n\n${settings.prefix}` + Object.getOwnPropertyNames(ccmd).sort().join(`\n${settings.prefix}`) + "\n\nTo get your own, buy it with Simbits from our Simbit store! Use the ``shop list`` command or ask an Admin for more details.", {code : "JSON"})
}

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ["cc"],
    permLevel: "User"
};

exports.help = {
    name: "customcommand",
    category: "Server",
    description: "View custom commands.",
    usage: "customcommand list"
}