/**
 * create and export configuration variables
 */

 //container for all environments

var environments={
    staging:{
        httpPort:3050,
        envName:"staging",
        httpsPort:3051,
        HashSecretKey:"secret"
    },
    production:{
        httpPort:5050,
        envName:"production",
        httpsPort:5051,
        HashSecretKey:"secret"
    }
}
//staging will be the default environment

//determin which environment was passed as environment

var currentEnvironment=process.env.NODE_ENV ? process.env.NODE_ENV :"staging";

//check if the key exists in above object else default to staging.
var exportEnv=environments[currentEnvironment]?environments[currentEnvironment]:environments["staging"];

module.exports=exportEnv;