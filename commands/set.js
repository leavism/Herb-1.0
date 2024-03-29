const { inspect } = require("util");

// This command is to modify/edit guild configuration. Perm Level 3 for admins
// and owners only. Used for changing prefixes and role names and such.

// Note that there's no "checks" in this basic version - no config "types" like
// Role, String, Int, etc... It's basic, to be extended with your deft hands!

// Note the **destructuring** here. instead of `args` we have :
// [action, key, ...value]
// This gives us the equivalent of either:
// const action = args[0]; const key = args[1]; const value = args.slice(2);
// OR the same as:
// const [action, key, ...value] = args;
exports.run = async (client, message, [action, key, ...value], level) => { // eslint-disable-line no-unused-vars

  // Retrieve current guild settings
  const settings = client.settings.get(message.guild.id);

  // Firstly, if a user does `-set edit <key> <new value>`, let's change it
  if (action === "edit") {
    if (!key) return message.reply("Please specify a key to edit");
    if (!settings[key]) return message.reply("This key does not exist in the settings");
    if (value.length < 1) return message.reply("Please specify a new value");

    settings[key] = value.join(" ");

    client.settings.set(message.guild.id, settings);
    message.reply(`${key} successfully edited to ${value.join(" ")}`);
  } else
  // Secondly, if a user does `-set get <key>`, lets get it
  if (action === "get") {
    if (!key) return message.reply("Please specify a key to view");
    if (!settings[key]) return message.reply("This key does not exist in the settings");
    message.reply(`The value of ${key} is currently ${settings[key]}`);
  } else
  if (action === "add") {
    if (!key) return message.reply("Please specify a key to add");
    if (settings[key]) return message.reply("This key already exists in the settings");
    if (value.length < 1) return message.reply("Please specify a value");

    // `value` being an array, we need to join it first.
    settings[key] = value.join(" ");
  
    // One the settings is modified, we write it back to the collection
    client.settings.set(message.guild.id, settings);
    message.reply(`${key} successfully added with the value of ${value.join(" ")}`);
  } else
  if (action === "remove") {
    delete settings[key];
    client.settings.set(message.guild.id, settings);
    message.channel.send(`${key} has been removed from settings.`);
  } else {
    message.channel.send(inspect(settings), {code: "json"});
    message.channel.send(`Use \`\`${settings.prefix}set edit\`\`to edit one of the settings.\nFor example, \`\`${settings.prefix}set edit welcomeChannel hev_you_seen_boss_chat\`\` changes the location in which welcome messages are sent to hev_you_seen_boss_chat.`)
  }
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["setting", "settings", "conf"],
  permLevel: "Administrator"
};

exports.help = {
  name: "set",
  category: "System",
  description: "View or change settings for your server.",
  usage: "?set <add/edit/get> <key> <value>",
  example: ["?set add botLogChannel bot-log","?set edit botLogChannel general","?set get botLogChannel"]
};
