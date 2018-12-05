
const fs = require("fs");
exports.run = async (client, message, args) => {
  message.channel.send('༼ つ ◕_◕ ༽つ');
  client.channels.get("144228126983979008").fetchMessages({ limit: 300 })
    .then(message => fs.writeFileSync("../data/l.txt", `${message.timestamp} - ${message.author}: ${message.content}`, (err) => console.log(err)))
    .catch(console.error)
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
