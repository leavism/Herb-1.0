const fs = require('fs');
const data = require('../data/activity/data.json');

exports.run = async(client, message, args) => {
    let topTen = "";
    let actMember = getMember(message.member);


    data.members.sort(function(a,b) {
        return b.xp - a.xp
    })
    fs.writeFileSync("./data/activity/data.json", JSON.stringify(data), (err) => console.log(err));

    let aIndex = data.members.indexOf(actMember);
    
    for(var i = 0; i < 10; i++){
        topTen += `${i+1}. [Lvl. ${data.members[i].level}](${data.members[i].xp}) ${data.members[i].name}\n`;
    }

    message.channel.send(topTen, {code: "md"});

    if(aIndex >= 10){
        let curNexts = "";
        for(var u = aIndex - 2; u < aIndex+2; u++){
            try {
                var userName = data.members[u].name
                var userLevel = data.members[u].level
                var userXP = data.members[u].xp
            } catch (error) {
                break;
            }
            curNexts += `${u+1}. [Lvl. ${userLevel}](${userXP}) ${userName}\n`
        }
        message.channel.send(curNexts, {code: "md"});
    }
}

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "Simbian"
};

exports.help = {
  name: "rank",
  category: "Activity",
  description: "Lists the top 10 most active Simbian and your current position",
  usage: "rank",
  example: ["?rank"]
};

function getMember(memberObj){
    return data.members.find(member => {
        return member.id === memberObj.id;
    });
}
