const fs = require('fs');
const data = require('../data/activity/data.json');

exports.run = async(client, message, args) => {
    let index = data.noNotifications.indexOf(message.member.id);

    if(index > -1){
        data.noNotifications.splice(index,1);
        fs.writeFileSync("./data/activity/data.json", JSON.stringify(data), (err) => console.log(err));
        message.channel.send("You will now be notified of activity level ups.")
    } else {
        data.noNotifications.push(message.member.id);
        fs.writeFileSync("./data/activity/data.json", JSON.stringify(data), (err) => console.log(err));
        message.channel.send("You will no longer be notified of activity level ups.");
    }
}

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["levelnotif", "lvlnotif"],
  permLevel: "Simbian"
};

exports.help = {
  name: "levelnotifications",
  category: "Activity",
  description: "Toggles whether you'll be notified of activity level ups!",
  usage: "levelnotification",
  example: ["?levelnotification", "?levelnotif", "?lvlnotif"]
};

function getMember(memberObj){
    return data.members.find(member => {
        return member.id === memberObj.id;
    });
}
