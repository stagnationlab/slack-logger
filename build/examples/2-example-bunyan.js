"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
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