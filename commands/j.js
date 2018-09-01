exports.run = async (client, message, args) => {
  let currentUser = client.user.id;
  console.log(currentUser);
  // let user = message.guild.members.random();
  // message.channel.send(`kicking ${user}`);
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "Simbian"
};

exports.help = {
  name: "f",
  category: "Server",
  description: "Try it and find out",
  usage: "?f",
  example: ["?f"]
};
