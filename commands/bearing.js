exports.run = async(client, message, [origLat, origLong, destLat, destLong]) => {
    let heading = calculateBearing(origLat, origLong, destLat, destLong)

    message.channel.send('**Origin** Coords: lat: ' + origLat + ' long: ' + origLong + '\n' + '**Destination** Coords: lat: ' + destLat + ' long: ' + destLong + '\n\n' + 'Set your compass to ' + heading + ' degrees, CMDR!') 
}

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ["heading"],
    permLevel: "User"
};

exports.help = {
    name: "heading",
    category: "Elite",
    description: "Calculate heading on planet surface",
    usage: "heading <current lat> <current long> <destination lat> <destination long>",
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
