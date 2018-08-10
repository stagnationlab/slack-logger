import * as path from "path";
import { ConsoleLog, LevelMessageHandler, Logger, LogLevel } from "../../src";
import slackLogger from "./slackLogger";

// the provided logger class is a small abstraction on top of Bunyan that provides a get() method that sets the
// component name
const logger = new Logger({
  name: "app",
  src: true, // get sources (don't use in production)
});

// register the slack log as a raw bunyan stream (you can add additional streams for console, file log etc)
logger.addStream({
  name: "slack",
  level: "info",
  type: "raw",
  stream: slackLogger,
});

// also register the provided console logger
logger.addStream({
  name: "console",
  level: "info",
  type: "raw",
  stream: new ConsoleLog({
    basePath: path.join(__dirname, "..", ".."),
  }),
});

// register level change handler (say "level warn" to change the logging level to warn etc)
slackLogger.addMessageHandler(
  new LevelMessageHandler({
    onLevelChange: (newLevel: LogLevel) => {
      logger.setLevel(newLevel);
    },
  }),
);

// example of adding a custom message handler
slackLogger.addMessageHandler({
  getName: () => "test",
  getDescription: () => "triggers some log messages for testing changing log level",
  handleMessage: async (_message, _logger) => {
    const log = logger.get("test", __filename);

    log.info("info message");
    log.warn("warn message");
    log.error("error message");
  },
});

// example of adding a custom message handler
slackLogger.addMessageHandler({
  getName: () => "restart",
  getDescription: () => "restarts the application",
  handleMessage: async (_message, log) => {
    log.post("restarting the application..");

    // restart();
  },
});

// export the logger instance
export default logger;
