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
var path = __importStar(require("path"));
var src_1 = require("../../src");
var slackLogger_1 = __importDefault(require("./slackLogger"));
// the provided logger class is a small abstraction on top of Bunyan that provides a get() method that sets the
// component name
var logger = new src_1.Logger({
    name: "app",
    src: true,
});
// register the slack log as a raw bunyan stream (you can add additional streams for console, file log etc)
logger.addStream({
    name: "slack",
    level: "info",
    type: "raw",
    stream: slackLogger_1.default,
});
// also register the provided console logger
logger.addStream({
    name: "console",
    level: "info",
    type: "raw",
    stream: new src_1.ConsoleLog({
        basePath: path.join(__dirname, "..", ".."),
    }),
});
// register level change handler (say "level warn" to change the logging level to warn etc)
slackLogger_1.default.addMessageHandler(new src_1.LevelMessageHandler({
    onLevelChange: function (newLevel) {
        logger.setLevel(newLevel);
    },
}));
// example of adding a custom message handler
slackLogger_1.default.addMessageHandler({
    getName: function () { return "test"; },
    getDescription: function () { return "triggers some log messages for testing changing log level"; },
    handleMessage: function (_message, _logger) {
        var log = logger.get("test", __filename);
        log.info("info message");
        log.warn("warn message");
        log.error("error message");
    },
});
// example of adding a custom message handler
slackLogger_1.default.addMessageHandler({
    getName: function () { return "restart"; },
    getDescription: function () { return "restarts the application"; },
    handleMessage: function (_message, log) {
        log.post("restarting the application..");
        // restart();
    },
});
// export the logger instance
exports.default = logger;
//# sourceMappingURL=logger.js.map