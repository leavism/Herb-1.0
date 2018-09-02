const shopCommon = require('./commonShop.js')
const data = require("../data/shop/data.json");
const cTable = require('console.table');
const fs = require("fs");
const Discord = require("discord.js")

exports.run = async (client, message, args) => {

    let amount = Number(args[0])
    let target = message.mentions.members.first()

    if (!shopCommon.isWholePositiveNumber(amount) || target === undefined) {
        return message.reply("Sorry, Either the target is not a valid user, or I cannot deduct an amount of simbits that is either negative or not a whole number! Remember `?award 10 @Bevers222#2642`")
    }

    if (shopCommon.getShopUser(target).balance < amount) {
        return message.channel.send(`${target} only has ${commonShop.getShopUser(target).balance} Simbits, so ${amount} Simbits could not be deducted from their balance.`)
    }

    await message.channel.send(shopCommon.deduct(target, amount))

    message.guild.channels.find("name", data["shop-channel"]).send(`${message.member} deducted ${amount} Simbits from ${target}.\nThe budget is now ${data.budget} Simbits.`)
}

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: "Administrator"
}

exports.help = {
    name: "deduct",
    category: "Shop",
    description: "Shop command to deduct Simbits from users.",
    usage: "?deduct <amount> <@user>",
    example: ["?deduct 10 @Bevers222#2642"]
}
