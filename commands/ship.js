const stations = require("../data/eddb/stations.json");
const systems = require("../data/eddb/systems_populated.json");
const ships = require("../data/eddb/ships.json");
const Discord = require("discord.js");

exports.run = async(client, message, args) => {
    args = args.join(" ").toLowerCase();
    args = args.split(", ")
    if (args[0] === undefined || args[1] === undefined) return message.reply("Input your ship separated by a comma and a space, followed by the system name.\n``?ship imperial courier, eravate``")
    ship = args[0].trim(), system = args[1].trim();
    system = getSystem(system);
    ship = setShip(ship);
    
    if(ships.ships.lowerCaseAll().indexOf(ship) === -1) return message.reply("That ship doesn't exist. Double check your spelling and make sure you included the right MK.\nFor example: ``?ship courier, nu tauri``")

    if(system === undefined) return message.reply("That system does not exist.\nFor example: ``?ship asp explorer, lhs 3447``");

    let result = []
    let sortedSystems = sortSystems(system)
    result = findShip(sortedSystems, ship, 0, 5, result);

    var embed = new Discord.RichEmbed()
        .setTitle(`${ship.toProperCase()} Sold Closest to ${system.name.toProperCase()}`)
        .setImage(setImage(ship));

    result.forEach(found => {
        let systemName = found.system.name;
        embed.addField(found.system.name + ` [${found.system.primary_economy}] (${distance(found.system, system)}ly from Origin)`, found.station.name + ` (${found.station.distance_to_star}ls from star)`)
    })
    message.channel.send({embed});

  }

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["ships"],
    permLevel: "User"
};

exports.help = {
    name: "ship",
    category: "Elite",
    description: "Looks up where to buy ships.",
    usage: "?ship <ship name>",
    example: ["?ship federal corvette", "?ship corvette", "?ship vette"]
};


function setShip(name){
    switch(name){
        case "sidewinder":
        case "side winder":
        case "side":
            return "sidewinder mk. i";
            break;
        case "eagle":
            return "eagle mk. ii";
            break;
        case "viper 3":
        case "viper iii":
            return "viper mk iii";
            break;
        case "cobra 3":
        case "cobra iii":
            return "cobra mk. iii";
            break;
        case "t6":
        case "type 6":
        case "type-6":
            return "type-6 transporter";
            break;
        case "t7":
        case "type 7":
        case "type-7":
            return "type-7 transporter";
            break;
        case "aspe":
        case "asp e":
        case "asp ex":
        case "aspex":
            return "asp explorer";
            break;
        case "clipper":
        case "imp clipper":
        case "imp. clipper":
            return "imperial clipper";
            break;
        case "dropship":
        case "dropshit":
        case "fed dropship":
        case "fed. dropship":
            return "federal dropship";
            break;
        case "t9":
        case "type 9":
        case "type-9":
            return "type-9 heavy";
            break;
        case "fdl":
        case "fer de lance":
            return "fer-de-lance";
            break;
        case "conda":
        case "ana":
            return "anaconda";
            break;
        case "dbs":
            return "diamondback scout";
            break;
        case "courier":
        case "imp courier":
        case "imp. courier":
            return "imperial courier";
            break;
        case "dbex":
        case "dbe":
            return "diamondback explorer";
            break;
        case "imp eagle":
        case "imp. eagle":
        case "ieagle":
            return "imperial eagle";
            break;
        case "fas":
        case "fed assault ship":
        case "fed. assault ship":
        case "assault ship":
            return "federal assault ship";
            break;
        case "fgs":
        case "fed gunship":
        case "fed gunshit":
        case "fed. gunship":
            return "federal gunship";
            break;
        case "imp cutter":
        case "cutter":
        case "imp. cutter":
        case "icutter":
            return "imperial cutter";
            break;
        case "fed corvette":
        case "vette":
        case "corvette":
        case "fed. corvette":
            return "federal corvette";
            break;
        case "asps":
        case "ascout":
            return "asp scout";
            break;
        case "viper iv":
        case "viper mk. iv":
        case "viper 4":
            return "viper mk iv"
            break;
        case "cobra 4":
        case "cobra mk 4":
        case "cobra mk. 4":
        case "cobra iv":
            return "cobra mk iv";
            break;
        case "beluga":
        case "bel":
            return "beluga liner";
            break;
        case "dolph":
            return "dolphin";
            break;
        case "t10":
        case "type-10":
        case "type 10":
        case "t 10":
            return "type-10 defender";
            break;
        case "chieftain":
        case "chieftian":
        case "cheiftain":
        case "cheiftian":
            return "alliance chieftain";
            break;
        default:
            return name;
            break;
    }
}

