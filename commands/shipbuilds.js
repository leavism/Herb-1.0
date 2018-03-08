const ccmd = require("../data/shipbuilds/sbuilds.json");
const fs = require("fs");

exports.run = async (client, message, [action, command, ...value], level) => {
    const settings = message.guild
        ? client.settings.get(message.guild.id)
        : client.config.defaultSettings;

        return message.channel.send(`List of custom commands. Mods and Admins looking to add/edit/remove shipbuilds, use ${settings.prefix}cce\n\n${settings.prefix}` + Object.getOwnPropertyNames(ccmd).sort().join(`\n${settings.prefix}`) + "\n\nIf you would like to add your own or suggest an improvement, let an Admin or Moderator know!", {code : ""})
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