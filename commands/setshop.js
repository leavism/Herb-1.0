const data = require("../data/shop/data.json");
const cTable = require('console.table');
const fs = require("fs");
const Discord = require("discord.js")

exports.run = async (async, message, [action, ...values], level) => {
    switch(action){
        case "budget": 
            let outThere = 0;
            data.users.forEach(user => {
                outThere += user.balance;
            })

            message.channel.send(`The budget is at ${data.budget} Simbits.\nThe total Simbits given to users is at ${outThere} Simbits.`)
            break;
        case "award":
            if (!isWholePositiveNumber(values[0])) {
                return message.reply("Ensure you included the amount of Simbits to award first and then mention the person you're trying to award. The amount of Simbits must be a positive whole number.\nFor example: ``setshop award 10 @Leavism#2011``");
            } else { var awardAmount = Number(values.shift()); }

            if (message.mentions.members.first() === undefined) {
                return message.reply("Ensure you mentioned the person you're trying to award.\nFor example: ``setshop award 10 @Leavism#2011``");
            } else { var awardTarget = message.mentions.members.first(); }

            if(!checkAcc(awardTarget)) mkAcc(awardTarget);

            await message.channel.send(award(awardTarget, awardAmount));

            message.guild.channels.find('name', data["shop-channel"]).send(`${message.member} awarded ${awardTarget} with ${awardAmount} Simbits.\nThe budget is now ${data.budget} Simbits.`)
            break;
        case "deduct":
            if (!isWholePositiveNumber(values[0])) {
                return message.reply("Ensure you included the amount of Simbits to deduct first and then mention the person you're trying to deduct from. The amount of Simbits must be a positive whole number.\nFor example: ``setshop deduct 10 @Leavism#2011``");
            } else { var deductAmount = Number(values.shift()); }

            if (message.mentions.members.first() === undefined) {
                return message.reply("Ensure you mentioned the person you're trying to deduct.\nFor example: ``setshop deduct 10 @Leavism#2011``");
            } else { var deductTarget = message.mentions.members.first(); }

            if(getShopUser(deductTarget).balance < deductAmount) { 
                return message.channel.send(`${deductTarget} only has ${getShopUser(deductTarget).balance} Simbits, so ${deductAmount} Simbits could not be deducted from their balance.`);
            }

            await message.channel.send(deduct(deductTarget, deductAmount));

            message.guild.channels.find("name", data["shop-channel"]).send(`${message.member} deducted ${deductAmount} Simbits from ${deductTarget}.\nThe budget is now ${data.budget} Simbits.`);
            break;
        case "remove":
            if(getItemFromShop(values.join(" ")) === undefined) {
                return message.reply(`${values.join(" ")} doesn't exist in the shop. Make sure you spelled everything correctly.`);
            } else {
                var removeItem = getItemFromShop(values.join(" "));
            }

            await message.channel.send(removeFromShop(removeItem));

            message.guild.channels.find("name", data["shop-channel"]).send(`${message.member} removed ${removeItem.Item} from the store.`);
            break;
        case "redeem":
            if(message.mentions.members.first() === undefined){
                return message.reply("Ensure you mention the person who's item you're trying to redeem.\nFor example: ``setshop redeem Mad Adder Tea @Leavism#2011``");
            } else {
                let mentionedPeople = 0;
                message.mentions.members.forEach(member => {
                    mentionedPeople++;
                })

                if(mentionedPeople > 1) {
                    return message.reply("You can only redeem from one person at a time.");
                }
                var redeemTarget = message.mentions.members.first();
                values.pop();
            }
            if(getItemFromInventory(redeemTarget, values.join(" ")) === undefined) {
                return message.reply(`${values.join(" ")} was not in ${redeemTarget}'s inventory. Make sure you spelled the item correctly.`);
            } else {
                var redeemItem = getItemFromInventory(redeemTarget, values.join(" "));
            }

            await message.channel.send(redeem(redeemTarget, redeemItem));

            message.guild.channels.find("name", data["shop-channel"]).send(`${message.member} redeemed one ${redeemItem.Item} from ${redeemTarget}'s inventory.`)
            break;
        case "give":
            if(message.mentions.members.first() === undefined){
                return message.reply("Ensure you mention the person you're trying to give the item to.\nFor example: ``setshop give 5 Mad Adder Tea @Leavism#2011``");
            } else {
                let giveMentionedPeople = 0;
                message.mentions.members.forEach(member => {
                    giveMentionedPeople++;
                })

                if(giveMentionedPeople > 1) {
                    return message.reply("You can only give to one person at a time.");
                }
                var giveTarget = message.mentions.members.first();
                values.pop();
            }
            if(!isWholePositiveNumber(values[0])) {
                return message.reply("Ensure you include the quantity first, then item name, then mention the person you're giving the item to.\nFor example: ``setshop give 5 Mad Adder Tea @Leavism#2011``")
            } else {
                var giveQuantity = parseInt(values.shift());
            }
            let giveItemName = values.join(" ");
            
            await message.channel.send(giveItem(giveTarget, giveQuantity, giveItemName));
            break;
        case "channel":
            data["shop-channel"] = values.join(" ");

            fs.writeFileSync("./data/shop/data.json", JSON.stringify(data), (err) => console.log(err));
            break;
        case "report":
            let sortedUsers = data.users.sort(function (lookingAt, next){
                return next.balance - lookingAt.balance;
            })
            fs.writeFileSync('./data/sortedUsers.txt', "", (err) => console.log(err));
            for(var i = 0; i < sortedUsers.length; i++){
                let inventoryToWrite = "";
                for(var j = 0; j < sortedUsers[i].inventory.length; j++){
                    inventoryToWrite += `${sortedUsers[i].inventory[j].Item}(${sortedUsers[i].inventory[j].quantity}x)  `
                }
                let toWrite = 
                `First Display Name: ${sortedUsers[i].name}\nID: ${sortedUsers[i].id}\nBalance: ${sortedUsers[i].balance}\nInventory: ${inventoryToWrite}\n\n`;
                fs.appendFileSync("./data/sortedUsers.txt", toWrite, (err) => console.log(err));
            }
            message.channel.send(new Discord.Attachment("./data/sortedUsers.txt", "Sorted_User_List.txt"))
            break;
        default: 
            message.channel.send("These are the Administrative commands for the Simbit Shop.\n\nSubcommands:"+
            "\n\tbudget\t\tTo display the current Simbit budget." + 
            "\n\taward\t\t Award <amount> of Simbits to <user>"+
            "\n\tdeduct\t\tDeduct <amount> of Simbits from <user>" + 
            "\n\tremove\t\tRemoves an item from the shop" + 
            "\n\tredeem\t\tRedeems an item from a user's inventory" +
            "\n\tgive\t\t  Gives an item to a user."+
            "\n\tchannel\t   Sets the channel audits are posted in."+
            "\n\treport\t\tSends a sorted list based on balance value as a .txt.", {code: "md"})
    }
}


