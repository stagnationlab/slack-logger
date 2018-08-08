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
var Bunyan = __importStar(require("bunyan"));
var src_1 = require("../src");
var slackLogger_1 = __importDefault(require("./services/slackLogger"));
// notify of missing configuration
if (!slackLogger_1.default.isEnabled) {
    console.log("no valid configuration exists, please copy .env-example file to .env and modify it's contents to match your Slack integration options");
    process.exit(1);
}
// create bunyan logger
var logger = Bunyan.createLogger({
    name: "server",
    streams: [],
});
// example of using the built-in level message handler to change the logging level at runtime (say "level warn" etc)
slackLogger_1.default.addMessageHandler(new src_1.LevelMessageHandler({
    onLevelChange: function (newLevel) {
        logger.level(newLevel.toLowerCase());
    },
}));
// add the slack log as raw stream
logger.addStream({
    name: "slack",
    level: "info",
    type: "raw",
    stream: slackLogger_1.default,
});
// log an error
logger.error({
    success: false,
    info: {
        firstName: "Jack",
        lastName: "Daniels",
        email: "jack@daniels.com",
    },
    error: new Error("Duplicate email: jack@daniels.com"),
}, "registering user failed");
//# sourceMappingURL=2-example-bunyan.js.map