const ccmd = require("../data/shipbuilds/sbuilds.json");
const fs = require("fs");

exports.run = async (client, message, [action, command, ...value], level) => {
    if (action === "add"){
        if (command === undefined) return message.reply("Specify the invoking command without the prefix, and then the content of the response. For example ``?sbe add bestship Only the best for you https://gfycat.com/SnoopyHospitableAdder`` will add the shipbuild command ``?bestship`` and the response will be \"Only the best for you https://gfycat.com/SnoopyHospitableAdder\"");
        if (value.join().length < 1) return message.reply("Specify the response for your command. For example ``?sbe add bestship Only the best for you https://gfycat.com/SnoopyHospitableAdder`` will add the shipbuild command ``?bestship`` and the response will be \"Only the best for you https://gfycat.com/SnoopyHospitableAdder\"");
        ccmd[command] = value.join(" ");
        fs.writeFileSync("./data/shipbuilds/sbuilds.json", JSON.stringify(ccmd), (err) => console.log(err));
        return message.channel.send(`New shipbuild \`\`${command}\`\` has been set to:\n${ccmd[command]}`);
    } else
    if (action === "edit"){
        if (command === undefined) return message.reply("Specify the invoking command without the prefix, and then the content of the response. For example ``?sbe edit bestship Fly what you're comfortable with!`` will edit the shipbuild command ``?bestship`` and the response will be \"Fly what you're comfortable with!\"");
        if (ccmd[command] === undefined) return message.reply("That ship build does not exist!");
        if (value.join().length < 1) return message.reply("Specify the content of the response. For example ``?sbe edit bestship Fly what you're comfortable with!`` will edit the shipbuild command ``?bestship`` and the response will be \"Fly what you're comfortable with!\"");
        ccmd[command] = value.join(" ");
        fs.writeFileSync("./data/shipbuilds/sbuilds.json", JSON.stringify(ccmd), (err) => console.log(err));
        return message.channel.send(`Shipbuild \`\`${command}\`\` has now been set to:\n${ccmd[command]}`);
    } else
    if (action === "remove"){
        if (command === undefined) return message.reply("Specify which shipbuild you're trying to remove.");
        if (ccmd[command] === undefined) return message.reply("That ship build does not exist!");
        delete ccmd[command]
        fs.writeFileSync("./data/shipbuilds/sbuilds.json", JSON.stringify(ccmd), (err) => console.log(err));
        return message.channel.send(`The \`\`${command}\`\` shipbuild has been deleted.`);
    } else {
        message.channel.send("These are the commands to edit the ship builds.\n\nSubcommands:"+
        "\n\tadd\t\tAdd a new ship build command." +
        "\n\tedit\t   Edit an existing ship build command."+
        "\n\tremove\t Remove an existing ship build command.", {code: "md"})
    }
}

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ["se", "sbe"],
    permLevel: "Moderator"
};

exports.help = {
    name: "shipbuildsedit",
    category: "Server",
    description: "View or change shipbuilds.",
    usage: "shipbuildsedit <add/remove/edit> <command> <value>"
}