"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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