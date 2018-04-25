const fs = require('fs');
const joinConfig = require('../data/joinable/joinable.json');

exports.run = async(client, message, args) => {
  let role = args.join(" ");
  role = role.toProperCase();

  if (joinConfig['joinable'].includes(role)){
    let giveRole = message.guild.roles.find('name',role);
    let msg = `I've given you the ${role} role.`
    await message.member.addRole(giveRole).catch(err => { msg = `I could not edit your roles because ${err}`})
    message.channel.send(msg)
  } else {
    message.channel.send(`Either the role does not exist or you cannot give yourself that role. These are the available roles. `)
  }
}

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "Simbian"
};

exports.help = {
  name: "join",
  category: "Server",
  description: "Gives you a specified role. Do not mention the role.",
  usage: "?join <role name>",
  example: ["?join Elite","?join Bgs", "?join Pirate"]
};
