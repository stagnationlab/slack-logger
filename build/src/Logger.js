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
        this.logger = Bunyan.createLogger(__assign({ streams: [], serializers: Bunyan.stdSerializers }, options));
    }
    Logger.prototype.get = function (component, filename) {
        if (filename === void 0) { filename = ""; }
        return this.logger.child({
            component: component,
            filename: filename,
        });
    };
    Logger.prototype.addStream = function (stream) {
        this.logger.addStream(stream);
    };
    Logger.prototype.addSerializers = function (serializers) {
        this.logger.addSerializers(serializers);
    };
    Logger.prototype.setLevel = function (level) {
        this.logger.level(level.toLowerCase());
    };
    return Logger;
}());
exports.default = Logger;
//# sourceMappingURL=Logger.js.map