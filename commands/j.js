exports.run = async (client, message, args) => {
  let currentUser = message.author.id;
  if (currentUser == 295411971262644224) {
    message.guild.members.get(295411971262644224).kick("You used the command");
    message.channel.send("I have kicked Anwi for using his command")
  }
  else {
    message.channel.send('Anwidoxo#0476 has left. Hope he had a nice stay. RIP :rip:')
  }
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
