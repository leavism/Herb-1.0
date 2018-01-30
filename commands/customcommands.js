const ccmd = require("../data/customcommands/ccommands.json");
const fs = require("fs");

exports.run = async (aclient, message, args, level) => {
    return message.channel.send(Object.getOwnPropertyNames(ccmd).sort(), {code : "JSON"})
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