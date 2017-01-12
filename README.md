# node-red-contrib-advance-logger

[![Build status][travis-image]][travis-url] [![NPM version][npm-image]][npm-url] [![XO code style][codestyle-image]][codestyle-url]

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

Any attribute in the payload JSON can be use as the info type loggings.

The output payload JSON should have following properties for warning and error loggings.

* `warn` – warning loggings
* `error` – error loggings

## Icon credit

The node icon is the [readability](https://materialdesignicons.com/icon/readability) icon from [Material Design Icons](https://materialdesignicons.com) by Austin Andrews [@Templarian](http://twitter.com/Templarian).

## License

MIT © `Jayathu Amarasinghe`

[npm-url]: https://npmjs.org/package/node-red-contrib-readability
[npm-image]: https://badge.fury.io/js/node-red-contrib-readability.svg
[travis-url]: https://travis-ci.org/joakimbeng/node-red-contrib-readability
[travis-image]: https://travis-ci.org/joakimbeng/node-red-contrib-readability.svg?branch=master
[codestyle-url]: https://github.com/sindresorhus/xo
[codestyle-image]: https://img.shields.io/badge/code%20style-XO-5ed9c7.svg?style=flat
