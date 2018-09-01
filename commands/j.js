exports.run = async (client, message, args) => {
  let currentUser = message.author.id;
  console.log(currentUser);
  // let user = message.guild.members.random();
  // message.channel.send(`kicking ${user}`);
};
454845440408420353

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "Simbian"
};

exports.help = {
  name: "j",
  category: "Server",
  description: "Try it and find out",
  usage: "?f",
  example: ["?f"]
};
