"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColorGroup = exports.LogLevel = void 0;
var ansi_styles_1 = __importDefault(require("ansi-styles"));
var chalk_1 = __importDefault(require("chalk"));
var yaml = __importStar(require("js-yaml"));
var moment_1 = __importDefault(require("moment"));
var path = __importStar(require("path"));
var stream_1 = require("stream");
var LogLevel;
(function (LogLevel) {
    LogLevel["TRACE"] = "trace";
    LogLevel["DEBUG"] = "debug";
    LogLevel["INFO"] = "info";
    LogLevel["WARN"] = "warn";
    LogLevel["ERROR"] = "error";
    LogLevel["FATAL"] = "fatal";
})(LogLevel || (exports.LogLevel = LogLevel = {}));
var ColorGroup;
(function (ColorGroup) {
    ColorGroup[ColorGroup["NAME"] = 0] = "NAME";
    ColorGroup[ColorGroup["COMPONENT"] = 1] = "COMPONENT";
})(ColorGroup || (exports.ColorGroup = ColorGroup = {}));
var ConsoleLog = /** @class */ (function (_super) {
    __extends(ConsoleLog, _super);
    function ConsoleLog(options) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this) || this;
        // mapping from component name to color index
        _this.groupColorIndexMap = {};
        _this.groupColorMap = {};
        _this.options = __assign({ namePadding: 20, componentPadding: 20, filenamePadding: 30, showUserData: true, showError: true, whitelist: [], blacklist: [], dateFormat: "HH:mm:ss", messageFormat: "%time %level %filename %component %message", basePath: path.join(__dirname, "..", "..") }, options);
        return _this;
    }
    ConsoleLog.formatUserData = function (data) {
        // render user data as yaml making it easier to read by humans
        var formattedData = yaml.dump(data, {
            skipInvalid: true,
            // noRefs: true,
            noCompatMode: true,
        });
        return chalk_1.default.gray(formattedData);
    };
    ConsoleLog.pad = function (str, padding) {
        if (padding === void 0) { padding = 20; }
        var padLength = Math.max(padding - str.length, 0);
        var result = new Array(padLength + 1).join(" ") + str;
        // make sure the total length does not succeed the requested padding
        if (result.length > padding) {
            result = "..".concat(result.substring(result.length - padding + 2));
        }
        return result;
    };
    ConsoleLog.formatLevel = function (level) {
        // format level text and background color
        var levelName = ConsoleLog.levelNameMap[level];
        var _a = ConsoleLog.levelColorMap[levelName], levelBgColor = _a[0], levelTextColor = _a[1];
        var renderedLevelName = " ".concat(levelName.toUpperCase(), " ");
        var levelPadding = 7;
        return "".concat(levelBgColor.open).concat(levelTextColor.open).concat(ConsoleLog.pad(renderedLevelName, levelPadding)).concat(levelTextColor.close).concat(levelBgColor.close);
    };
    ConsoleLog.prototype.write = function (data) {
        var message = this.formatMessage(data);
        if (message !== undefined) {
            this.emit("data", message);
        }
        // write to standard output
        process.stdout.write("".concat(message, "\n"));
        return true;
    };
    // public end(): boolean {
    //   this.emit("end");
    //   return true;
    // }
    ConsoleLog.prototype.formatMessage = function (data) {
        var name = data.name, component = data.component, level = data.level, msg = data.msg, time = data.time, hostname = data.hostname, pid = data.pid, v = data.v, version = data.version, err = data.err, err2 = data.error, filename = data.filename, src = data.src, userData = __rest(data, ["name", "component", "level", "msg", "time", "hostname", "pid", "v", "version", "err", "error", "filename", "src"]);
        // use component as the filtered name if exists, name otherwise
        var filteredName = component || name;
        var error = err || err2;
        // filter by whitelist
        if (Array.isArray(this.options.whitelist) &&
            this.options.whitelist.length > 0 &&
            this.options.whitelist.indexOf(filteredName) === -1) {
            return undefined;
        }
        // filter by blacklist
        if (Array.isArray(this.options.blacklist) &&
            this.options.blacklist.length > 0 &&
            this.options.blacklist.indexOf(filteredName) !== -1) {
            return undefined;
        }
        // use the src with filename and line if available (dev only)
        var filenameToFormat = src ? "".concat(src.file, ":").concat(src.line) : filename;
        // format values
        var formattedTime = (0, moment_1.default)(time).format(this.options.dateFormat);
        var formattedLevel = ConsoleLog.formatLevel(level);
        var formattedName = this.formatName(name);
        var formattedComponent = this.formatComponent(component !== undefined ? component : "n/a");
        var formattedFilename = this.formatFilename(this.options.basePath, filenameToFormat);
        // tokens available for building the log message
        var tokensMap = {
            time: formattedTime,
            level: formattedLevel,
            name: formattedName,
            component: formattedComponent,
            filename: formattedFilename,
            message: msg,
            hostname: hostname,
            pid: pid,
            version: version,
            v: v,
        };
        // replace the tokens in the message format
        var tokenNames = Object.keys(tokensMap);
        var message = tokenNames.reduce(function (formattedMessage, tokenName) {
            var regexp = new RegExp("%".concat(tokenName), "g");
            var replacement = tokensMap[tokenName];
            return formattedMessage.replace(regexp, replacement);
        }, "".concat(this.options.messageFormat, "\n"));
        // append error if exists and enabled
        if (this.options.showError && error) {
            if (error.stack) {
                message += "".concat(chalk_1.default.bgRed(chalk_1.default.white(error.stack)), "\n");
            }
            // handle details from DetailedError
            if (error.details) {
                message += "".concat(ConsoleLog.formatUserData(error.details), "\n");
            }
        }
        // append user data if exists and enabled
        if (this.options.showUserData && Object.keys(userData).length > 0) {
            message += "".concat(ConsoleLog.formatUserData(userData), "\n");
        }
        return message;
    };
    ConsoleLog.prototype.getColor = function (group, name) {
        var id = "".concat(group, ".").concat(name);
        var escapeCodePair = this.groupColorMap[id];
        // return the color if already exists
        if (escapeCodePair !== undefined) {
            return escapeCodePair;
        }
        var groupColorIndex = this.groupColorIndexMap[group];
        // create color index map entry if does not already exist
        if (groupColorIndex === undefined) {
            groupColorIndex = 0;
            this.groupColorIndexMap[group] = groupColorIndex;
        }
        // pick next color from the list, start over if out of new ones
        var color = ConsoleLog.componentColors[groupColorIndex];
        this.groupColorIndexMap[group] = (groupColorIndex + 1) % ConsoleLog.componentColors.length;
        this.groupColorMap[id] = color;
        return color;
    };
    ConsoleLog.prototype.formatName = function (name) {
        var color = this.getColor(ColorGroup.NAME, name);
        return "".concat(color.open).concat(ConsoleLog.pad(name, this.options.namePadding)).concat(color.close);
    };
    ConsoleLog.prototype.formatComponent = function (component) {
        var color = this.getColor(ColorGroup.COMPONENT, component);
        return "".concat(color.open).concat(ConsoleLog.pad(component, this.options.componentPadding)).concat(color.close);
    };
    ConsoleLog.prototype.formatFilename = function (basePath, filename) {
        return ConsoleLog.pad(path.relative(basePath, filename).replace(/\\/g, "/"), this.options.filenamePadding);
    };
    // order of colors to use for component names
    ConsoleLog.componentColors = [
        ansi_styles_1.default.green,
        ansi_styles_1.default.green,
        ansi_styles_1.default.magenta,
        ansi_styles_1.default.cyan,
        ansi_styles_1.default.red,
        ansi_styles_1.default.blue,
        ansi_styles_1.default.white,
        ansi_styles_1.default.yellow,
        ansi_styles_1.default.gray,
    ];
    // level background colors map
    ConsoleLog.levelColorMap = (_a = {},
        _a[LogLevel.FATAL] = [ansi_styles_1.default.bgMagenta, ansi_styles_1.default.white],
        _a[LogLevel.ERROR] = [ansi_styles_1.default.bgRed, ansi_styles_1.default.white],
        _a[LogLevel.WARN] = [ansi_styles_1.default.bgYellow, ansi_styles_1.default.black],
        _a[LogLevel.INFO] = [ansi_styles_1.default.reset, ansi_styles_1.default.white],
        _a[LogLevel.DEBUG] = [ansi_styles_1.default.bgCyan, ansi_styles_1.default.black],
        _a[LogLevel.TRACE] = [ansi_styles_1.default.bgBlack, ansi_styles_1.default.white],
        _a);
    // numeric level names map
    ConsoleLog.levelNameMap = {
        10: LogLevel.TRACE,
        20: LogLevel.DEBUG,
        30: LogLevel.INFO,
        40: LogLevel.WARN,
        50: LogLevel.ERROR,
        60: LogLevel.FATAL,
    };
    return ConsoleLog;
}(stream_1.Transform));
exports.default = ConsoleLog;
//# sourceMappingURL=ConsoleLog.js.map