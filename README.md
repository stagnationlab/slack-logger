# Slack logger nodejs library

[![Travis](https://img.shields.io/travis/stagnationlab/slack-logger.svg)](https://travis-ci.org/stagnationlab/slack-logger)
[![Coverage](https://img.shields.io/coveralls/stagnationlab/slack-logger.svg)](https://coveralls.io/github/stagnationlab/slack-logger)
[![Downloads](https://img.shields.io/npm/dm/slack-logger.svg)](http://npm-stat.com/charts.html?package=slack-logger&from=2018-08-01)
[![Version](https://img.shields.io/npm/v/slack-logger.svg)](http://npm.im/slack-logger)
[![License](https://img.shields.io/npm/l/slack-logger.svg)](http://opensource.org/licenses/MIT)

**Slack logger that sends pretty formatted messages to a Slack channel.**

![Example](https://raw.githubusercontent.com/stagnationlab/slack-logger/master/example/example.jpg)

## Installation

This package is distributed via npm

```cmd
npm install slack-logger
```

## Features

- Logs messages to a Slack channel.
- Configurable logging level.
- Pretty prints additional information.
- Can integrate with any logging solution.
- Works great with [Bunyan](https://github.com/trentm/node-bunyan) but not required.
- Also plays nicely with [Winston](https://github.com/winstonjs/winston).
- Written in [TypeScript](https://www.typescriptlang.org/).
- Includes [100% test coverage](https://coveralls.io/github/stagnationlab/slack-logger).

## Commands

- `yarn start` to run the examples (prompts for configuration and choice of example).
- `yarn build` to build the production version.
- `yarn test` to run tests without code coverage.
- `yarn coverage` to run tests with code coverage.
- `yarn lint` to lint the codebase.
- `yarn prettier` to run prettier.
- `yarn audit` to run all pre-commit checks (prettier, build, lint, test). Run this before pull requests.