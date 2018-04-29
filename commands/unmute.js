const fs = require('fs');
const muted = require('../data/mute/muted.json');

exports.run = async (client, message, level) => {
  if(message.mentions.members.first() === undefined){
    return message.reply("Please mention who you're unmuting. For example: ``?unmute @Leavism2011``")
  }
  var target = message.mentions.members.first();

  if(muted[target.id]){ 
    var addRoles = [];
    muted[target.id].forEach(role => {
      addRoles.push(message.guild.roles.find("name", role));
    })
  
    await target.removeRole(message.guild.roles.find("name","Mute"));
    await target.addRoles(addRoles);

    delete muted[target.id];
    fs.writeFileSync('./data/mute/muted.json', JSON.stringify(muted), (err) => console.log(err));
  
    message.channel.send(`${target} has been unmuted and gained their roles back.`);
  } else {
    return message.reply("That person has not been muted with the bot.");
  }

  
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 'Moderator'
};

exports.help = {
  name: 'unmute',
  category: 'Moderation',
  description: 'Removes all roles and add the Mute role to someone',
  usage: '?unmute <mention Discord member>',
  example: ["?unmute @Leavism#2011"]
};