module.exports = function (RED) {
    function AdvanceLoggerNode(config) {
        var winston = require('winston');
        winston.handleExceptions(new winston.transports.File({ filename: 'exceptions.log' }));

        RED.nodes.createNode(this, config);
        var node = this;
        var filesize =1073741824;
        var maxfiles = 1;
        if (config.maxsize >= 1) {
            filesize = config.maxsize*1073741824;
        }
        if (config.maxFiles >= 1) {
            maxfiles = config.maxFiles;
        }
        var logger = new winston.Logger({
            exitOnError: false,
            level: 'info',
            transports: [
                new (winston.transports.Console)({
                    colorize: true,
                    prettyPrint: true
                }),
                new (winston.transports.File)(
                    {
                        filename: config.filename,
                        maxsize: filesize,
                        maxFiles: maxfiles,
                        level: 'info',
                        colorize: true,
                        handleExceptions: true,
                        humanReadableUnhandledException: true,
                        json: true,
                        zippedArchive: true,
                        prettyPrint: true
                    })
            ]
        });
        this.on('input', function (msg) {
            logger.log('info', JSON.stringify(msg));
        });
    }
    RED.nodes.registerType("logger", AdvanceLoggerNode);
}