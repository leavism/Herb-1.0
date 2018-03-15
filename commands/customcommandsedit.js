const ccmd = require("../data/customcommands/ccommands.json");
const fs = require("fs");

exports.run = async (client, message, [action, command, ...value], level) => {
    if (action === "add"){
        if (command === undefined) return message.reply("Specify the invoking command without the prefix, and then the content of the response. For example ``?cce add sam My name is Sam Pole`` will add the custom command ``?sam`` and the response will be \"My name is Sam Pole\"");
        if (value.join().length < 1) return message.reply("Specify the response for your command. For example ``?cce add sam My name is Sam Pole`` will add the custom command ``?sam`` and the response will be \"My name is Sam Pole\"");
        ccmd[command] = value.join(" ");
        fs.writeFileSync("./data/customcommands/ccommands.json", JSON.stringify(ccmd), (err) => console.log(err));
        return message.channel.send(`New custom command ${command} has been set to:\n${ccmd[command]}`);
    } else
    if (action === "edit"){
        if (command === undefined) return message.reply("Specify which command you'd like to edit, then the new content for its response. For example ``?cce edit sam That was such a bad pun`` will change the response for the ``?sam?`` to \"That was such a bad pun\"");
        if (ccmd[command] === undefined) return message.reply("That custom command does not exist!");
        if (value.join().length < 1) return message.reply("Specify the new response for your command. For example ``?cce edit sam That was such a bad pun`` will add the custom command ``?sam`` and the response will be \"That was such a bad pun\"");
        ccmd[command] = value.join(" ");
        fs.writeFileSync("./data/customcommands/ccommands.json", JSON.stringify(ccmd), (err) => console.log(err));
        return message.channel.send(`Custom command ${command} has now been set to:\n${ccmd[command]}`);
    } else
    if (action === "remove"){
        if (ccmd[command] === undefined) return message.reply("That custom command does not exist!");
        if (command === undefined) return message.reply("Specify which command you'd like to remove. For example ``?cce remove ree`` will remove the ``?ree`` custom command.");
        delete ccmd[command]
        fs.writeFileSync("./data/customcommands/ccommands.json", JSON.stringify(ccmd), (err) => console.log(err));
        return message.channel.send(`The ${command} custom command has been deleted.`);
    } else {
        message.channel.send("These are the commands to edit the custom commands.\n\nSubcommands:"+
        "\n\tadd\t\tAdd a new custom command." +
        "\n\tedit\t   Edit an existing custom command."+
        "\n\tremove\t Remove an existing custom command.", {code: "md"})
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
    usage: "customcommandedit <add/remove/edit> <command> <content>",
    example: ["?cce add greet Hello there!", "?cce remove greet", "?cce edit greet Heyo, what's up?"]
}