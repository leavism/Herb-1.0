const ccmd = require("../data/customcommands/ccommands.json");
const fs = require("fs");

exports.run = async (aclient, message, [action, command, ...value], level) => {
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
    } else
    if (action === "list") {
        return message.channel.send(Object.getOwnPropertyNames(ccmd).sort(), {code : "JSON"})
    } else {
        return message.channel.send(JSON.stringify(ccmd), {code: "json"});
    }
}

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ["cc", "customc", "ccommand"],
    permLevel: "Moderator"
};

exports.help = {
    name: "customcommand",
    category: "Server",
    description: "View or change custom commands.",
    usage: "customcommand <add/remove/edit> <command> <value>"
}