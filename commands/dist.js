const Promise = require("bluebird");
const request = require('request');

exports.run = async (client, message, args, level) => {
    let argu = ""
    for(var i = 0; i < args.length; i++){
        if(i == args.length-1) argu += args[i];
        else if(args[i] === ", ") argu += args[i];
        else argu += args[i] + " ";
    }

    let systems = argu.split(", ")
    let sysArray = []

    return Promise.map(systems, fetch).then((i) => {
      i.forEach(function(line) {
        sysArray.push(line)
      })
      let x1 = sysArray[0].x,
          y1 = sysArray[0].y,
          z1 = sysArray[0].z;

      let x2 = sysArray[1].x,
          y2 = sysArray[1].y,
          z2 = sysArray[1].z;

      let x = x2 - x1,
          y = y2 - y1,
          z = z2 - z1;

      let distance = Math.sqrt(x * x + y * y + z * z);
      distance = distance.toFixed(2);
      message.channel.send(`The distance between ${sysArray[0].name} and ${sysArray[1].name} is **${distance}**LY`);
    })
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["dist"],
    permLevel: "User"
};

exports.help = {
    name: "distance",
    category: "Elite",
    description: "Gets the distance between two systems.",
    usage: "distance <system name>, <system name>",
    example: ["?dist nu tauri, 45 tauri", "?dist LHS 3447, Sol"]
};

function fetch(system) {
    return download(system)
      .then(wrap)
  }
  
  function wrap(data){
    return system = {
      name : data.name,
      x: data.coords.x,
      y: data.coords.y,
      z: data.coords.z
    }
  }
  
  function download(system) {
    let systemLink = system.replace('+','%2B').replace(' ', '+');
    let uri = `https://www.edsm.net/api-v1/system?sysname=${systemLink}&coords=1`;
    return new Promise(function(resolve, reject) {
      request(uri, function(err, response, body) {
        if (err) return reject(err)
        if (response.statusCode != 200) return reject(new Error(body))
        // if (body.length <= 2 ) return reject(new Error('Inputs were incorrect or it is not in the EDSM database.'))
        try {
          resolve(JSON.parse(body))
        }
        catch (err) {
          console.log("There was an error.");
        }
  
      })
    })
  }