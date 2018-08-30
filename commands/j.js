exports.run = async (client, message, args) => {
  let user = message.guild.members.random();
  message.channel.send(`kicking ${user}`);
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "Regular"
};

exports.help = {
  name: "j",
  category: "Server",
  description: "Try it and find out",
  usage: "?j",
  example: ["?j"]
};
