const fs = require("fs");

const data = require("../data/stats/data.json");

module.exports = (client, message) => {


    if(message.channel.type == "dm") return;
    
    //Total and sum of characters count
    data.totalMessages++;
    data.sumOfCharacters += message.content.length;


    //Messages from roles count
    var roleList = [];
    message.member.roles.forEach(r => roleList.push(r.name));
    
    if(roleList.includes(data.settings.adminRole)){
        data.adminMessages++;
    } else if(roleList.includes(data.settings.regRole)){
        data.regularMessages++;
    } else if(roleList.includes(data.settings.simbianRole)){
        data.simbianMessages++;
    } else if(roleList.includes(data.settings.ambassadorRole)){
        data.ambassadorMessages++;
    } else if(roleList.includes(data.settings.guestRole)){
        data.guestMessages++;
    } else if(roleList.length == 1){
        data.strangerMessages++;
    }

    if(message.author.bot) data.botMessages++;

    if(checkChannel(message.channel.name)){
        let thisChannel = getChannel(message.channel.name);
        thisChannel.count++;
    } else {
        makeChannel(message.channel.name);
    }
    

    //Saving the count
    fs.writeFileSync("./data/stats/data.json", JSON.stringify(data), (err) => console.log(err));
};

function checkChannel(name){
    let check = false;
    data.channels.forEach(r => {
        if(r.name == name) check = true;
    })
    return check;
}

function getChannel(name){
    return data.channels.find(channel => {
        return channel.name === name;
    })
}

function makeChannel(name){
    return data.channels.push(
        {
            "name": name,
            count: 1
        }
    )
}