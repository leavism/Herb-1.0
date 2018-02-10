const ccmd = require("../data/shipbuilds/sbuilds.json");
const fs = require("fs");

exports.run = async (client, message, [action, command, ...value], level) => {
    const settings = message.guild
        ? client.settings.get(message.guild.id)
        : client.config.defaultSettings;

    return message.channel.send(`List of shipbuilds.\n\n${settings.prefix}`+ Object.getOwnPropertyNames(ccmd).sort().join(`\n${settings.prefix}`), {code : "JSON"})
}

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ["sb"],
    permLevel: "User"
};

exports.help = {
    name: "shipbuilds",
    category: "Server",
    description: "View shipbuilds.",
    usage: "shipbuilds"
}