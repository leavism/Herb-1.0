var https = require('https');
var fs = require('fs');


function download(url, dest, cb) {
  var file = fs.createWriteStream(dest);
  var request = https.get(url, function(response) {
    response.pipe(file);
    file.on('finish', function() {
      file.close(cb);  // close() is async, call cb after close completes.
    });
  }).on('error', function(err) { // Handle errors
    fs.unlink(dest); // Delete the file async. (But we don't check the result)
    if (cb) cb(err.message);
  });
};

download("https://eddb.io/archive/v5/systems_populated.json", "./data/eddb/systems_populated.json", console.err);

download("https://eddb.io/archive/v5/stations.json", "./data/eddb/stations.json", console.err);