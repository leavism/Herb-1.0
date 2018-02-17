const fs = require("fs");

const data = require("../data/stats/data.json");

module.exports = (client, member) => {
    data.totalLeft++;

    //Saving the count
    fs.writeFileSync("./data/stats/data.json", JSON.stringify(data), (err) => console.log(err));
};