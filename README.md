# node-red-contrib-advance-logger

[![Build status][travis-image]][travis-url] [![NPM version][npm-image]][npm-url]

> A Node-RED Logging node.

[`Advance Logger`](https://www.npmjs.com/package/node-red-contrib-advance-logger) is providing multi transport logging capability (file, console and debug) for Node-Red. 

Advance Logger depend on the file logging library called [`Winston`](https://www.npmjs.com/package/winston). 

Goal of Advance Logger is to be a simple logger for Node-Red.

## Installation

Install `node-red-contrib-advance-logger` using [npm](https://www.npmjs.com/)

```bash
npm install --save node-red-contrib-advance-logger
```

## Features

* Multiple transports (File, Console and Debug)
* Log archiving.
* Log rotating.
* Logging levels.

## Usage

To use the node, launch Node-RED (see [running Node-RED](http://nodered.org/docs/getting-started/running.html) for help getting started).

The input payload should be JSON. 

Any attribute in the payload JSON can be use as the info type logging.

The input payload JSON should have following properties for warning and error logging.

* `warn` – warning loggings
* `error` – error loggings

## Icon credit

The node icon is the [readability](https://materialdesignicons.com/icon/readability) icon from [Material Design Icons](https://materialdesignicons.com) by Austin Andrews [@Templarian](http://twitter.com/Templarian).

## License

MIT © `Jayathu Amarasinghe`

[npm-url]: https://www.npmjs.com/package/node-red-contrib-advance-logger
[npm-image]: https://badge.fury.io/js/node-red-contrib-advance-logger.svg
[travis-url]: https://travis-ci.org/jayathuam/node-red-contrib-advance-logger
[travis-image]: https://travis-ci.org/jayathuam/node-red-contrib-advance-logger.svg?branch=master
