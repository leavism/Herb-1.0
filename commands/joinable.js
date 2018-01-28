const fs = require('fs');
const joinConfig = require('../data/joinable/joinable.json');

exports.run = async (client, message, [action, ...value], level) => {
  let role = "";
  for(var i = 0; i < value.length; i++){
    if (i == value.length-1) role += value[i]
    else role += value[i] + " "
  }
  console.log(role)
  switch (action) {
    case 'add':
      if (!role) return message.reply('Please specify the name of a role. You don\'t need to mention the role.');
      if (!message.guild.roles.find('name', role)) return message.reply('I could not find that role. You do not need to mention the role.');
      if (joinConfig['joinable'].includes(role)) return message.reply('That role can already be used with \`\`join\`\` and \`\`leave\`\`');
      joinConfig['joinable'].push(role);
      fs.writeFile('./data/joinable/joinable.json', JSON.stringify(joinConfig), (err) => console.log(err));
      message.channel.send(`${role} role can now be used with \`\`join\`\` and \`\`leave\`\` commands.`);
      break;
    case 'remove':
      let index = joinConfig['joinable'].indexOf(role);
      if (index > -1){
        joinConfig['joinable'].splice(index, 1);
        fs.writeFile('./data/joinable/joinable.json', JSON.stringify(joinConfig), (err) => console.log(err));
        message.channel.send(`${role} role can no longer be used with \`\`join\`\` and \`\`leave\`\` commands.`);
      } else {
        message.channel.send(`${role} wasn't able to be used with \`\`join\`\` or \`\`leave\`\` in the first place.`);
      }
      break;
    default:
      message.channel.send("You aren't using that command correctly. Try ``help joinable`` to find out more details on how to use it.");
  }
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "Moderator"
};

exports.help = {
  name: "joinable",
  category: "Server",
  description: "Sets which roles for members to be able to use \`\`join\`\` with. Do not mention the role name.",
  usage: 'joinable <add/remove> role_name'
};
