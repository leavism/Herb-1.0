const fs = require('fs');
const joinConfig = require('../data/joinable/joinable.json');

exports.run = async(client, message, args) => {
  let role = args.join(" ");

  if (joinConfig['joinable'].includes(role)){
    let giveRole = message.guild.roles.find('name',role);
    let msg = `I've given you the ${role} role.`
    await message.member.addRole(giveRole).catch(err => { msg = `I could not edit your roles because ${err}`})
    message.channel.send(msg)
  } else {
    message.channel.send(`Either the ${role} role was spelled incorrectly or you cannot give yourself this role. Please contact an Admin if this is wrong.`)
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
  usage: "join role_name"
};
