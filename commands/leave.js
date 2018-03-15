const fs = require('fs');
const joinConfig = require('../data/joinable/joinable.json');

exports.run = async (client, message, args) => {
  let role = "";
  for(var i = 0; i < args.length; i++){
    if (i == args.length-1) role += args[i]
    else role += args[i] + " "
  }

  if (joinConfig['joinable'].includes(role)){
    let giveRole = message.guild.roles.find('name',role);
    let msg = `I've taken the ${role} from you.`
    await message.member.removeRole(giveRole).catch(err => { msg = `I could not edit your roles because ${err}`});
    message.channel.send(msg);
  } else {
    message.channel.send(`Either the ${role} wasn't spelled correctly or you can't remove this role from yourself. Please contact an Admin if this is wrong.`);
  }
}

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "Simbian"
};

exports.help = {
  name: "leave",
  category: "Server",
  description: "Removes a specified role. Do not mention the role.",
  usage: "leave <role name>",
  example: ["?leave Bgs", "?leave Elite", "?leave Bgs"]
};
