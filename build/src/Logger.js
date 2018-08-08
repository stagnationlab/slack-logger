"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var Bunyan = __importStar(require("bunyan"));
var Logger = /** @class */ (function () {
    function Logger(options) {
        if (options === void 0) { options = { name: "app" }; }
        this.componentLoggers = {};
        this.logger = Bunyan.createLogger(__assign({ streams: [], serializers: Bunyan.stdSerializers }, options));
    }
    Logger.prototype.get = function (component, filename) {
        if (filename === void 0) { filename = ""; }
        // return existing component logger if exists
        var componentLogger = this.componentLoggers[component];
        if (componentLogger) {
            return componentLogger;
        }
        // create a new child component logger
        componentLogger = this.logger.child({
            component: component,
            filename: filename,
        });
        this.componentLoggers[component] = componentLogger;
        return componentLogger;
    };
    Logger.prototype.addStream = function (stream) {
        this.logger.addStream(stream);
    };
    Logger.prototype.addSerializers = function (serializers) {
        this.logger.addSerializers(serializers);
    };
    Logger.prototype.setLevel = function (level) {
        var _this = this;
        var bunyanLevel = level.toLowerCase();
        // set main logger level
        this.logger.level(bunyanLevel);
        // also update component logger levels
        Object.keys(this.componentLoggers).forEach(function (componentLoggerName) {
            var componentLogger = _this.componentLoggers[componentLoggerName];
            if (!componentLogger) {
                return;
            }
            componentLogger.level(bunyanLevel);
        });
    };
    return Logger;
}());
exports.default = Logger;
//# sourceMappingURL=Logger.js.map