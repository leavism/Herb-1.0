const data = require("../data/shop/data.json");
const cTable = require("console.table");
const fs = require("fs");

exports.run = async (client, message, [action, ...values], level) => {
    if(!checkAcc(message.member)) mkAcc(message.member);

    switch(action){
        case "list":
            let displayList = []
            for(var i = 0; i < data.store.length; i++){
                displayList.push([[data.store[i].Item], [data.store[i].Cost], [data.store[i].Stock], [data.store[i].Description]])
            }
            let display = cTable.getTable(["Item", "Cost", "Stock", "Description"],displayList);
            message.channel.send("Simbit Store\n============", {code: "md"})
            message.channel.send(display.replaceAll("-1", "∞ "), {code: "md"});
            break;
        case "bank":
            let target = message.member
            if (values.length > 0){
                if(!checkAcc(message.mentions.members.first())) mkAcc(message.mentions.members.first());
                target = message.mentions.members.first();
            }

            message.channel.send({embed : {
                color: target.displayColor,
                title: target.displayName,
                description: "This is your Simbit balance and shop inventory.",
                fields: [
                    {
                        name: "Balance",
                        inline: true,
                        value: getBalance(target)
                    },
                    {
                        name: "Inventory",
                        inline: true,
                        value: invToString(target)
                    }
                ]
            }})
            break;
        case "buy":
            let quantity = Number(values.shift());
            let itemName = values.join(" ");
            let memberObj = message.member;

            let shopUser = getShopUser(memberObj);
            let itemObj = getItemFromShop(itemName);

            if(!isWholePositiveNumber(quantity)) return message.reply("Ensure you input the quantity before the item name. Only whole positive numbers are accepted as a quantity. Be aware that any decimal digits will be deprecated to just the whole number.\nFor example:``shop buy 5 Emoji``");
        
            if(itemObj === undefined) return message.reply("That item doesn't exist in the store. Make sure you've spelled the item name correctly.");
        
            if(!canAfford(memberObj, quantity, itemObj)) return message.reply(`You only have a balance of ${shopUser.balance} Simbits, but you'll need ${itemObj.Cost * quantity} Simbits to buy ${quantity}x ${itemObj.Item}.`); 
        
            if(!shopStockProcess(quantity, itemObj)) return message.reply(`You cannot buy that many. You wanted to buy ${quantity}x ${itemObj.Item} but the current stock is only at ${itemObj.Stock}x.`);

            await message.reply(buy(message.member, quantity, itemName));

            if (!getItemFromShop(itemName).Fdev) {
                message.guild.channels.find('name', data["shop-channel"]).send(`${message.member} bought ${quantity}x ${itemName}, which is a **perk**. ${getItemFromShop(itemName).Cost * quantity} Simbits are added back into the budget.\nThe budget is now ${data.budget}`);
            } else {
                message.guild.channels.find("name", data["shop-channel"]).send(`${message.member} bought ${quantity}x ${itemName}, which isn't a perk.\nThe budget is still ${data.budget} Simbits.`)
            }
            break;
        case "donate":
            let donateAmount = Number(values.shift());

            if(donateAmount < 0) {
                message.reply(`Umm ${Math.abs(donateAmount)} Simbits has been taken from the budget and added to your account... :question::question::question:`)

                return message.guild.channels.find('name', data["shop-channel"]).send(`Smartass ${message.member} tried to donate a negative value. They might think they've found an exploit to make free Simbits.`)
            }

            if(!isWholePositiveNumber(donateAmount)) return message.reply("You can only donate a whole positive number. Keep the change :smirk:");

            if(!canDonate(message.member, donateAmount)) {
                return message.reply(`You can't donate ${donateAmount} Simbits. You only have ${getShopUser(message.member).balance} Simbits.`);
            }
            await message.channel.send(donate(message.member, donateAmount));

            message.guild.channels.find('name', data["shop-channel"]).send(`${message.member} donated ${donateAmount} Simbits! The budget is now ${[data.budget]} Simbits.`);

            break;
        case "transfer": 
            if (!isWholePositiveNumber(values[0])) {
                return message.reply("Ensure you included the amount of Simbits to transfer first and then mention the person you're trying to transfer. The amount of Simbits must be a positive whole number.\nFor example: ``shop transfer 10 @Leavism#2011``");
            } else { var transferAmount = Number(values.shift()); }


            if (message.mentions.members.first() === undefined) {
                return message.reply("Ensure you mentioned the person you're trying to transfer to.\nFor example: ``shop transfer 10 @Leavism#2011``");
            } else { var transferTarget = message.mentions.members.first(); }

            if(!canDonate(message.member, transferAmount)) {
                return message.reply(`You can't transfer ${transferAmount} Simbits. You only have ${getShopUser(message.member).balance} Simbits.`);
            }

            if(!checkAcc(transferTarget)) mkAcc(transferTarget);

            await message.channel.send(transfer(message.member,transferTarget, transferAmount));
            break;
        case "gift":
            if (!isWholePositiveNumber(values[0])) {
                return message.reply("Ensure you included the quantity, item name, and then mention the person you're trying to gift.\nFor example: ``shop gift 2 Mad Adder Tea @Leavism#2011``");
            } else { var giftQuantity = Number(values.shift()); }

            if(message.mentions.members.first() === undefined){
                return message.reply("Ensure you mention the person whom you're trying to gift.\nFor example: ``shop gift 2 Mad Adder Tea @Leavism#2011``");
            } else {
                let giftMentionedPeople = 0;
                message.mentions.members.forEach(member => {
                    giftMentionedPeople++;
                })

                if(giftMentionedPeople > 1) {
                    return message.reply("You can only gift to one person at a time.");
                }
                var giftTarget = message.mentions.members.first();
                values.pop();
            }

            if(getItemFromInventory(message.member, values.join(" ")) === undefined) {
                return message.reply(`${values.join(" ")} was not in your inventory to gift. Make sure you spelled the item correctly.`);
            } else {
                var giftItem = getItemFromInventory(message.member, values.join(" "));
            }

            await message.channel.send(gift(message.member, giftTarget, giftQuantity, giftItem))
            break;
        case "alert":
            message.channel.send("I've alerted Admins you're looking to redeem an item from your inventory");

            let admins = message.guild.roles.find("name", "Admin");
            message.guild.channels.find("name", data["shop-channel"]).send(`${message.member} wants to redeem their item(s)! ${admins}`);
            break;
        default: 
            message.channel.send("The Simbit Shop is a place where all Discord members can spend points (Simbits) on prizes. Simbits are usually awarded by participating in events and giveaways.\n\nSubcommands:"+
            "\n\tlist\t\tTo display the shop items" +
            "\n\tbank\t\tTo display your balance and inventory" + 
            "\n\tbuy\t\t Buy <quantity> amount of <item name>" + 
            "\n\tdonate\t  Donate <amount> of Simbits back to the budget!"+
            "\n\ttransfer\tTranser <amount> of Simbits to <user>"+
            "\n\tgift\t\tGift an <item> in your inventory to another <user>", {code: "md"})
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
Gets someone's item inventory as a string

@param memberObj : Discord Member object

@return : String list of inventory item ad their quantity. If the inventory is empty, the string will say "Empty"
*/
function invToString(memberObj){
    let result = "";
    let shopUser = getShopUser(memberObj);

    shopUser.inventory.forEach(invItem => {
        result += `${invItem.Item} (${invItem.quantity}x)\n`;
    })
    if (result.length == 0) result = "Empty";
    return result;
}

/*
Gets someone's Simbit account balance

@param memberObj : Discord Member object

@return : The balance of the Simbit account
*/
function getBalance(memberObj){
    return getShopUser(memberObj).balance;
}

/*
Gets an Item object from the shop

@param itemName: String name of item

@return : The Item object if it exists in the store list, undefined if it's not in the store list
*/
function getItemFromShop(itemName){
    return data.store.find(storeItem => {
        return storeItem.Item.toLowerCase() === itemName.toLowerCase();
    })
}


/*
The buying process. Where are all the checks happen.

@param memberObj: The Discord Member object
@param quantity: The quantity of said purchase
@param itemName: The name of the item of said purchase

@return : Different strings depending on the checks.
*/
function buy(memberObj, quantity, itemName){
    return addToInventoryProcess(memberObj, quantity, getItemFromShop(itemName));
}

/*
The process of reducing the stock of a Shop Item if it was purchased.
@param quantity: The quantity of said purchase to subtract from stock
@param itemObj: The Shop Item object of said purchase

@return :  True if stock of item is -1 (infinite), if there is enough stock to empty it out completely, or enough stock to have Shop Item left over. False if there isn't enough stock for purchase.
*/
function shopStockProcess(quantity, itemObj){
    if(itemObj.Stock == -1) return true; // If infinite stock, return sucessful without saving because were wasn't an edit
    if(itemObj.Stock > quantity ) itemObj.Stock -= quantity; // sucessful
    else if(itemObj.Stock == quantity) { // sucessful
        let index = data.store.indexOf(itemObj);
        data.store.splice(index, 1);
    }
    else if(itemObj.Stock < quantity) return false; // failed

    fs.writeFileSync("./data/shop/data.json", JSON.stringify(data), (err) => console.log(err));
    return true;
}
/*
After all the checks, this is the process of adding the shop item to the shop user's inventory and subtracting the total cost from the shop user's balance

@param memberObj: Discord Member object
@param quantity: The quantity of items from said purchase
@param itemObj: The Shop Item object from said purchase
*/
function addToInventoryProcess(memberObj, quantity, itemObj){
    let shopUser = getShopUser(memberObj);
    let userInv = shopUser.inventory;

    if(!checkIfInInventory(memberObj, itemObj)){
        userInv.push(
            {
                "Item" : itemObj.Item,
                "quantity" : quantity
            }
        )
        subtractBalance(memberObj, quantity, itemObj);
    } else {
        shopUser.inventory.find(inv => {
            if(inv.Item === itemObj.Item) inv.quantity += quantity;
        })
        subtractBalance(memberObj, quantity, itemObj);
    }

    fs.writeFileSync("./data/shop/data.json", JSON.stringify(data), (err) => console.log(err)); 
    
    return `You've successfully purchased ${quantity}x ${itemObj.Item} for ${itemObj.Cost * quantity} Simbits. Your balance is now ${shopUser.balance} Simbits.`
}

/*
Subtracts the cost of an item from the shop user during a purchase

@param memberObj: Discord Member object
@param quantity: The quantity of said purchase
@param itemObj: The Shop Item object of said purchase
*/
function subtractBalance(memberObj, quantity, itemObj){
    let shopUser = getShopUser(memberObj);
    fDevProcess(quantity, itemObj);
    return shopUser.balance -= (itemObj.Cost * quantity);
}

/*
Checks whether an item is already in a shop user's inventory

@param memberObj: Discord Member object
@param itemObj: Shop Item object

@return : True if item object is already in shop user's inventory. False if not.
*/
function checkIfInInventory(memberObj, itemObj){
    let userObj = getShopUser(memberObj);
    let check = false;
    userObj.inventory.find(inv => {
        if(inv.Item === itemObj.Item) check = true;
    })
    return check
}

/*
If shop item is an fdev item, nothing. If shop item isn't fdev item, add Simbits back to budget

@param quantity: Quantity of said purchase
@param itemObj: Shop Item object
*/
function fDevProcess(quantity, itemObj){
    if(!itemObj.Fdev) return data.budget += (itemObj.Cost * quantity);
    else return;
}

/*
Checks whether a shop user can afford a quantity of an item

@param memberObj: Discord Member object
@param quantity: The quantity the shop user wants to buy
@param itemObj: The Shop Item object

@return: True if the shop user can afford a quantity of an item. False if the shop user cannot.
*/
function canAfford(memberObj, quantity, itemObj){
    let shopUser = getShopUser(memberObj);
    if(shopUser.balance >= (itemObj.Cost * quantity)) return true;
    return false;
}
/*
Checks whether a shop user can afford to donate an ammount of Simbits
@param memberObj: Discord Member object
@param amount: The amount of Simbits they're trying to donate

@return : True if they can donate said amount of Simbits, false if they can't.
*/
function canDonate(memberObj, amount){
    let shopUser = getShopUser(memberObj);
    if (shopUser.balance >= amount) return true;
    return false;
}

function donate(memberObj, amount){
    let shopUser = getShopUser(memberObj);

    shopUser.balance -= amount;
    data.budget += amount;

    fs.writeFileSync("./data/shop/data.json", JSON.stringify(data), (err) => console.log(err));
    return `${memberObj} has donated ${amount} Simbits back into our budget! Lots of :heart: for our ${memberObj}!`
}

function transfer(memberObjGiving, memberObjGetting, amount){
    let shopUserGiving = getShopUser(memberObjGiving);
    let shopUserGetting = getShopUser(memberObjGetting);

    shopUserGiving.balance -= amount;
    shopUserGetting.balance += amount;

    fs.writeFileSync("./data/shop/data.json", JSON.stringify(data), (err) => console.log(err));

    return `${memberObjGiving} has transferred ${amount} Simbits to ${memberObjGetting}.`;

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

function gift(memberObjGiving, memberObjGetting, quantity, itemObj){
    let shopUserGiving = getShopUser(memberObjGiving);
    let shopUserGetting = getShopUser(memberObjGetting);

    if(itemObj.quantity == quantity) {
        let index = shopUserGiving.inventory.indexOf(itemObj);

        if(index > -1){
            shopUserGiving.inventory.splice(index, 1);
    
            fs.writeFileSync("./data/shop/data.json", JSON.stringify(data), (err) => console.log(err));
        }
    } else {
        itemObj.quantity -= quantity;

        fs.writeFileSync("./data/shop/data.json", JSON.stringify(data), (err) => console.log(err));
    }

    if(getItemFromInventory(memberObjGetting, itemObj.Item) === undefined){
        shopUserGetting.inventory.push(
            {
                "Item": itemObj.Item,
                "quantity": quantity
            }
        )
        fs.writeFileSync("./data/shop/data.json", JSON.stringify(data), (err) => console.log(err));
        return `${quantity}x ${itemObj.Item} has been given to ${memberObjGetting}`;
    } else {
        let invItem = getItemFromInventory(memberObjGetting, itemObj.Item);
        invItem.quantity += quantity;
        fs.writeFileSync("./data/shop/data.json", JSON.stringify(data), (err) => console.log(err));
        return `${quantity}x ${itemObj.Item} has been given to ${memberObjGetting}`;
    }

}

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: "User"
};

exports.help = {
    name: "shop",
    category: "Shop",
    description: "Commands to interact with the Simbit Shop.",
    usage: "shop <list/buy/bank>"
};