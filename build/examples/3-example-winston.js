"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var winston = __importStar(require("winston"));
var slackLogger_1 = __importDefault(require("./services/slackLogger"));
// notify of missing configuration
if (!slackLogger_1.default.isEnabled) {
    console.log("no valid configuration exists, please copy .env-example file to .env and modify it's contents to match your Slack integration options");
    process.exit(1);
}
// create bunyan logger
var logger = winston.createLogger();
// add the slack log as raw stream
logger.add(new winston.transports.Stream({ stream: slackLogger_1.default }));
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
//# sourceMappingURL=3-example-winston.js.map