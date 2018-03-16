const fs = require("fs");
const data = require("../data/activity/data.json");

module.exports = (client) => {

    setInterval(() => {
        checkVoiceChannels(client)
        fs.writeFileSync("./data/activity/data.json", JSON.stringify(data), (err) => console.log(err));
    }, 300000);

}

function checkVoiceChannels(client) {
    client.channels.forEach(c => {
        if(c.type === "voice") {
            c.members.forEach(m => {
                var actMember = getMember(m);
                addXP(actMember, (10 * c.members.array().length));
            })
        }
    });
}

function getMember(memberObj){
    return data.members.find(member => {
        return member.id === memberObj.id;
    });
}

function addXP(member, amount){
    member.xp += amount;
}

