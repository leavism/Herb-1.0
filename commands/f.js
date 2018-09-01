exports.run = async (client, message, args) => {
  let currentUser = message.author.id
  if (currentUser == 295411971262644224) {
    //message.guild.members.get(295411971262644224).kick("You used the command")
    message.channel.send("Im going to kick you for using this command, STOP. <@295411971262644224>")
  }
  else {
    message.channel.send('Anwidoxo#0476 has left. Hope <@295411971262644224> had a nice stay. RIP <:rip:353912065712324618>')
  }
}

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "User"
}

exports.help = {
  name: "f",
  category: "Server",
  description: "Try it and find out",
  usage: "?f",
  example: ["?f"]
}
