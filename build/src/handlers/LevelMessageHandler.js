"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var __1 = require("..");
var LevelMessageHandler = /** @class */ (function () {
    function LevelMessageHandler(options) {
        this.options = options;
    }
    LevelMessageHandler.prototype.getName = function () {
        return "level";
    };
    LevelMessageHandler.prototype.getDescription = function () {
        var supportedLevels = this.getSupportedLevels();
        return "changes the default logging level (one of `" + supportedLevels.join("`, `") + "`, for example `level trace`)";
    };
    LevelMessageHandler.prototype.handleMessage = function (message, logger) {
        // split the message text into words and compile list of supported levels
        var tokens = message.text.split(" ");
        var supportedLevels = this.getSupportedLevels();
        // expecting exactly two words
        if (tokens.length !== 2) {
            logger.post("*level* expects the second word to be the new logging level (one of `" + supportedLevels.join("`, `") + "`)");
            return;
        }
        // extract level name from second word
        var levelName = tokens[1];
        // make sure requested level exists
        if (supportedLevels.indexOf(levelName) === -1) {
            logger.post("*level* does not support `" + levelName + "`, expected one of `" + supportedLevels.join("`, `") + "`");
            return;
        }
        var newLevel = __1.LogLevel[levelName.toUpperCase()];
        // call the level change handler
        this.options.onLevelChange(newLevel);
        logger.post("now logging messages with severity of `" + levelName + "` and above");
    };
    LevelMessageHandler.prototype.getSupportedLevels = function () {
        return Object.keys(__1.LogLevel).map(function (level) { return level.toLowerCase(); });
    };
    return LevelMessageHandler;
}());
exports.default = LevelMessageHandler;
//# sourceMappingURL=LevelMessageHandler.js.map