function isWholePositiveNumber(number) {
    return number % 1 === 0 && number > 0;
}

/*
Checks if a Discord member already has a Simbit shop account

@param memberObj : Discord Member object

@return : true if Discord member already has a Simbit shop account, false if Discord member doesn't have a Simbit shop account.
*/
function checkAcc(memberObj){
    if(getShopUser(memberObj) != null){
        return true;
    }
    return false;
}

/*
Makes a Simbit shop account for a Discord member

@param memberObj : Discord Member object

@return : void
*/
function mkAcc(memberObj){
    data["users"].push(
        {
            "id": memberObj.user.id.toString(),
            "name": memberObj.user.username,
            "balance": 0,
            "inventory" : []
        }
    )
    return fs.writeFileSync("./data/shop/data.json", JSON.stringify(data), (err) => console.log(err));
}

/*
Gets the Simbit account

@param memberObj : Discord Member object

@return : Simbit shop account
*/
function getShopUser(memberObj){
    return data.users.find(user => {
        return user.id === memberObj.user.id.toString();
    })
}

/*
Awards a Shop User an amount of Simbits. There's no limit to how many Simbits

@param memberObj: Discord Member object
@param amount: The amount of Simbits to award.

@return: A string message if successful
*/
function award(memberObj, amount){
    let shopUser = getShopUser(memberObj);

    shopUser.balance += amount;
    data.budget -= amount;

    fs.writeFileSync("./data/shop/data.json", JSON.stringify(data), (err) => console.log(err));

    return `:confetti_ball:  ${memberObj} has earned ${amount} Simbits! :confetti_ball: `
}

