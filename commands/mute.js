const fs = require('fs');
const muted = require('../data/mute/muted.json');

exports.run = async (client, message, level) => {
  if(message.mentions.members.first() === undefined){
    return message.reply("Please mention who you're muting. For example: ``?mute @Leavism2011``")
  }
  var target = message.mentions.members.first();
  let rolesStringArry = target.roles.map(m => m.name).filter(m => m != '@everyone')

  muted[target.id] = rolesStringArry;
  fs.writeFileSync('./data/mute/muted.json', JSON.stringify(muted), (err) => console.log(err));

  let rolesArray = target.roles.array();
  target.removeRoles(rolesArray);

  if(message.guild.roles.find("name","Mute") !== undefined){
    await target.addRole(message.guild.roles.find("name","Mute"))
    message.channel.send(`${target} has been muted.`)
  } else {
    message.reply(`there isn't a Mute role but I've removed ${target}'s roles.`)
  }

};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 'Moderator'
};

exports.help = {
  name: 'mute',
  category: 'Moderation',
  description: 'Removes all roles and add the Mute role to someone',
  usage: '?mute <mention Discord member>',
  example: ["?mute @Leavism#2011"]
};