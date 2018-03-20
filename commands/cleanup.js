const Discord = require("discord.js");

exports.run = (client, message, [action, value, ...key], level) => {
  if (action === "messages"){
    if (isNaN(value)) {
      return message.reply("Ensure you specified the amount of previous messages in this channel to delete.\nFor example: ``?cleanup messages 50``")
    }
    message.channel.fetchMessages({limit : value})
      .then(messages => {
        message.channel.bulkDelete(messages)
        message.delete();
      })
      .catch(error => {
        message.reply(`I could not clean up because:${error}`)
      })
  } else if (action === "user"){
    if(isNaN(value)) {
      return message.reply(`Please ensure you included a value amount before the author user name (not their server nickname/display name.\nFor example: \`\`?cleanup user 15 Leavism\`\``)
    }

    let delAuthorUsername = message.mentions.members.first() || key.join(" ");
    if(typeof(delAuthorUsername) !== "string") {
      delAuthorUsername = delAuthorUsername.user.username;
    }
    value++;
    let toDelete = [];
    let counter = 0;
    message.channel.fetchMessages({limit : 100})
      .then(messages => {

        messages.some(function(msg){
          if(counter >= value) return;
          if(msg.author.username === delAuthorUsername){
            counter++;
            toDelete.push(msg);
          }
        })

        message.channel.bulkDelete(toDelete);
        if(counter == 0) {
          message.reply(`I couldn't find anyone within the last 100 messages by the Discord user name ${delAuthorUsername}. Ensure you're inputting the Discord user name, not their server nickname/display name.`)
        }
      })
      .catch(error => {
        message.reply(`I could not clean up because: ${error}`);
      })
  } else {
    message.channel.send("Cleanup command is used to delete messages in bulk.\n\nSubcommands:"+
    "\n\tmessages\tDelete <amount> previous messages in the invoked channel"+
    "\n\tuser\t\tDelete <amount> previous messages sent by <user name>", {code: "md"})
  }

}

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["clean"],
  permLevel: "Admin"
};

exports.help = {
  name: "cleanup",
  category: "Moderation",
  description: "Mass delete messages",
  usage: "?cleanup <messages/user/bot> <amount/mention>",
  example: ["?cleanup messages 10","?cleanup user 20 @Leavism2011","?cleanup user 20 Leavism", "?cleanup bot 100"]
}