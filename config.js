const config = {
  // Bot Owner, level 10 by default. A User ID. Should never be anything else than the bot owner's ID.
  "ownerID": "130604133978865664",

  // Bot Admins, level 9 by default. Array of user ID strings.
  "admins": [],

  // Bot Support, level 8 by default. Array of user ID strings
  "support": [],

  // Your Bot's Token. Available on https://discordapp.com/developers/applications/me
  "token":"Mzc2MTk4MDc1NjQwOTcxMjY2.DUZQlA.2b4GVcrogkaQvmcMbR56030unDA",
  // "sophie" : "Mzc2MTk4MDc1NjQwOTcxMjY2.DUZQlA.2b4GVcrogkaQvmcMbR56030unDA",
  // "dev" : "Mzk5ODAxOTAxNDI5OTQ4NDE2.DTSYDg.fgYR-QDFPbccm1Wsv0QGVeEtz4U"
  // "self": "mfa.RyFP8v5qOlOwMbDXr-zZhUPUglQhT1CrfcqUZLJBG6SXJlRMAwHRAb7kH4KIYBUqHpSiC3VlaWCr9rAP7ajE"

  // Default per-server settings. New guilds have these settings.

  // DO NOT LEAVE ANY OF THESE BLANK, AS YOU WILL NOT BE ABLE TO UPDATE THEM
  // VIA COMMANDS IN THE GUILD.

  "defaultSettings" : {
    "prefix": "-",
    "modLogChannel": "mod-log",
    "memberRole": "Simbian",
    "regRole": "Regular",
    "modRole": "Moderator",
    "adminRole": "Admin",
    "systemNotice": "true", // This gives a notice when a user tries to run a command that they do not have permission to use.
    "welcomeChannel": "welcome",
    "welcomeMessage": "{{user}}, Welcome to Simbad!\n\nWe are an Elite: Dangerous Community that welcomes all players regardless of in-game superpower, PP alignment, or gameplay style.\n\nIf you're looking for a casual community of players aimed at making the game more enjoyable, you've come to the right place!If you're interested, please contact any @Admin, @Regular, or @Welcomer. Also feel free to stay here and chill as a guest.\n\nPlease be aware that until you're given Discord roles, the only content you'll see is in this channel. If you would like to findout more about us, check out our website <https://simbadgaming.com/>",
    "welcomeEnabled": "false",
    "goodbyeChannel": "welcome",
    "goodbyeMessage": "{{user}} has left. Hope they had a nice stay. **RIP**",
    "goodbyeEnabled": "true",
    "botLogChannel" : "bot-log"
  },

  // PERMISSION LEVEL DEFINITIONS.

  permLevels: [
    // This is the lowest permisison level, this is for non-roled users.
    { level: 0,
      name: "User",
      // Don't bother checking, just return true which allows them to execute any command their
      // level allows them to.
      check: () => true
    },

    {
      level: 1,
      name: "Simbian",
      check: (message) => {
        try{
          const memberRole = message.guild.roles.find(r => r.name.toLowerCase() === message.settings.memberRole.toLowerCase());
          if (memberRole && message.member.roles.has(memberRole.id)) return true;
        } catch (e){
          return false;
        }
      }
    },

    {
      level: 2,
      name: "Regular",
      check: (message) => {
        try{
          const regRole = message.guild.roles.find(r => r.name.toLowerCase() === message.settings.regRole.toLowerCase());
          if(regRole && message.member.roles.has(regRole.id)) return true;
        } catch (e){
          return false;
        }
      }
    },

    // This is your permission level, the staff levels should always be above the rest of the roles.
    { level: 3,
      // This is the name of the role.
      name: "Moderator",
      // The following lines check the guild the message came from for the roles.
      // Then it checks if the member that authored the message has the role.
      // If they do return true, which will allow them to execute the command in question.
      // If they don't then return false, which will prevent them from executing the command.
      check: (message) => {
        try {
          const modRole = message.guild.roles.find(r => r.name.toLowerCase() === message.settings.modRole.toLowerCase());
          if (modRole && message.member.roles.has(modRole.id)) return true;
        } catch (e) {
          return false;
        }
      }
    },

    { level: 4,
      name: "Administrator",
      check: (message) => {
        try {
          const adminRole = message.guild.roles.find(r => r.name.toLowerCase() === message.settings.adminRole.toLowerCase());
          return (adminRole && message.member.roles.has(adminRole.id));
        } catch (e) {
          return false;
        }
      }
    },
    // This is the server owner.
    { level: 5,
      name: "Server Owner",
      // Simple check, if the guild owner id matches the message author's ID, then it will return true.
      // Otherwise it will return false.
      check: (message) => message.channel.type === "text" ? (message.guild.owner.user.id === message.author.id ? true : false) : false
    },

    // This is the bot owner, this should be the highest permission level available.
    // The reason this should be the highest level is because of dangerous commands such as eval
    // or exec (if the owner has that).
    { level: 10,
      name: "Bot Owner",
      // Another simple check, compares the message author id to the one stored in the config file.
      check: (message) => message.client.config.ownerID === message.author.id
    }
  ]
};

module.exports = config;
