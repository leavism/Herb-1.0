exports.run = async(client, message, args) => {

    try {
        var origLat = args[0].replace("_", "-");
        var origLong = args[1].replace("_","-");
        var destLat = args[2].replace("_","-");
        var destLong = args[3].replace("_","-");
    } catch (error){
        return message.reply("Please use _ (underscore) in place of the negative sign.\n\nFor example: ``?heading _10 41 _20 290``")
    }
    
    if(origLat && origLong && destLat && destLong && !isNumber([origLat, origLong, destLat, destLong])) {
        let heading = calculateBearing(origLat, origLong, destLat, destLong)

        message.channel.send('**Origin Coords**:\nLat: ' + origLat + ' **|** Long: ' + origLong + '\n' + '**Destination Coords**:\nLat: ' + destLat + ' **|** Long: ' + destLong + '\n\n' + 'Set your compass to ' + heading + ' degrees, CMDR!') 
    } else {
        // console.log(origLat)
        message.reply("Include the origin longitude and latitude, along with the destination longitude and latitude. Use _ (underscore) in place of negative signs. For example:\n``?heading 20 _41 10 _170``");
    }
}

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ["bearing"],
    permLevel: "User"
};

exports.help = {
    name: "heading",
    category: "Elite",
    description: "Calculate heading on planet surface",
    usage: "?heading <current lat> <current long> <destination lat> <destination long>",
    example: ["?heading 20 -41 17 260", "?heading 41 -20 173 130"]
};

function calculateBearing(oLat, oLong, dLat, dLong){
		
    var orLat = oLat * Math.PI/180;
    var orLong = oLong * Math.PI/180;
    var deLat = dLat * Math.PI/180;
    var deLong = dLong * Math.PI/180;
    var deltaLon = deLong - orLong;
    var deltaLat = Math.log(Math.tan(Math.PI/4 + deLat/2)/Math.tan(Math.PI/4 + orLat/2));
    var initialBearing = (Math.atan2(deltaLon, deltaLat)) * (180/Math.PI);


    if (initialBearing < 0) {
        initialBearing = 360 + initialBearing;
    }

    initialBearing = Math.round(initialBearing);
    return(initialBearing)
}

function isNumber(arrayOfNumbers) {
    arrayOfNumbers.forEach(number => {
        if(isNaN(number)) return false;
    })
    return true;
}