function setImage(ship){
    switch(ship){
        case "sidewinder mk. i":
            return "http://edassets.org/img/ship-schematics/prefim/SidewinderMkI_schematic.png";
            break;
        case "eagle mk. ii":
            return "http://edassets.org/img/ship-schematics/prefim/EagleMkII_schematic.png";
            break;
        case "hauler":
            return "http://edassets.org/img/ship-schematics/prefim/Hauler_schematic.png";
            break;
        case "adder":
            return "http://edassets.org/img/ship-schematics/prefim/Adder_schematic.png";
            break;
        case "viper mk iii":
            return "http://edassets.org/img/ship-schematics/prefim/ViperMkIII_schematic.png";
            break;
        case "cobra mk. iii":
            return "http://edassets.org/img/ship-schematics/prefim/CobraMkIII_schematic.png";
            break;
        case "type-6 transporter":
            return "http://edassets.org/img/ship-schematics/prefim/Type-6_schematic.png";
            break;
        case "type-7 transporter":
            return "http://edassets.org/img/ship-schematics/prefim/Type-7_schematic.png";
            break;
        case "asp explorer":
            return "http://edassets.org/img/ship-schematics/prefim/Asp_Explorer_schematic.png";
            break;
        case "vulture":
            return "http://edassets.org/img/ship-schematics/prefim/Vulture_schematic.png";
            break;
        case "imperial clipper":
            return "http://edassets.org/img/ship-schematics/prefim/Imperial_Clipper_schematic.png";
            break;
        case "federal dropship":
            return "http://edassets.org/img/ship-schematics/prefim/Federal_Dropship_schematic.png";
            break;
        case "orca":
            return "http://edassets.org/img/ship-schematics/prefim/Orca_schematic.png";
            break;
        case "type-9 heavy":
            return "http://edassets.org/img/ship-schematics/prefim/Type-9_schematic.png";
            break;
        case "python":
            return "http://edassets.org/img/ship-schematics/prefim/Python_schematic.png";
            break;
        case "fer-de-lance":
            return "http://edassets.org/img/ship-schematics/prefim/Fer-de-Lance_schematic.png";
            break;
        case "anaconda":
            return "http://edassets.org/img/ship-schematics/prefim/Anaconda_schematic.png";
            break;
        case "diamondback scout":
            return "http://edassets.org/img/ship-schematics/prefim/Diamondbacks_schematic.jpg";
            break;
        case "imperial courier":
            return "http://edassets.org/img/ship-schematics/prefim/Imperial_Courier_schematic.png";
            break;
        case "diamonback explorer":
            return "http://edassets.org/img/ship-schematics/prefim/Diamondbackxl_schematic.jpg";
            break;
        case "imperial eagle":
            return "https://vignette.wikia.nocookie.net/elite-dangerous/images/6/68/Imperial_Eagle_in-game.png/revision/latest?cb=20151011111359";
            break;
        case "federal assault ship":
            return "http://www.elite-dangerous-blog.co.uk/image.axd?picture=/codex/federal-assault-ship-iso.png";
            break;
        case "federal gunship":
            return "http://www.elite-dangerous-blog.co.uk/image.axd?picture=/codex/federal-gunship-iso.png";
            break;
        case "imperial cutter":
            return "https://game-guide.fr/wp-content/uploads/2015/11/ED-Cutter-1.jpgg";
            break;
        case "federal corvette":
            return "https://i.gyazo.com/5a83cd8c92ed821e51ba5b3e9295e152.png";
            break;
        case "asp scout":
            return "https://vignette.wikia.nocookie.net/elite-dangerous/images/7/77/Asp_Scout_-_Profile.png/revision/latest?cb=20160507032157";
            break;
        case "viper mk iv":
            return "http://www.elite-dangerous-blog.co.uk/image.axd?picture=/codex/viper-mk4-iso.png";
            break;
        case "keelback":
            return "https://vignette.wikia.nocookie.net/elite-dangerous/images/0/0c/Keelback.PNG/revision/latest/scale-to-width-down/640?cb=20151110231441";
            break;
        case "cobra mk iv":
            return "https://forums.frontier.co.uk/attachment.php?attachmentid=80522&d=1449254508";
            break;
        case "beluga liner":
            return "https://www.georgiaaquarium.org/images/default-source/default-album/gaq-galleries-411x4112970c413cabb6b4c8326ff00008b2be6.jpg?sfvrsn=1";
            break;
        case "dolphin":
            return "http://i.imgur.com/gytCGgu.jpg";
            break;
        case "type-10 defender":
            return "https://i.ytimg.com/vi/ww1jv8kWciQ/maxresdefault.jpg";
            break;
        case "alliance chieftain":
            return "http://www.elite-dangerous-blog.co.uk/image.axd?picture=/codex/chieftain-iso.png";
            break;

    }
}

function getSystem(systemName){
    return systems.find(system => {
        return system.name.toLowerCase() === systemName    
    })
}

function getClosestMN(sortedSystems,m , n){
    return sortedSystems.slice(m, n)
    
}

function sortSystems(systemObj) {
    systems.sort(function(a,b){
        return distance(a, systemObj) - distance(b, systemObj)
    })
    return systems;
}

function distance(systemA, systemB){
    let x1 = systemA.x,
        y1 = systemA.y,
        z1 = systemA.z;

    let x2 = systemB.x,
        y2 = systemB.y,
        z2 = systemB.z;

    let x = x1 - x2,
        y = y1 - y2,
        z = z1 - z2;

    return Math.sqrt(x * x + y * y + z * z).toFixed(2);
}

function getStations(systemObj){
    let result = [];
    stations.find(station => {
        if (station.system_id === systemObj.id && station.selling_ships.length > 0) result.push(station)
    })
    return result;
}

function getSellingShips(stationObj){
    return stationObj.selling_ships.lowerCaseAll();
}

function findShip(sortedSystems, shipName, m, n, result){
    getClosestMN(sortedSystems, m, n).forEach(sys => {
        getStations(sys).forEach(station => {
            if(getSellingShips(station).indexOf(setShip(shipName)) > -1 && result.indexOf({system: sys, station: station}) == -1) result.push({system: sys, station: station})
        })
    })
    if(result.length < 3) return findShip(sortedSystems, shipName, n+1,n + 20, result)
    return result;
}