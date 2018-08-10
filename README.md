# Slack logger nodejs library

[![Travis](https://img.shields.io/travis/stagnationlab/slack-logger.svg)](https://travis-ci.org/stagnationlab/slack-logger)
[![Coverage](https://img.shields.io/coveralls/stagnationlab/slack-logger.svg)](https://coveralls.io/github/stagnationlab/slack-logger)
[![Downloads](https://img.shields.io/npm/dm/slack-logger.svg)](http://npm-stat.com/charts.html?package=slack-logger&from=2018-08-01)
[![Version](https://img.shields.io/npm/v/slack-logger.svg)](http://npm.im/slack-logger)
[![License](https://img.shields.io/npm/l/slack-logger.svg)](http://opensource.org/licenses/MIT)

**Sends pretty formatted messages to a Slack channel.**

![Example](https://raw.githubusercontent.com/stagnationlab/slack-logger/master/examples/example.jpg)

## Installation

This package is distributed via npm

```cmd
npm install slack-logger
```

## Features

- Logs messages to a Slack channel.
- Configurable logging level.
- Pretty prints additional information.
- Support handling messages from the channel.
- Has built-in message handler for setting logging level.
- One can easily add custom message handlers for restarting the server, deploying a new version etc.
- Provides optional console logger that outputs nicely formatted color-coded log info to console.
- Can integrate with any logging solution.
- Works great with [Bunyan](https://github.com/trentm/node-bunyan) but not required.
- Also plays nicely with [Winston](https://github.com/winstonjs/winston).
- Written in [TypeScript](https://www.typescriptlang.org/).
- Includes [100% test coverage](https://coveralls.io/github/stagnationlab/slack-logger).

## Using in your application

Recommended way of using logging and the slack logger in your application is by using the provided Logger class that's a simple abstraction on top of Bunyan for getting component-specific loggers. See the [examples/4-example-logger.ts](https://github.com/stagnationlab/slack-logger/blob/master/examples/4-example-logger.ts) for details.

```typescript
import logger from "./services/logger";

// use the logger.get(componentName, filename) in each file to log for a specific component
const log = logger.get("register", __filename);

// logging message and info separately is recommended as the info gets nicely formatted and message becomes searchable
log.info(
  {
    user: {
      name: "Jack Daniels",
      email: "jack@daniels.com",
    },
  },
  "user was successfully registered",
);
```

## Examples

Take a look at the examples folder. It shows how to use the library for custom manual integrations, using it with Bunyan and Winston and also using the provided Logger class that uses Bunyan.

The examples can be run with `yarn start`. They use a [.env](https://www.npmjs.com/package/dotenv) file for configuration, a `.env-example` file is provided (just copy it to `.env` file and change accordingly). Alternatively is the configuration file does not exist, the `yarn start` script will ask for the details in the console and generates the configuration file.

## Adding custom message handlers

Responding to slack channel messages is as easy as registering a simple handler.

```typescript
// example of adding a custom message handler
slackLog.addMessageHandler({
  getName: () => "restart",
  getDescription: () => "restarts the application",
  handleMessage: (_message, log) => {
    log.post("restarting the application..");

    restart(); // implement this in some way
  },
});
```

## Using the console logger

An optional console logger for Bunyan is provided that outputs the same information formatted nicely for the console.

![Console log](https://raw.githubusercontent.com/stagnationlab/slack-logger/master/examples/console.jpg)

To use this, simply register instance of `ConsoleLog` as a Bunyan stream.

```typescript
import { ConsoleLog } from "slack-logger";

// register the console logger
logger.addStream({
  name: "console",
  level: "info",
  type: "raw",
  stream: new ConsoleLog({
    basePath: path.join(__dirname, "..", ".."), // configure to point to the root of the project
  }),
});
```

## Commands

- `yarn start` to run the examples (prompts for configuration and choice of example).
- `yarn build` to build the production version.
- `yarn test` to run tests without code coverage.
- `yarn coverage` to run tests with code coverage.
- `yarn lint` to lint the codebase.
- `yarn prettier` to run prettier.
- `yarn audit` to run all pre-commit checks (prettier, build, lint, test). Run this before pull requests.