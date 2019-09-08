require('express-async-errors');
const winston = require('winston');
//require('winston-mongodb');

module.exports = function(){
    process.on('unhandledRejection' , (ex) => {
        throw ex;
    });
    
    winston.add(new winston.transports.File({
        filename: 'uncaughtException.log',
        handleExceptions: true
    }));
    
    winston.add(new winston.transports.File({ filename: 'logfile.log' }));
    winston.add(new winston.transports.Console);
   // winston.add(new winston.transports.MongoDB({ db : 'mongodb://localhost/vidly',level : 'error'})); 
    
}