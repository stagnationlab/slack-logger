import * as Bunyan from "bunyan";
import { LevelMessageHandler, LogLevel } from "../src";
import slackLogger from "./services/slackLogger";

// notify of missing configuration
if (!slackLogger.isEnabled) {
  console.log(
    "no valid configuration exists, please copy .env-example file to .env and modify it's contents to match your Slack integration options",
  );

  process.exit(1);
}

// create bunyan logger
const logger = Bunyan.createLogger({
  name: "server",
  streams: [],
});

// example of using the built-in level message handler to change the logging level at runtime (say "level warn" etc)
slackLogger.addMessageHandler(
  new LevelMessageHandler({
    onLevelChange: (newLevel: LogLevel) => {
      logger.level(newLevel.toLowerCase() as Bunyan.LogLevel);
    },
  }),
);

// add the slack log as raw stream
logger.addStream({
  name: "slack",
  level: "info",
  type: "raw",
  stream: slackLogger,
});

// log an error
logger.error(
  {
    success: false,
    info: {
      firstName: "Jack",
      lastName: "Daniels",
      email: "jack@daniels.com",
    },
    error: new Error("Duplicate email: jack@daniels.com"),
  },
  "registering user failed",
);
