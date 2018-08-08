"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var logger_1 = __importDefault(require("./services/logger"));
// use the logger.get(componentName, filename) in each file to log for a specific component
var log = logger_1.default.get("register", __filename);
// logging message and info separately is recommended as the info gets nicely formatted and message becomes searchable
log.info({
    user: {
        name: "Jack Daniels",
        email: "jack@daniels.com",
    },
}, "user was successfully registered");
// you can still use multiple components in a single file if needed
logger_1.default.get("email").warn("sending registration email failed");
//# sourceMappingURL=4-example-logger.js.map