"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var logger_1 = __importDefault(require("./services/logger"));
// use the logger.get(componentName, filename) in each file to log for a specific component
var log = logger_1.default.get("register", __filename);
// logging message and info separately is recommended as the info gets nicely formatted and message becomes searchable
log.error({
    success: false,
    info: {
        firstName: "Jack",
        lastName: "Daniels",
        email: "jack@daniels.com",
    },
    error: new Error("Duplicate email: jack@daniels.com"),
}, "registering user failed");
//# sourceMappingURL=4-example-logger.js.map