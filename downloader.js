const https = require('https');
const fs = require('fs');
const path = require('path');

async function downloadFile(url, callback) {

    const fileName = path.basename(url);
    const req = https.get(url, function(res){
    
        const fileStream = fs.createWriteStream(fileName);
        res.pipe(fileStream);
    
        fileStream.on("error", function(err){
            console.log("Error writting to the stream");
            console.log(err);
            });
        
        fileStream.on("finish", function(){
            fileStream.close(callback);
            });
    });
    
    req.on("error", function(err){
        console.log("Error downloading the file");
        console.log(err);
    });
}
module.exports.downloadFile = downloadFile;