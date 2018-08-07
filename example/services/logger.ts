import { Logger } from "../../src";
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

// export the logger instance
export default logger;
