/*
The HELP command is used to display every command's name and description
to the user, so that he may see what commands are available. The help
command is also filtered by level, so if a user does not have access to
a command, it is not shown to them. If a command name is given with the
help command, its extended help is shown.
*/
const Discord = require("discord.js");

exports.run = (client, message, args, level) => {
  // If no specific command is called, show all filtered commands.
  if (!args[0]) {
    // Load guild settings (for prefixes and eventually per-guild tweaks)
    const settings = message.guild ? client.settings.get(message.guild.id) : client.config.defaultSettings;

    // Filter all commands by which are available for the user's level, using the <Collection>.filter() method.
    const myCommands = message.guild ? client.commands.filter(cmd => client.levelCache[cmd.conf.permLevel] <= level) : client.commands.filter(cmd => client.levelCache[cmd.conf.permLevel] <= level &&  cmd.conf.guildOnly !== true);

    // Here we have to get the command names only, and we use that array to get the longest name.
    // This make the help commands "aligned" in the output.
    const commandNames = myCommands.keyArray();
    const longest = commandNames.reduce((long, str) => Math.max(long, str.length), 0);

    let currentCategory = "";
    let output = `**__Available commands__**\n`;

    const sorted = myCommands.array().sort((p, c) => p.help.category > c.help.category ? 1 :  p.help.name > c.help.name && p.help.category === c.help.category ? 1 : -1 );
    sorted.forEach( c => {
      const cat = c.help.category.toProperCase();
      if (currentCategory !== cat) {
        output += `\n__${cat}__\n`;
        currentCategory = cat;
      }
      output += `**${settings.prefix}${c.help.name}${" ".repeat(longest - c.help.name.length)}** : ${c.help.description}\n`;
      if(output.length >= 1900/2){
        message.channel.send(output);
        output = "";
      }
    });
    // if(output.length >= 1900){
    //   let splitFirst = output.substring(0,1900/2);
    //   let splitSecond = output.substring(1900/2 + 1, output.length)
    //   message.channel.send(splitFirst);
    //   return message.channel.send(splitSecond)
    // }
    message.channel.send(output);
  } else {
    const settings = message.guild ? client.settings.get(message.guild.id) : client.config.defaultSettings;

    // Show individual command's help.
    let command = args[0];
    if (client.commands.has(command)) {
      command = client.commands.get(command);
      if (level < client.levelCache[command.conf.permLevel]) return;
      if(command.conf.aliases.join(", ").length <= 0) {
        var aliases = "None"
      } else {
         aliases = `${settings.prefix}` + command.conf.aliases.join(`, ${settings.prefix}`)
      }
        const embed = new Discord.RichEmbed()
          .setTitle(`${settings.prefix}`+command.help.name)
          .setDescription(command.help.description)
          .addField("Aliases", aliases, true)
          .addField("Usage", command.help.usage, true)
          .addField("Example", '``'+ command.help.example.join('``\n``') + '``')
          .setColor(0x04ff70)

        message.channel.send({embed});
    }
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["h", "halp"],
  permLevel: "User"
};

exports.help = {
  name: "help",
  category: "System",
  description: "Displays all the available commands for your permission level.",
  usage: "help [command]",
  example: ["?help bot", "?help userinfo","?help rank"]
};
