/*
The HELP command is used to display every command's name and description
to the user, so that he may see what commands are available. The help
command is also filtered by level, so if a user does not have access to
a command, it is not shown to them. If a command name is given with the
help command, its extended help is shown.
*/

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
    let output = `To run a command in Simbad, use \`\`${settings.prefix}<command>\`\`.` +
    `\nFor example, \`\`${settings.prefix}ping\`\` will run the ping command.` +
    `\n\nUse \`\`help <command>\`\` to view more information about a specific command.` +
    `\n\n**__Available commands__**\n`;

    const sorted = myCommands.array().sort((p, c) => p.help.category > c.help.category ? 1 :  p.help.name > c.help.name && p.help.category === c.help.category ? 1 : -1 );
    sorted.forEach( c => {
      const cat = c.help.category.toProperCase();
      if (currentCategory !== cat) {
        output += `\n__${cat}__\n`;
        currentCategory = cat;
      }
      output += `**${settings.prefix}${c.help.name}${" ".repeat(longest - c.help.name.length)}** : ${c.help.description}\n`;
    });
    message.channel.send(output);
  } else {
    // Show individual command's help.
    let command = args[0];
    if (client.commands.has(command)) {
      command = client.commands.get(command);
      if (level < client.levelCache[command.conf.permLevel]) return;
      message.channel.send(`**__${command.help.name}__** \n${command.help.description}\n**Usage:** ${command.help.usage}\n**Aliases:** ${command.conf.aliases.join(", ")}`);
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
  usage: "help [command]"
};
