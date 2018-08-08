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
var dotenv = __importStar(require("dotenv"));
var src_1 = __importDefault(require("../../src"));
dotenv.config();
// configuration
var config = {
    token: process.env.TOKEN || "",
    channel: process.env.CHANNEL,
    iconUrl: process.env.ICON_URL,
    name: process.env.NAME,
};
// create the logger instance
var slackLog = new src_1.default({
    version: "1.4.2",
    channel: config.channel,
    iconUrl: config.iconUrl,
    token: config.token,
    name: config.name,
});
exports.default = slackLog;
//# sourceMappingURL=slackLogger.js.map