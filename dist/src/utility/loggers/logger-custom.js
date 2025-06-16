"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger_custom = logger_custom;
const chalk_1 = __importDefault(require("chalk"));
const time_1 = require("../loggers/time");
function logger_custom(username, commandName, message) {
    console.log(chalk_1.default.underline(`[ INFO ]`) +
        "\n" +
        chalk_1.default.yellow(`User: ${username}`) +
        "\n" +
        chalk_1.default.magenta(`Command: /${commandName}`) +
        "\n" +
        chalk_1.default.blue((0, time_1.getFormattedIST)()) +
        "\n" +
        chalk_1.default.green(`Message: ${message}\n`));
}
