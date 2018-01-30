const ccmd = require("../data/shipbuilds/sbuilds.json");
const fs = require("fs");

exports.run = async (aclient, message, [action, command, ...value], level) => {
    return message.channel.send(Object.getOwnPropertyNames(ccmd).sort(), {code : "JSON"})
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