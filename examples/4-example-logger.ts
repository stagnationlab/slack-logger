import logger from "./services/logger";

// use the logger.get(componentName, filename) in each file to log for a specific component
const log = logger.get("register", __filename);

const arr: any[] = [1, "a"];

arr[2] = arr;

// logging message and info separately is recommended as the info gets nicely formatted and message becomes searchable
log.error(
  {
    success: false,
    info: {
      firstName: "Jack",
      lastName: "Daniels",
      email: "jack@daniels.com",
    },
    error: new Error("Duplicate email: jack@daniels.com"),
    loop: arr,
  },
  "registering user failed",
);
