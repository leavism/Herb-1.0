// The MESSAGE event runs anytime a message is received
// Note that due to the binding of client to every event, every event
// goes `client, other, args` when this function is run.

module.exports = (client, message) => {
  // It's good practice to ignore other bots. This also makes your bot ignore itself
  // and not get into a spam loop (we call that "botception").
  if (message.author.bot) return;

  // Grab the settings for this server from the PersistentCollection
  // If there is no guild, get default conf (DMs)
  const settings = message.guild
    ? client.settings.get(message.guild.id)
    : client.config.defaultSettings;

  // For ease of use in commands and functions, we'll attach the settings
  // to the message object, so `message.settings` is accessible.
  message.settings = settings;

  // Also good practice to ignore any message that does not start with our prefix,
  // which is set in the configuration file.
  if (message.content.indexOf(settings.prefix) !== 0) return;

  // Command cooldown, adds the user to the set so that they can't talk for 2.5 seconds
  if (client.talkedRecently.has(message.author.id)){
    return message.reply("Woah there buddy. Lets not spam the bot.");
  }
  client.talkedRecently.add(message.author.id);
  setTimeout(() => {
    // Removes the user from the set after 1.5 seconds
    client.talkedRecently.delete(message.author.id);
  }, 1500);

  // Here we separate our "command" name, and our "arguments" for the command.
  // e.g. if we have the message "+say Is this the real life?" , we'll get the following:
  // command = say
  // args = ["Is", "this", "the", "real", "life?"]
  const args = message.content.slice(settings.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  // Get the user or member's permission level from the elevation
  const level = client.permlevel(message);

  // Check whether the command, or alias, exist in the collections defined
  // in app.js.
  const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));
  const ccmd = require("../data/customcommands/ccommands.json");
  // using this const varName = thing OR otherthign; is a pretty efficient
  // and clean way to grab one of 2 values!
  // console.log(ccmd[`${command}`])
  if (!cmd && !ccmd[`${command}`]) {
    return
  } else if (!cmd && ccmd[`${command}`]) {
    message.channel.send(`${ccmd[`${command}`]}`)
    try {
      return message.guild.channels.find('name', 'mod-log').send({embed : {
        title: "Custom Command",
        description: `${message.member} used a custom command at ${message.createdAt}.`,
        fields: [
          {
            name: "Custom Command",
            inline: true,
            value: `${command}`
          },
          {
            name: "Invoker",
            inline: true,
            value: `${message.author.tag}(${message.author.id})`
          },
          {
            name: "Destination",
            inline: true,
            value: `${message.channel}`
          }
        ]
      }})
    } catch (e) {
      return client.logger.cmd(`[CCMD] ${client.config.permLevels.find(l => l.level === level).name} ${message.author.username} (${message.author.id}) ran custom command command ${command}`);
    }
  }
  // Some commands may not be useable in DMs. This check prevents those commands from running
  // and return a friendly error message.
  if (cmd && !message.guild && cmd.conf.guildOnly)
    return message.channel.send("This command is unavailable via private message. Please run this command in a guild.");

  if (level < client.levelCache[cmd.conf.permLevel]) {
    if (settings.systemNotice === "true") {
      message.channel.send(`You do not have permission to use this command.
  Your permission level is ${level} (${client.config.permLevels.find(l => l.level === level).name})
  This command requires level ${client.levelCache[cmd.conf.permLevel]} (${cmd.conf.permLevel})`);
      try {
        return message.guild.channels.find('name', 'mod-log').send({embed : {
          title: "Command Attempt",
          description: `${message.member} attempted a command but failed due to lack of permissions at ${message.createdAt}.`,
          fields: [
            {
              name: "Command",
              inline: true,
              value: `${cmd.help.name}`
            },
            {
              name: "Invoker",
              inline: true,
              value: `${message.author.tag}(${message.author.id})`
            },
            {
              name: "Destination",
              inline: true,
              value: `${message.channel}`
            },
            {
              name: "Target (if applicable)",
              inline: true,
              value: `${message.mentions.member.first()}`
            }
          ]
        }})  
      } catch (e){
        client.logger.cmd(`[CMD] ${client.config.permLevels.find(l => l.level === level).name} ${message.author.username} (${message.author.id}) attempted command ${cmd.help.name}`);
      }
    } else {
      return
    }
  } else {
      try {
        message.guild.channels.find('name', 'mod-log').send({embed : {
        title: "Command Use",
        description: `${message.member} successfully used a command at ${message.createdAt}.`,
        fields: [
          {
            name: "Command",
            inline: true,
            value: `${cmd.help.name}`
          },
          {
            name: "Invoker",
            inline: true,
            value: `${message.author.tag}(${message.author.id})`
          },
          {
            name: "Destination",
            inline: true,
            value: `${message.channel}`
          },
          {
            name: "Target (if applicable)",
            inline: true,
            value: `${message.mentions.members.first()}`
          }
        ]
      }})
    } catch (e) {
        client.logger.cmd(`[CMD] ${client.config.permLevels.find(l => l.level === level).name} ${message.author.username} (${message.author.id}) ran command ${cmd.help.name}`);
    }
  }

  // To simplify message arguments, the author's level is now put on level (not member so it is supported in DMs)
  // The "level" command module argument will be deprecated in the future.
  message.author.permLevel = level;
  
  message.flags = [];
  while (args[0] && args[0][0] === "-") {
    message.flags.push(args.shift().slice(1));
  }
  // If the command exists, **AND** the user has permission, run it.
  // client.logger.cmd(`[CMD] ${client.config.permLevels.find(l => l.level === level).name} ${message.author.username} (${message.author.id}) ran command ${cmd.help.name}`);

  //Default mod-log code
  // message.guild.channels.find('name', 'mod-log').send(`${message.author.tag} (${message.author.id}) ran command \`\`recruit\`\` on ${member.user.tag} (${member.id})`)
  

  cmd.run(client, message, args, level);
};
