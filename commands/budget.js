const shopCommon = require('./commonShop.js')
const data = require("../data/shop/data.json");
const cTable = require('console.table');
const fs = require("fs");
const Discord = require("discord.js")

exports.run = async (client, message, args) => {
    let given = 0
    data.users.forEach(user => {
        given += user.balance
    })

    message.channel.send(`The budget is at ${data.budget} Simbits.\nThe total Simbits given to users is at ${given} Simbits.`)
}

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: "Administrator"
}

exports.help = {
    name: "budget",
    category: "Shop",
    description: "Shop command to see the Simbits budget",
    usage: "?budget",
    example: ["?budget"]
}




