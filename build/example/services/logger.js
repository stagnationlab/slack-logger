"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var src_1 = require("../../src");
var slackLog_1 = __importDefault(require("./slackLog"));
// the provided logger class is a small abstraction on top of Bunyan that provides a get() method that sets the
// component name
var logger = new src_1.Logger();
// register the slack log as a raw bunyan stream (you can add additional streams for console, file log etc)
logger.addStream({
    name: "slack",
    level: "info",
    type: "raw",
    stream: slackLog_1.default,
});
// register level change handler (say "level warn" to change the logging level to warn etc)
slackLog_1.default.addMessageHandler(new src_1.LevelMessageHandler({
    onLevelChange: function (newLevel) {
        logger.setLevel(newLevel);
    },
}));
// example of adding a custom message handler
slackLog_1.default.addMessageHandler({
    getName: function () { return "test"; },
    getDescription: function () { return "triggers some log messages for testing changing log level"; },
    handleMessage: function (_message, _logger) {
        var log = logger.get("test");
        log.info("info message");
        log.warn("warn message");
        log.error("error message");
    },
});
// export the logger instance
exports.default = logger;
//# sourceMappingURL=logger.js.map