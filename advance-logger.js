module.exports = function (RED) {  
    "use strict";  
    var debuglength = RED.settings.debugMaxLength || 1000;
    var util = require("util");
    var events = require("events");
    function AdvanceLoggerNode(config) {
        var winston = require('winston');
        winston.handleExceptions(new winston.transports.File({ filename: 'exceptions.log' }));
        RED.nodes.createNode(this, config);
        var node = this;
        var filesize = 1048576;
        var maxfiles = 1;
        var archive = false;
        var logType = config.logtype;
        var complete = config.complete;
        var debugLog = config.debug;
        var consoleLog = config.console;
        var fileLog = config.file;
        var logger = null;        

        if (config.maxsize >= 1) {
            filesize = config.maxsize * 1048576;
        }
        if (config.maxFiles >= 1) {
            maxfiles = config.maxFiles;
        }
        if (config.zip === true || config.zip === true) {
            archive = true;
        }
        if (config.zip === false || config.zip === false || config.zip === undefined || config.zip === null) {
            archive = false;
        }

        if (fileLog === true && consoleLog === true) {            
            logger = new winston.Logger({
                exitOnError: false,
                level: logType,
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
                            level: logType,
                            colorize: true,
                            handleExceptions: true,
                            humanReadableUnhandledException: true,
                            json: true,
                            zippedArchive: archive,
                            prettyPrint: true
                        })
                ]
            });
        }
        else if (fileLog === false && consoleLog === true) {            
            logger = new winston.Logger({
                exitOnError: false,
                level: logType,
                transports: [
                    new (winston.transports.Console)({
                        colorize: true,
                        prettyPrint: true
                    })
                ]
            });
        }
        else if (fileLog === true && consoleLog === false) {            
            logger = new winston.Logger({
                exitOnError: false,
                level: logType,
                transports: [
                    new (winston.transports.File)(
                        {
                            filename: config.filename,
                            maxsize: filesize,
                            maxFiles: maxfiles,
                            level: logType,
                            colorize: true,
                            handleExceptions: true,
                            humanReadableUnhandledException: true,
                            json: true,
                            zippedArchive: archive,
                            prettyPrint: true
                        })
                ]
            });
        }

        this.on('input', function (msg) {
            if (logType === "info") {
                if (complete === true || complete === "complete" || complete === "true") {
                    if (debugLog === true || debugLog === "true") {
                        sendDebug({ id: this.id, name: this.name, topic: msg.topic, msg: msg, _path: msg._path });
                    }
                    if (fileLog !== false || consoleLog !== false) {
                        logger.log('info', JSON.stringify(msg));
                    }
                }
                else if (complete !== undefined && complete !== null && complete !== "" && complete !== false && complete !== "false") {
                    if (debugLog === true || debugLog === "true") {
                        sendDebug({ id: this.id, name: this.name, topic: msg.topic, msg: msg[complete], _path: msg._path });
                    }
                    if (fileLog !== false || consoleLog !== false) {
                        logger.log('info', JSON.stringify(msg));
                    }
                }
            }

            if (msg.hasOwnProperty('error')) {                
                if (debugLog === true || debugLog === "true") {
                    sendDebug({ id: this.id, name: this.name, topic: msg.topic, msg: msg.error, _path: msg._path });
                }
                if (fileLog !== false || consoleLog !== false) {
                    logger.log('error', JSON.stringify(msg.error));
                }
            }

            if (msg.hasOwnProperty('warn')) {                
                if (debugLog === true || debugLog === "true") {
                    sendDebug({ id: this.id, name: this.name, topic: msg.topic, msg: msg.warn, _path: msg._path });
                }
                if (fileLog !== false || consoleLog !== false) {
                    logger.log('warn', JSON.stringify(msg.warn));
                }
            }

        });
    }
    function sendDebug(msg) {
        if (msg.msg instanceof Error) {
            msg.format = "error";
            msg.msg = msg.msg.toString();
        } else if (msg.msg instanceof Buffer) {
            msg.format = "buffer [" + msg.msg.length + "]";
            msg.msg = msg.msg.toString('hex');
        } else if (msg.msg && typeof msg.msg === 'object') {
            var seen = [];
            try {
                msg.format = msg.msg.constructor.name || "Object";
            } catch (err) {
                msg.format = "Object";
            }
            var isArray = util.isArray(msg.msg);
            if (isArray) {
                msg.format = "array [" + msg.msg.length + "]";
            }
            if (isArray || (msg.format === "Object")) {
                msg.msg = JSON.stringify(msg.msg, function (key, value) {
                    if (typeof value === 'object' && value !== null) {
                        if (seen.indexOf(value) !== -1) { return "[circular]"; }
                        seen.push(value);
                    }
                    return value;
                }, " ");
            } else {
                try { msg.msg = msg.msg.toString(); }
                catch (e) { msg.msg = "[Type not printable]"; }
            }
            seen = null;
        } else if (typeof msg.msg === "boolean") {
            msg.format = "boolean";
            msg.msg = msg.msg.toString();
        } else if (typeof msg.msg === "number") {
            msg.format = "number";
            msg.msg = msg.msg.toString();
        } else if (msg.msg === 0) {
            msg.format = "number";
            msg.msg = "0";
        } else if (msg.msg === null || typeof msg.msg === "undefined") {
            msg.format = (msg.msg === null) ? "null" : "undefined";
            msg.msg = "(undefined)";
        } else {
            msg.format = "string [" + msg.msg.length + "]";
            msg.msg = msg.msg;
        }

        if (msg.msg.length > debuglength) {
            msg.msg = msg.msg.substr(0, debuglength) + " ....";
        }
        RED.comms.publish("debug", msg);
    }

    RED.nodes.registerType("logger", AdvanceLoggerNode);
};
