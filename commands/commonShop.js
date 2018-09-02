const data = require("../data/shop/data.json");
const cTable = require('console.table');
const fs = require("fs");
const Discord = require("discord.js")


module.exports = {
    isWholePositiveNumber: function (number) {
        return number % 1 === 0 && number > 0;
    },

    /*
    Checks if a Discord member already has a Simbit shop account
     
    @param memberObj : Discord Member object
     
    @return : true if Discord member already has a Simbit shop account, false if Discord member doesn't have a Simbit shop account.
    */
    checkAcc: function (memberObj) {
        if (getShopUser(memberObj) != null) {
            return true;
        }
        return false;
    },

    /*
    Makes a Simbit shop account for a Discord member
     
    @param memberObj : Discord Member object
     
    @return : void
    */
    mkAcc: function (memberObj) {
        data["users"].push(
            {
                "id": memberObj.user.id.toString(),
                "name": memberObj.user.username,
                "balance": 0,
                "inventory": []
            }
        )
        return fs.writeFileSync("./data/shop/data.json", JSON.stringify(data), (err) => console.log(err));
    },

    /*
    Gets the Simbit account
     
    @param memberObj : Discord Member object
     
    @return : Simbit shop account
    */
    getShopUser: function (memberObj) {
        return data.users.find(user => {
            return user.id === memberObj.user.id.toString();
        })
    },

    /*
    Awards a Shop User an amount of Simbits. There's no limit to how many Simbits
     
    @param memberObj: Discord Member object
    @param amount: The amount of Simbits to award.
     
    @return: A string message if successful
    */
    award: function (memberObj, amount) {
        let shopUser = getShopUser(memberObj);

        shopUser.balance += amount;
        data.budget -= amount;

        fs.writeFileSync("./data/shop/data.json", JSON.stringify(data), (err) => console.log(err));

        return `:confetti_ball:  ${memberObj} has earned ${amount} Simbits! :confetti_ball: `
    },
    /*
    Deducts a Shop User an amount of Simbits. Can't deduct if their balance isn't enough to deduct from
     
    @param memberObj: Discord Member object
    @param amount: The amount of Simbits to deduct
     
    @return: A string message if successful
    */
    deduct: function (memberObj, amount) {
        let shopUser = getShopUser(memberObj);

        shopUser.balance -= amount;
        data.budget += amount;

        fs.writeFileSync("./data/shop/data.json", JSON.stringify(data), (err) => console.log(err));

        return `${memberObj} has had ${amount} Simbits deducted from them and added back to the budget.`
    }
}
