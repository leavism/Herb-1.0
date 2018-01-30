const ccmd = require("../data/shipbuilds/sbuilds.json");
const fs = require("fs");

exports.run = async (aclient, message, [action, command, ...value], level) => {
    if (action === "add"){
        ccmd[command] = value.join(" ");
        fs.writeFileSync("./data/shipbuilds/sbuilds.json", JSON.stringify(ccmd), (err) => console.log(err));
        return message.channel.send(`New custom command ${command} has been set to:\n${ccmd[command]}`);
    } else
    if (action === "edit"){
        ccmd[command] = value.join(" ");
        fs.writeFileSync("./data/shipbuilds/sbuilds.json", JSON.stringify(ccmd), (err) => console.log(err));
        return message.channel.send(`Custom command ${command} has now been set to:\n${ccmd[command]}`);
    } else
    if (action === "remove"){
        delete ccmd[command]
        fs.writeFileSync("./data/shipbuilds/sbuilds.json", JSON.stringify(ccmd), (err) => console.log(err));
        return message.channel.send(`The ${command} custom command has been deleted.`);
    } else {
        return message.channel.send(Object.getOwnPropertyNames(ccmd).sort(), {code : "JSON"})
    }
}

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ["sb"],
    permLevel: "Moderator"
};

exports.help = {
    name: "shipbuilds",
    category: "Server",
    description: "View or change shipbuilds.",
    usage: "shipbuilds <add/remove/edit> <command> <value>"
}