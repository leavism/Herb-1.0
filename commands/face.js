

exports.run = async(client, message, args) => {
    message.channel.send(`༼ つ ◕_◕ ༽つ༼ つ ◕_◕ ༽つ༼ つ ◕_◕ ༽つ`);
}

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "Regular"
};

exports.help = {
  name: "praise",
  category: "Server",
  description: "༼ つ ◕_◕ ༽つ",
  usage: "?praise",
  example: ["?praise"]
};
