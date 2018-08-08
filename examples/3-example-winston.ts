import * as winston from "winston";
import slackLogger from "./services/slackLogger";

// notify of missing configuration
if (!slackLogger.isEnabled) {
  console.log(
    "no valid configuration exists, please copy .env-example file to .env and modify it's contents to match your Slack integration options",
  );

  process.exit(1);
}

// create bunyan logger
const logger = winston.createLogger();

// add the slack log as raw stream
logger.add(new winston.transports.Stream({ stream: slackLogger }));

// log simple info message
logger.info("registering new user");

// log detailed error
logger.error({
  message: "registering user failed",
  component: "register",
  userData: {
    success: false,
    info: {
      firstName: "Jack",
      lastName: "Daniels",
      email: "jack@daniels.com",
    },
  },
  error: new Error("Duplicate email: jack@daniels.com"),
});
