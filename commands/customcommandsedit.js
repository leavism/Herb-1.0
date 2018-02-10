const ccmd = require("../data/customcommands/ccommands.json");
const fs = require("fs");

exports.run = async (client, message, [action, command, ...value], level) => {
    if (action === "add"){
        ccmd[command] = value.join(" ");
        fs.writeFileSync("./data/customcommands/ccommands.json", JSON.stringify(ccmd), (err) => console.log(err));
        return message.channel.send(`New custom command ${command} has been set to:\n${ccmd[command]}`);
    } else
    if (action === "edit"){
        ccmd[command] = value.join(" ");
        fs.writeFileSync("./data/customcommands/ccommands.json", JSON.stringify(ccmd), (err) => console.log(err));
        return message.channel.send(`Custom command ${command} has now been set to:\n${ccmd[command]}`);
    } else
    if (action === "remove"){
        delete ccmd[command]
        fs.writeFileSync("./data/customcommands/ccommands.json", JSON.stringify(ccmd), (err) => console.log(err));
        return message.channel.send(`The ${command} custom command has been deleted.`);
    } else {
        const settings = message.guild
            ? client.settings.get(message.guild.id)
            : client.config.defaultSettings;

        return message.channel.send(`List of custom commands. To use them, precede each of the following terms with our command prefix.\n\n${settings.prefix}` + Object.getOwnPropertyNames(ccmd).sort().join(`\n${settings.prefix}`) + "\n\nTo get your own, buy it with Simbits from our Simbit store! Use the ``shop list`` command or ask an Admin for more details.", {code : "JSON"})
    }
}

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ["ce", "custome", "cce"],
    permLevel: "Moderator"
};

exports.help = {
    name: "customcommandsedit",
    category: "Server",
    description: "View or change custom commands.",
    usage: "customcommandedit <add/remove/edit> <command> <value>"
}