/*
Deducts a Shop User an amount of Simbits. Can't deduct if their balance isn't enough to deduct from

@param memberObj: Discord Member object
@param amount: The amount of Simbits to deduct

@return: A string message if successful
*/
function deduct(memberObj, amount){
    let shopUser = getShopUser(memberObj);

    shopUser.balance -= amount;
    data.budget += amount;

    fs.writeFileSync("./data/shop/data.json", JSON.stringify(data), (err) => console.log(err));

    return `${memberObj} has had ${amount} Simbits deducted from them and added back to the budget.`
}

/*
Gets an Item object from the shop

@param itemName: String name of item

@return : The Item object if it exists in the store list, undefined if it's not in the store list
*/
function getItemFromShop(itemName){
    return data.store.find(storeItem => {
        return storeItem.Item === itemName;
    })
}

/*
Removes an shop item object from the shop
@param itemObj: The Shop Item object

@return: A successful string or a failed string
*/
function removeFromShop(itemObj) {
    let index = data.store.indexOf(itemObj);

    if(index > -1){
        data.store.splice(index, 1);

        fs.writeFileSync("./data/shop/data.json", JSON.stringify(data), (err) => console.log(err));

        return `${itemObj.Item} has been removed from the shop.`
    } else {
        return `${itemObj.Item} doesn't exist in the store. Please double check you've spelled it correctly.`
    }
}

/*
Gets item object if it exists in a shop user's inventory
@param memberObj: Discord Member object
@param itemName: String name of item

@return: The inventory item object
*/
function getItemFromInventory(memberObj, itemName){
    let shopUser = getShopUser(memberObj);
    return shopUser.inventory.find(invItem => {
        return invItem.Item === itemName;
    })
}

/*
The redeeming process. Removes an inventory item from a shop user's inventory
@param memberObj: Discord Member object
@param itemObj: Inventory Item object

@return: Success string message
*/
function redeem(memberObj, itemObj){
    let shopUser = getShopUser(memberObj);
    
    inventoryQuantityProcess(memberObj, itemObj);

    return `One ${itemObj.Item} has successfully redeemed and removed from ${memberObj}'s inventory.`;
}

/*
The process of removing ONE item from a shop user inventory. Will delete completely if quantity is at 0, reduce quantity by 1 else.
@param memberObj: The Discord Member object
@param itemObj: The Inventory Item object
*/
function inventoryQuantityProcess(memberObj, itemObj){
    let shopUser = getShopUser(memberObj);
    if(itemObj.quantity == 1) {
        let index = shopUser.inventory.indexOf(itemObj);

        if(index > -1){
            shopUser.inventory.splice(index, 1);
    
            return fs.writeFileSync("./data/shop/data.json", JSON.stringify(data), (err) => console.log(err));
        }
    } else {
        itemObj.quantity -= 1;

        return fs.writeFileSync("./data/shop/data.json", JSON.stringify(data), (err) => console.log(err));
    }
}

function giveItem(memberObj, quantity, itemName){
    let shopUser = getShopUser(memberObj);

    if(getItemFromInventory(memberObj, itemName) === undefined){
        shopUser.inventory.push(
            {
                "Item": itemName,
                "quantity": quantity
            }
        )
        fs.writeFileSync("./data/shop/data.json", JSON.stringify(data), (err) => console.log(err));
        return `${quantity}x ${itemName} has been given to ${memberObj}`;
    } else {
        let invItem = getItemFromInventory(memberObj, itemName);
        invItem.quantity += quantity;
        fs.writeFileSync("./data/shop/data.json", JSON.stringify(data), (err) => console.log(err));
        return `${quantity}x ${itemName} has been given to ${memberObj}`;
    }
}

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: "Administrator"
};

exports.help = {
    name: "setshop",
    category: "Shop",
    description: "Administrator commands to interact with the Simbit Shop.",
    usage: "setshop <budget/award/...>",
    example: ["?setshop budget", "?setshop award 10 @Leavism#2011"]
};