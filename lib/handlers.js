//dependencies
var _data = require("./data");
var helpers = require("./helpers");

//define  route handlers
var handlers = {
    SampleHandler: function (Data, Callback) {
        //log the data
        console.log("data in sample handler", Data);
        //callback the http status code and the payload
        Callback(200, { Status: "Success" });
    },
    NotFound: function (Data, Callback) {
        Callback(404);
    },
    PingHandler: function (Data, Callback) {
        Callback(200);
    },
    UserHandler: function (Data, Callback) {
        console.log("insdie handlers");
        var acceptableMethod = ['get', 'post', 'put', 'delete'];
        if (acceptableMethod.indexOf(Data.method) > -1) {
            handlers._user[Data.method](Data, Callback);
        }
        else {
            Callback(405);
        }
    },
    _user: {
        post: function (Data, Callback) {
            //get all parameter values from body
            var firstName = Data.payload.firstName ? Data.payload.firstName : false;
            var lastName = Data.payload.lastName ? Data.payload.lastName : false;
            var phone = (Data.payload.phone && Data.payload.phone.trim().length === 10) ? Data.payload.phone.trim() : false;
            var password = Data.payload.password && typeof (Data.payload.password) == "string" ? Data.payload.password : false;
            var tosAgreement = Data.payload.Tos && typeof (Data.payload.Tos) == "boolean" ? Data.payload.Tos : false;
            if (firstName && lastName && phone && password && tosAgreement) {
                //make sure user doesnt already exist
                _data.read("users", phone, function (error, data) {
                    if (error) {
                        //hash password before storing
                        var hashedPasswrod = helpers.hash(password);
                        if (hashedPasswrod) {
                            //creating the user object.
                            var objUser = {
                                firstName: firstName,
                                lastName: lastName,
                                password: hashedPasswrod,
                                phone: phone,
                                tosAgreement: tosAgreement
                            };

                            //store user info to disk

                            _data.create('users', phone, objUser, function (err) {
                                if (err) {
                                    console.log(err);
                                    Callback(400, err);
                                } else {
                                    Callback(200);
                                }
                            })
                        } else {
                            Callback(400, { Error: "error hashing password." })
                        }


                    } else {
                        Callback(400, { Error: "User Already exists" })
                    }
                });
            } else {
                Callback(400, { Error: "Missing Parameters" });
            }
        },
        get: function (Data, Callback) {
            // @todo only allow authenticated users update object.
            //get parameters from query string
            var phone = Data.objQueryString.phone && Data.objQueryString.phone.length == "10" ? Data.objQueryString.phone : false;
            if (phone) {
                _data.read("users", phone, function (err, data) {
                    if (!err) {
                        //delete the password
                        delete data.password;
                        Callback(200, data);
                    }
                    else {
                        Callback(400, { Error: err });
                    }
                });

            } else {
                Callback(400, { Error: "Missing Parameters" });
            }
        },
        put: function (Data, Callback) {
            //required
            var phone = (Data.payload.phone && Data.payload.phone.trim().length === 10) ? Data.payload.phone.trim() : false;
            //optional
            var firstName = Data.payload.firstName ? Data.payload.firstName : false;
            var lastName = Data.payload.lastName ? Data.payload.lastName : false;
            var password = Data.payload.password && typeof (Data.payload.password) == "string" ? Data.payload.password : false;
console.log("cond",phone);
            if (phone && (firstName || lastName || password)) {
                _data.read("users", phone, function (err, data) {
                    if (!err) {
                        if (firstName) {
                            data.firstName = firstName;
                        }
                        if (lastName) {
                            data.lastName = lastName;
                        }
                        if (password) {
                            data.password = helpers.hash(password);
                        }
                        _data.update("users", phone, data, function (err) {
                            console.log("inside");
                            if (!err) {
                                Callback(200);
                            }
                            else {
                                Callback(500, err);
                            }
                        });
                    } else {
                        Callback(400, { Error: "User Not Found" });
                    }
                });
            }
            else{
                Callback(400,{Error:"Missing Parameters"});
            }
        },
        delete: function (Data, Callback) {
            var phone = Data.objQueryString.phone && Data.objQueryString.phone.length == "10" ? Data.objQueryString.phone : false;
            if (phone) {
                _data.delete("users",phone,function(err){
                  if(!err){
                      Callback(200);
                  }
                  else{
                      Callback(500,{Error:err});
                  }
                })
            }
        }
    }
}

//export the handlers
module.exports = handlers;