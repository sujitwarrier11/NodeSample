const http = require('http');
const https=require('https');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
var config=require('./config');
var fs=require("fs");
var handlers=require("./lib/handlers");
var helpers=require("./lib/helpers");

//unfied server code
function ServerRequestHandler(req, res) {
    //get the url that was requested and parse it
    var parsedUrl = url.parse(req.url, true);

    //get untrimmed path
    var path = parsedUrl.pathname;
    //get trimmed path
    var trimmedPath = path.replace(/^\/+|\/+$/g, '');
    //get the http method
    var method = req.method.toLowerCase();
    //get the query string items
    var objQueryString = parsedUrl.query;
    //get the request headers
    var headers = req.headers;
    //get the payload if any
    var decoder = new StringDecoder("utf8");
    var buffer = '';
    req.on('data', function (data) {
        buffer += decoder.write(data);
    });
    
      //set content-type header
      res.setHeader("Content-Type","application/json");

    req.on('end', function () {
        buffer += decoder.end();
        //log out the payload
        console.log("payload", buffer);

        //use the created router
        var chosenHandler = router[trimmedPath] ? router[trimmedPath] : router.NotFound;

        var data={
            trimmedPath:trimmedPath,
            objQueryString:objQueryString,
            method:method,
            headers:headers,
            payload:helpers.tryParseToJson(buffer)
        }

        chosenHandler(data, function (strCode, objResponse) {
            console.log("status code",strCode);
            //write status code
            res.writeHead(strCode);
            //set content-type header
            
            //return payload if found
            res.end(objResponse ? JSON.stringify(objResponse) : "{}");
        });


    });

    //logging the url paths
    console.log("pathname", path);
    console.log("trimmedPath", trimmedPath);
    //log http method
    console.log("http method", method);
    //log the query string objects
    console.log("query", objQueryString);
    //log the header object
    console.log("headers", headers);
    //send the response

}
const httpServer = http.createServer(ServerRequestHandler);

httpServer.listen(config.httpPort, function () {
    console.log(`${config.envName} server listening on port `+config.httpPort);
});

var httpsServerOptions={
    key:fs.readFileSync("./https/key.pem"),
    cert:fs.readFileSync("./https/cert.pem")
};

const httpsServer = https.createServer(httpsServerOptions,ServerRequestHandler);

httpsServer.listen(config.httpsPort, function () {
    console.log(`${config.envName} server listening on port `+config.httpsPort);
});



// define a request router
var router = {
    'sample': handlers.SampleHandler,
    'NotFound': handlers.NotFound,
    'ping':handlers.PingHandler,
    'users':handlers.UserHandler
};

