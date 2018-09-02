const shopCommon = require('./commonShop.js')
const data = require("../data/shop/data.json");
const cTable = require('console.table');
const fs = require("fs");
const Discord = require("discord.js")

exports.run = async (client, message, args) => {
    let amount = Number(args[0])
    let target = message.mentions.members.first()

    if (!shopCommon.isWholePositiveNumber(amount) || target === undefined) {
        return message.reply("Sorry, Either the target is not a valid user, or I cannot award an amount of simbits that is either negative or not a whole number! Remember `?award 10 @Bevers222#2642`")
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
    description: "Shop command to award users with Simbits.",
    usage: "?award <amount> <@user>",
    example: ["?award 10 @Bevers222#2642"]
}
