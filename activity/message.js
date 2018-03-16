const fs = require("fs");
const data = require("../data/activity/data.json");

module.exports = (client, message) => {
    try {
        var member = message.member;
        var actMember = getMember(member);

        if (message.author.bot) return;
        if (message.content.startsWith("-")) return;
            if (!checkMember(member)) {
                makeMember(member);
                fs.writeFileSync("./data/activity/data.json", JSON.stringify(data), (err) => console.log(err));
            }
    
        if (client.actTalk.has(message.author.id)) return
    
        nameProcess(member);
        addXP(actMember, calcXP(message.content));
    
        if (levelUpProcess(actMember)) {
            if (wantsNotif(actMember)) {
                message.channel.send(`GG ${message.author} you leveled up to ${xpToLvl(actMember.xp)}! Keep up the great convos!\nReact with :speaking_head: within 60 seconds to no longer get pinged for this.`)
                    .then(msg => {
                        msg.react("🗣");
                        const filter = (reaction, user) => reaction.emoji.name === "🗣" && user.id === member.id;
                        const collector = msg.createReactionCollector(filter, { time: 60000 });
                        collector.on('collect', r => {
                            data.noNotifications.push(member.id);
                            message.channel.send("You will no longer be pinged.")
                            fs.writeFileSync("./data/activity/data.json", JSON.stringify(data), (err) => console.log(err));
                            collector.stop()
                        });
                        collector.on("end", r => {
                            msg.clearReactions();
                            msg.edit(`GG ${message.author} you leveled up to ${xpToLvl(actMember.xp)}!\nUse the ?levelnotif command to toggle pings for level ups.`)
                        })
                        // msg.delete(60000);
                    })
            } else {
                message.guild.channels.find("name", "bot-chat").send(`WOOP WOOP ${member.displayName} leveled up to ${xpToLvl(actMember.xp)}!`);
            }
        }
    
        fs.writeFileSync("./data/activity/data.json", JSON.stringify(data), (err) => console.log(err));
    
        client.actTalk.add(message.author.id);
        setTimeout(() => {
            client.actTalk.delete(message.author.id);
        }, 10000)
    } catch (err){}
};

function checkMember(memberObj) {
    var check = false
    data.members.forEach(member => {
        if (member.id === memberObj.id) check = true;
    });
    return check;
}

function makeMember(memberObj) {
    return data.members.push(
        {
            name: memberObj.displayName,
            id: memberObj.id,
            xp: 0
        }
    )
}

function getMember(memberObj) {
    return data.members.find(member => {
        return member.id === memberObj.id;
    });
}

function calcXP(messageContent) {
    var len = messageContent.length;
    if (len <= 10) return 2;
    else if (len <= 15) return 3;
    else if (len <= 25) return 4;
    else if (len <= 30) return 5;
    else if (len <= 35) return 6;
    else if (len <= 40) return 7;
    else if (len <= 45) return 8;
    else if (len <= 50) return 9;
    else if (len <= 70) return 10;
    else if (len >= 70) return 11;
}

function addXP(member, amount) {
    member.xp += amount * 2;
    console.log(`Added ${amount} XP`);
}

function nameProcess(memberObj) {
    var actMember = getMember(memberObj);
    if (actMember.name !== memberObj.displayName) {
        actMember.name = memberObj.displayName;
        fs.writeFileSync("./data/activity/data.json", JSON.stringify(data), (err) => console.log(err));
    } else {
        return;
    }
}

function levelUpProcess(actMember) {
    let nXP = lvlToXp(actMember.level + 1);
    if (actMember.xp >= nXP) {
        actMember.level++;
        return true;
    }
    return false
}

function wantsNotif(actMember) {
    if (data.noNotifications.indexOf(actMember.id) > -1) return false;
    return true;
}

function xpToLvl(xp) {
    return Math.floor(((Math.sqrt(xp + 500)) / (5 * Math.sqrt(2))) - 3)
}

function lvlToXp(level) {
    return 50 * Math.pow(level, 2) + 300 * level - 50
}