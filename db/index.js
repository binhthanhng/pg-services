var mongoose = require('mongoose');
var dbConfig = require('../config').dbConfig;
var logger = require('morgan');
mongoose.set('strictQuery', true);
const options = {
    // Don't build indexes
    //autoIndex: true,
     //autoReconnect: true,
    // reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
    // reconnectInterval: 500, // Reconnect every 500ms
    // // Maintain up to 10 socket connections
    // poolSize: 30,
    // // If not connected, return errors immediately rather than waiting for reconnect
    // bufferMaxEntries: 0,
    // //bufferCommands: false,
    // useNewUrlParser: true, 
    dbName: dbConfig.dbname
};

// connect
mongoose.connect(dbConfig.url, options).then(
    (mg) => {
        /** ready to use. The `mongoose.connect()` promise resolves to undefined. */
        console.log("Database connected successful. " + dbConfig.url);
        logger("Database connected successful. " + dbConfig.url);
        
        /*
        var expireAfterSeconds = 5 * 60; // 5 minutes 
        var db = mg.connection.db;
        db.collection("tasks").createIndex({ "_expireAt": 1 }, { expireAfterSeconds: expireAfterSeconds });
        logger.info(`Index created for tasks. Documents will expired after ${expireAfterSeconds} seconds`);//*/
    },
    err => {
        /** handle initial connection error */
        console.log("Database connect failed. Url: " + dbConfig.url + ". Error: " + err);
        logger("Database connect failed. Url: " + dbConfig.url + ". Error: " + err);
        process.exit(2000);
    }
);

mongoose.set("debug", dbConfig.debug);

