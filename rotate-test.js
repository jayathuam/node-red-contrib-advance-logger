var winston = require('winston');
require('winston-daily-rotate-file');

var logger = new winston.Logger({
    exitOnError: false,
    level: 'info',
    transports: [
        new (winston.transports.Console)({
            colorize: true,
            prettyPrint : true 
        }),
        new (winston.transports.DailyRotateFile)({
          filename: './test/log',
          datePattern: 'yyyy-MM-dd-HH-mm.',
          prepend: true,
          level: 'info'
        })
    ]
});

winston.handleExceptions(new winston.transports.File({ filename: 'exceptions.log' }));

setInterval(function () {
    logger.log('info', 'Hello distributed log files!');
}, 10000);





