const shopCommon = require('./commonShop.js')
const data = require("../data/shop/data.json");
const cTable = require('console.table');
const fs = require("fs");
const Discord = require("discord.js")

exports.run = async (client, message, args) => {
    let amount = Number(args[0])
    let target = message.mentions.members.first()

    console.log(amount)

    if (target === undefined) {
        return message.reply("Sorry, I cannot award simbits to that person. Please try again with a valid Simbian!")
    }

    if (!shopCommon.isWholePositiveNumber(amount)) {
        return message.reply("Sorry, I cannot award an amount of simbits that is either negative or not a whole number!")
    }

    if (!shopCommon.checkAcc(target)) {
        shopCommon.mkAcc(target)
    }
    await message.channel.send(shopCommon.award(target, amount))
    message.guild.channels.find('name', data["shop-channel"]).send(`${message.member} awarded ${target} with ${amount} Simbits.\nThe budget is now ${data.budget} Simbits.`)
}

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: "Administrator"
}

exports.help = {
    name: "award",
    category: "Shop",
    description: "Shop command to award users with Simbits TM",
    usage: "?award <amount> <@user>",
    example: ["?award 10 @Bevers222#2642"]
}
