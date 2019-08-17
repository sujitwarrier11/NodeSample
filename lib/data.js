/**
 * Library storing and editing data
 */

//dependencies

var fs = require('fs');
var path = require('path');
var helpers=require("./helpers");

var lib = {
    baseDir: path.resolve(__dirname, "../.data/"),
    create: function (dir, file, data, callback) {
        fs.open(`${lib.baseDir+"/" + dir}/${file}.json`, 'wx', function (err, fileDescriptor) {
            if (!err && fileDescriptor) {
                var strData = JSON.stringify(data);
                fs.write(fileDescriptor, strData, function (err) {
                    if (!err) {
                        fs.close(fileDescriptor, function (err) {
                            if (!err) {
                                callback(false);
                            }
                            else {
                                callback({Error:"Error closing file"});
                            }
                        })
                    } else {
                        callback({Error:"Error writing file"});
                    }
                })
            }
            else {
                callback({Error:"User already exists."});
            }
        })
    },
    read: function (dir, file, callback) {
        console.log(`${lib.baseDir + dir}/${file}.json`);
        fs.readFile(`${lib.baseDir}/${dir}/${file}.json`, "utf8", function (err, data) {
            if (!err && data) {
                console.log(data);
                var parsedData=helpers.tryParseToJson(data);
                callback(false, parsedData);
            }
            else {
                callback({Error:"error reading file"});
            }
        });
    },
    update: function (dir, file, data, callback) {
        console.log("update");
        fs.open(`${lib.baseDir}/${dir}/${file}.json`, "r+", function (err, fileDescriptor) {
            console.log("update error",err);
            if (!err && fileDescriptor) {
                var strData = JSON.stringify(data);
                fs.truncate(fileDescriptor, function (err) {
                    if (!err) {
                        fs.writeFile(fileDescriptor, strData, function (err) {
                            if (!err) {
                                fs.close(fileDescriptor, function (err) {
                                    if (!err) {
                                        callback(false);
                                    }
                                    else {
                                        callback({Error:"error closing file"});
                                    }
                                })
                            } else {
                                callback({Error:"error writing file"});
                            }
                        });
                    }
                    else {
                        callback({Error:"error truncating data"});
                    }
                })
            }
            else {
                callback({Error:"File might not exist"});
            }
        });
    },
    delete:function(dir,file,callback){
        fs.unlink(`${lib.baseDir}/${dir}/${file}.json`,function(err){
            if(!err){
                callback(false);
            }
            else{
                callback({Error:"error deleing file"});
            }
        })
    }
};

module.exports = lib;