const shopCommon = require('./commonShop.js')

exports.run = async (client, message, args) => {
    console.log(args[0])
    console.log(message.mentions.members.first())
    // if (!isWholePositiveNumber(values[0])) {
    //     return message.reply("Ensure you included the amount of Simbits to award first and then mention the person you're trying to award. The amount of Simbits must be a positive whole number.\nFor example: ``setshop award 10 @Leavism#2011``");
    // } else { var awardAmount = Number(values.shift()); }

    // if (message.mentions.members.first() === undefined) {
    //     return message.reply("Ensure you mentioned the person you're trying to award.\nFor example: ``setshop award 10 @Leavism#2011``");
    // } else { var awardTarget = message.mentions.members.first(); }

    // if(!checkAcc(awardTarget)) mkAcc(awardTarget);

    // await message.channel.send(award(awardTarget, awardAmount));

    // message.guild.channels.find('name', data["shop-channel"]).send(`${message.member} awarded ${awardTarget} with ${awardAmount} Simbits.\nThe budget is now ${data.budget} Simbits.`)
    // break;
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
    usage: "?award <@user> <amount>",
    example: ["?award @Bevers222#2642 10"]
}
