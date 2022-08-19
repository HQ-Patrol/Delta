"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.info = exports.error = exports.log = void 0;
const chalk_1 = __importDefault(require("chalk"));
const moment_1 = __importDefault(require("moment"));
const PREFIX_WIDTH = 7;
function implMaxPrefix(prefix) {
    return prefix.length <= PREFIX_WIDTH ? prefix + " ".repeat(PREFIX_WIDTH - prefix.length) : prefix.slice(0, PREFIX_WIDTH);
}
function log(prefix, message, color = "blue", symbol = null) {
    return console.log(chalk_1.default.bgGray(` ${symbol !== null && symbol !== void 0 ? symbol : "*"} `), chalk_1.default.keyword(color).bold(implMaxPrefix(prefix)), chalk_1.default.keyword(color)(`[${(0, moment_1.default)().format("LTS")}]`), chalk_1.default.keyword(color)(message));
}
exports.log = log;
function error(message, ...hints) {
    return console.log(chalk_1.default.bgRedBright(" ! "), chalk_1.default.redBright.bold(implMaxPrefix("ERROR")), chalk_1.default.redBright(`[${(0, moment_1.default)().format("LTS")}]`), chalk_1.default.redBright(hints.map((h) => `(${h}) `).join("") + message));
}
exports.error = error;
function info(message) {
    return console.log(chalk_1.default.bgYellowBright(" i "), chalk_1.default.yellow.bold(implMaxPrefix("INFO")), chalk_1.default.yellow(`[${(0, moment_1.default)().format("LTS")}]`), chalk_1.default.yellow(message));
}
exports.info = info;
