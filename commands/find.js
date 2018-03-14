const data = require("../data/find/data.json");
const raw = require("../data/find/raw.json");
const Discord = require("discord.js")

exports.run = async (client, message, [...args], level) => {
    let toFind = args.join(" ").toLowerCase();

    let material = find(toFind)

    if(material){
        let color = setColor(material.type)
        let type = setType(material.type)
        let name = toTitleCase(material.name)
        let where = material.where
        let trader = setTrader(material.type)
        let img = setImg(material.rarity)
        let rarity = material.rarity

        const embed = new Discord.RichEmbed()
            .setTitle(name)
            .setColor(color)
            .setThumbnail(img)
            .addField("Where to find:", where)
            .addField("Material Type:", type)
            .addField("Rarity:", rarity)
            .addField("Closest Trader to Nu Tauri:", trader)

        if(type == "Raw"){
            let numberObj = findId(name)
            if(numberObj){
                let number = numberObj.number
                embed.addField("Eddb.io Prospecting Link:", "https://eddb.io/body?m="+number+"&e=1&p=0&t=0&d=0&r=14759&a=100")
            }
        }
        
        message.channel.send({embed});
    }
    else{
        message.channel.send("No materials found. Maybe you spelled it wrong?")
    }



    
    
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["find"],
    permLevel: "User"
};

exports.help = {
    name: "find",
    category: "Elite",
    description: "Looks up engineering materials.",
    usage: "find Craked Industrial Firmware"
};

function toTitleCase(str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}


function find(mat){
    return data.materials.find(item => {
        return item.name.toLowerCase() === mat.toLowerCase()
    })
}
function findId(name){
    return raw.raws.find(item => {
        return item.name.toLowerCase() === name.toLowerCase()
    })
}


function setTrader(type){
    switch(type){
        case "E":
            return "HR 1257 - Jacobi Platform (6.58Ly)"
            break;
        case "R":
            return "Estae - Cogswell Dock (12.76Ly)"
            break;
        case "M":
            return "Farowalan - Bamford City (13.92Ly)"
            break;
        case "T":
            return "None - ALIENS"
            break;
        case "G":
            return "None - ALIENS"
            break;
        default:
            return "None"
            break;
    }
}

function setImg(rarity){
    switch(rarity){
        case "Standard":
            return "http://edassets.org/img/preview/grade-3.png"
            break;
        case "Common":
            return "http://edassets.org/img/preview/grade-2.png"
            break;
        case "Very Common":
            return "http://edassets.org/img/preview/grade-1.png"
            break;
        case "Rare":
            return "http://edassets.org/img/preview/grade-4.png"
            break;
        case "Very Rare":
            return "http://edassets.org/img/preview/grade-5.png"
            break;
        default:
            return "http://edassets.org/img/preview/NewMaterial.png"
            break;
    }
}

function setColor(type){
    switch(type){
        case "E":
            return "0x942192"
            break;
        case "R":
            return "0x0433ff"
            break;
        case "M":
            return "0xfffb00"
            break;
        case "T":
            return "0x00f900"
            break;
        case "G":
            return "0x0433ff"
            break;
        default:
            return "0xff40ff"
            break;
    }

}

function setType(type){
    switch(type){
        case "E":
            return "Encoded"
            break;
        case "R":
            return "Raw"
            break;
        case "M":
            return "Manufactured"
            break;
        case "T":
            return "Thargoid"
            break;
        case "G":
            return "Guardian"
            break;
        default:
            return "None"
            break;
    }
}




  