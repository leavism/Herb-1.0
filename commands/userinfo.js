exports.run = async (client, message, [member], level) => {
  if(message.mentions.users.size < 1) {
    member = message.member;
  } else {
    member = message.mentions.members.first();
  }
  
  let joinedDDate = member.user.createdAt;
  let joinedSDate = member.joinedAt;

  let joinedDateArray = message.guild.members.map(m => m.joinedAt.toString()).sort(
    function(a, b) {
      a = new Date(a); // Have to set a, b to date objects again because it's an array of strings
      b = new Date(b);
      return a < b ? -1 : a > b ? 1 : 0;
    }
  )

  message.channel.send({embed : {
    color: member.displayColor,
    title: member.user.username + "#" + member.user.discriminator + ` (${member.displayName})`,
    thumbnail: {url: member.user.avatarURL},
    description: `Chilling in ${member.presence.status} status`,
    footer: { text: 'Member #' + (joinedDateArray.indexOf(joinedSDate.toString()) + 1) + " | User ID: " + member.user.id},
    fields: [
      {
        name: 'Joined Discord on',
        inline: true,
        value: joinedDDate.getDate() + ' ' + joinedDDate.getMonthText() + " " + joinedDDate.getFullYear() +
              `\n(${Math.round(Math.abs(joinedDDate - new Date())/(24*60*60*1000))} days ago)`, // Joined Discord date - today divided by days in milliseconds
      },
      {
        name: `Joined ${message.guild} on`,
        inline: true,
        value: joinedSDate.getDate() + ' ' + joinedSDate.getMonthText() + ' ' + joinedSDate.getFullYear() +
              `\n(${Math.round(Math.abs(joinedSDate - new Date())/(24*60*60*1000))} days ago)` // Joined server date - today divided by days in milliseconds
      },
      {
        name: 'Roles',
        inline: true,
        value: member.roles.map(m => m.name).filter(m => m != '@everyone').join(', ') // Roles collection is mapped to array with only role names. Then filters out the @everyone role
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
  name: 'userinfo',
  category: 'General',
  description: 'Gets information about a user on the server.',
  usage: 'userinfo @mention'
};
