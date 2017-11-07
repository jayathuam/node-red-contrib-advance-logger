module.exports = function (RED) {
  "use strict";
  var debuglength = RED.settings.debugMaxLength || 1000;
  var util = require("util");
  require('winston-daily-rotate-file');

  function AdvanceLoggerNode(config) {
    var winston = require('winston');
    winston.handleExceptions(new winston.transports.File({filename: 'exceptions.log'}));
    RED.nodes.createNode(this, config);
    var logger = null;
    var prefix = config.prefix;
    var fileLog = true;
    var consoleLog = config.console;
    var debugLog = config.debug;
    var complete = config.complete;
    var datePattern = config.datePattern || 'YYYY-MM-dd.';
    var logType = config.logtype;
    var transports = [];

    transports.push(new (winston.transports.DailyRotateFile)({
        filename: prefix,
        datePattern: datePattern,
        prepend: true,
        json: false
      })
    );

    if (consoleLog) {
      transports.push(new (winston.transports.Console)({
        colorize: true,
        prettyPrint: true
      }));
    }

    logger = new winston.Logger({
      exitOnError: false,
      level: logType,
      transports: transports
    });

    this.on('input', function (msg) {
      if (logType === "info") {
        if (complete === true || complete === "complete" || complete === "true") {
          if (debugLog === true || debugLog === "true") {
            sendDebug({id: this.id, name: this.name, topic: msg.topic, msg: msg, _path: msg._path});
          }
          if (fileLog !== false || consoleLog !== false) {
            logger.log('info', JSON.stringify(msg));
          }
        }
        else if (complete !== undefined && complete !== null && complete !== "" && complete !== false && complete !== "false") {
          if (debugLog === true || debugLog === "true") {
            sendDebug({id: this.id, name: this.name, topic: msg.topic, msg: msg[complete], _path: msg._path});
          }
          if (fileLog !== false || consoleLog !== false) {
            logger.log('info', JSON.stringify(msg));
          }
        }
      }

      if (msg.hasOwnProperty('error')) {
        if (debugLog === true || debugLog === "true") {
          sendDebug({id: this.id, name: this.name, topic: msg.topic, msg: msg.error, _path: msg._path});
        }
        if (fileLog !== false || consoleLog !== false) {
          logger.log('error', JSON.stringify(msg.error));
        }
      }

      if (msg.hasOwnProperty('warn')) {
        if (debugLog === true || debugLog === "true") {
          sendDebug({id: this.id, name: this.name, topic: msg.topic, msg: msg.warn, _path: msg._path});
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
            if (seen.indexOf(value) !== -1) {
              return "[circular]";
            }
            seen.push(value);
          }
          return value;
        }, " ");
      } else {
        try {
          msg.msg = msg.msg.toString();
        }
        catch (e) {
          msg.msg = "[Type not printable]";
        }
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

  RED.nodes.registerType("rotate-logger", AdvanceLoggerNode);
};