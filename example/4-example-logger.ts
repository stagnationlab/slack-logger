import logger from "./services/logger";

// use the logger.get(componentName, filename) in each file to log for a specific component
const log = logger.get("register", __filename);

// logging message and info seperately is recommended as the info is nicely formatted and message becomes searchable
log.info(
  {
    user: {
      name: "Jack Daniels",
      email: "jack@daniels.com",
    },
  },
  "user was successfully registered",
);

// you can still use multiple components in a single file if needed
logger.get("email").warn("sending registration email failed");
