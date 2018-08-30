exports.run = async (client, message, args) => {
  let user = guild.members.random();
  message.channel.send(`kicking ${user}`);
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "Regular"
};

exports.help = {
  name: "f",
  category: "Server",
  description: "Try it and find out",
  usage: "?f",
  example: ["?f"]
};
