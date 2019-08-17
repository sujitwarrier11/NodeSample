var Crypto = require("crypto");
var config = require("../config");


var helpers = {
    hash: function (strKey) {
       return strKey && typeof (strKey) == "string" ? Crypto.createHmac("sha256", config.HashSecretKey).update(strKey).digest("hex") : false;
    },
    tryParseToJson: function (strPayload) {
        try {
            return JSON.parse(strPayload === "" ? "{}" : strPayload);
        } catch (err) {
            return {};
        }
    }
};



module.exports = helpers;