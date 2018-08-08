import { LogLevel } from "../src";
import slackLog from "./services/slackLog";

// notify of missing configuration
if (!slackLog.isEnabled) {
  console.log(
    "no valid configuration exists, please copy .env-example file to .env and modify it's contents to match your Slack integration options",
  );

  process.exit(1);
}

// manually send a log message
slackLog.sendMessage({
  text: "registering user failed",
  component: "example",
  level: LogLevel.ERROR,
  userData: {
    success: false,
    info: {
      firstName: "Jack",
      lastName: "Daniels",
      email: "jack@daniels.com",
    },
  },
  src: {
    file: __filename,
    line: 29,
  },
  hostname: "app-live",
  error: new Error("Duplicate email: jack@daniels.com"),
});
