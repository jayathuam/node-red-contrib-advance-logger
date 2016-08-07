var winston = require('winston');

var logger = new winston.Logger({
    exitOnError: false,
    level: 'info',
    transports: [
        new (winston.transports.Console)({
            colorize: true,
            prettyPrint : true 
        }),
        new (winston.transports.File)(
            {
                filename: 'somefile1.log',
                maxsize: 1073741824,
                maxFiles: 10,
                level: 'info',
                colorize: true,
                handleExceptions: true,
                humanReadableUnhandledException: true,
                json : true,
                zippedArchive : true,                
                prettyPrint : true                                
            })
    ]
});

winston.handleExceptions(new winston.transports.File({ filename: 'exceptions.log' }));

setInterval(function () {
    logger.log('info', 'Hello distributed log files!');
    logger.error('Hello again distributed logs');
    logger.warn("127.0.0.1 - there's no place like home");
}, 30);





