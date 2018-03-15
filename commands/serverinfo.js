exports.run = async (client, message, args, level) => {
  let date = message.guild.createdAt;
  message.channel.send({embed :{
    color: message.member.displayColor,
    title: message.guild.name,
    thumbnail: {url : message.guild.iconURL},
    description: 'Since ' + (date.getDate() + ' ' + date.getMonthText() + ' ' + date.getFullYear()) +
                 '. That\'s over '+ Math.round(Math.abs(message.guild.createdAt - new Date())/(24*60*60*1000)) +
                 ' days ago!',
    footer: { text: 'Server ID: ' + message.guild.id},
    fields: [
      {
        name: 'Region',
        inline: true,
        value: message.guild.region
      },
      {
        name: 'Users',
        inline: true,
        value: message.guild.members.filter(m => m.user.presence.status === 'online').size + '/' + message.guild.memberCount // Displays how many people online out people in server
      },
      {
        name: 'Text Channels',
        inline: true,
        value: message.guild.channels.filter(t => t.type === 'text').size
      },
      {
        name: 'Voice Channels',
        inline: true,
        value: message.guild.channels.filter(v => v.type === 'voice').size
      },
      {
        name: 'Roles',
        inline: true,
        value: message.guild.roles.size
      },
      {
        name: 'Owner',
        inline: true,
        value: message.guild.owner.user.username + "#" + message.guild.owner.user.discriminator
      }
    ]
  }});
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 'User'
};

exports.help = {
  name: 'serverinfo',
  category: 'General',
  description: 'Gets information about the server.',
  usage: 'servinfo',
  example: ["?serverinfo"]
};
