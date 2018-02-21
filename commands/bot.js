const { version } = require("discord.js");
const moment = require("moment");
require("moment-duration-format");

exports.run = (client, message, args, level) => { // eslint-disable-line no-unused-vars
  const duration = moment.duration(client.uptime).format(" D [days], H [hrs], m [mins], s [secs]");
  message.channel.send(`__**STATISTICS**__
• Mem Usage\t\t:: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB
• Uptime\t\t\t\t :: ${duration}`);
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
  usage: "bot"
};
