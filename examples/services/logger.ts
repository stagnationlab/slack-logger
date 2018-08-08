import { LevelMessageHandler, Logger, LogLevel } from "../../src";
import slackLog from "./slackLog";

// the provided logger class is a small abstraction on top of Bunyan that provides a get() method that sets the
// component name
const logger = new Logger();

// register the slack log as a raw bunyan stream (you can add additional streams for console, file log etc)
logger.addStream({
  name: "slack",
  level: "info",
  type: "raw",
  stream: slackLog,
});

// register level change handler (say "level warn" to change the logging level to warn etc)
slackLog.addMessageHandler(
  new LevelMessageHandler({
    onLevelChange: (newLevel: LogLevel) => {
      logger.setLevel(newLevel);
    },
  }),
);

// example of adding a custom message handler
slackLog.addMessageHandler({
  getName: () => "test",
  getDescription: () => "triggers some log messages for testing changing log level",
  handleMessage: (_message, _logger) => {
    const log = logger.get("test");

    log.info("info message");
    log.warn("warn message");
    log.error("error message");
  },
});

// example of adding a custom message handler
slackLog.addMessageHandler({
  getName: () => "restart",
  getDescription: () => "restarts the application",
  handleMessage: (_message, log) => {
    log.post("restarting the application..");

    // restart();
  },
});

// export the logger instance
export default logger;
