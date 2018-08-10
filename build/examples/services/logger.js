"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
var _this = this;
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
    handleMessage: function (_message, _logger) { return __awaiter(_this, void 0, void 0, function () {
        var log;
        return __generator(this, function (_a) {
            log = logger.get("test", __filename);
            log.info("info message");
            log.warn("warn message");
            log.error("error message");
            return [2 /*return*/];
        });
    }); },
});
// example of adding a custom message handler
slackLogger_1.default.addMessageHandler({
    getName: function () { return "restart"; },
    getDescription: function () { return "restarts the application"; },
    handleMessage: function (_message, log) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            log.post("restarting the application..");
            return [2 /*return*/];
        });
    }); },
});
// export the logger instance
exports.default = logger;
//# sourceMappingURL=logger.js.map