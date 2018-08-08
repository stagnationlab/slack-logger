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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var chalk_1 = __importDefault(require("chalk"));
var fs = __importStar(require("fs"));
var inquirer_1 = __importDefault(require("inquirer"));
var path = __importStar(require("path"));
(function () { return __awaiter(_this, void 0, void 0, function () {
    var dotEnvFilename, dotEnvExists, _a, token, channel, name, iconUrl, dotEnvContents, exampleName, filename;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                dotEnvFilename = path.join(__dirname, "..", "..", ".env");
                dotEnvExists = fs.existsSync(dotEnvFilename);
                if (!!dotEnvExists) return [3 /*break*/, 2];
                // notify of the configuration file being missing
                console.log(chalk_1.default.bgWhite.black("\nThe .env configuration file does not exist (checked " + dotEnvFilename + ")"));
                console.log(chalk_1.default.bgWhite.black("Please create one based on .env-example or answer the questions below and it will be created for you\n"));
                return [4 /*yield*/, inquirer_1.default.prompt([
                        {
                            name: "token",
                            message: "Please enter your slack integration API token",
                            type: "input",
                        },
                        {
                            name: "channel",
                            message: "Please enter channel name to post to (make sure to add the bot to this channel)",
                            type: "input",
                            default: "general",
                        },
                        {
                            name: "name",
                            message: "Please enter the slack logger name",
                            type: "input",
                            default: "Slack Logger",
                        },
                        {
                            name: "iconUrl",
                            message: "Please enter the slack logger icon url",
                            type: "input",
                            default: "https://image.ibb.co/muqycJ/log_info.png",
                        },
                    ])];
            case 1:
                _a = _b.sent(), token = _a.token, channel = _a.channel, name = _a.name, iconUrl = _a.iconUrl;
                dotEnvContents = ("\n      TOKEN=" + token + "\n      CHANNEL=" + channel + "\n      NAME=" + name + "\n      ICON_URL=" + iconUrl + "\n    ").replace(/^\s+/gm, "");
                // write the file
                fs.writeFileSync(dotEnvFilename, dotEnvContents, "utf8");
                _b.label = 2;
            case 2: return [4 /*yield*/, inquirer_1.default.prompt([
                    {
                        name: "exampleName",
                        message: "Which example would you like to run?",
                        type: "list",
                        choices: [
                            {
                                name: "Manual",
                                value: "1-example-manual",
                            },
                            {
                                name: "Bunyan",
                                value: "2-example-bunyan",
                            },
                            {
                                name: "Winston",
                                value: "3-example-winston",
                            },
                            {
                                name: "Logger",
                                value: "4-example-logger",
                            },
                        ],
                    },
                ])];
            case 3:
                exampleName = (_b.sent()).exampleName;
                filename = path.join(__dirname, exampleName + ".js");
                console.log("\nRunning " + chalk_1.default.bold(filename) + "\n");
                require(filename);
                return [2 /*return*/];
        }
    });
}); })().catch(function (error) { return console.error(error); });
//# sourceMappingURL=index.js.map