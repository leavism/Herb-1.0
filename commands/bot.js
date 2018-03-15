const { version } = require("discord.js");
const moment = require("moment");
const Discord = require("discord.js")
require("moment-duration-format");

exports.run = (client, message, args, level) => { // eslint-disable-line no-unused-vars
  const duration = moment.duration(client.uptime).format(" D [days], H [hrs], m [mins], s [secs]");

  const embed = new Discord.RichEmbed()
    .setTitle(client.user.tag)
    .setColor(0x04ff70)
    .setThumbnail(client.user.avatarURL)
    .setDescription(`[Usage Guide](https://leavism.gitbooks.io/sophie/) | [Leavism](https://github.com/leavism)`)
    .addField("🍽️ Serving", `${client.guilds.size} Servers\n${client.users.size} Users`, true)
    .addField("🕑 Uptime", duration, true)
    .setFooter("Use ?help for a list of available commands.")
  
    message.channel.send({embed});
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "Bot Owner"
};

exports.help = {
  name: "bot",
  category: "Miscelaneous",
  description: "Gives some useful bot statistics",
  usage: "?bot",
  example: ["?bot"]
};
