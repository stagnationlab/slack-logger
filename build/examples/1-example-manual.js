"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var src_1 = require("../src");
var slackLogger_1 = __importDefault(require("./services/slackLogger"));
// notify of missing configuration
if (!slackLogger_1.default.isEnabled) {
    console.log("no valid configuration exists, please copy .env-example file to .env and modify it's contents to match your Slack integration options");
    process.exit(1);
}
// manually send a log message
slackLogger_1.default.sendMessage({
    text: "registering user failed",
    component: "example",
    level: src_1.LogLevel.ERROR,
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
//# sourceMappingURL=1-example-manual.js.map