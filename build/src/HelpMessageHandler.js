"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var HelpMessageHandler = /** @class */ (function () {
    function HelpMessageHandler() {
    }
    HelpMessageHandler.prototype.getName = function () {
        return "help";
    };
    HelpMessageHandler.prototype.getDescription = function () {
        return "provides help about available commands";
    };
    HelpMessageHandler.prototype.handleMessage = function (_message, logger) {
        var messageHandlers = logger.getMessageHandlers();
        var response = messageHandlers
            .map(function (messageHandler, index) { return index + 1 + ". *" + messageHandler.getName() + ":* " + messageHandler.getDescription(); })
            .join("\n");
        logger.post(response);
    };
    return HelpMessageHandler;
}());
exports.default = HelpMessageHandler;
//# sourceMappingURL=HelpMessageHandler.js.map