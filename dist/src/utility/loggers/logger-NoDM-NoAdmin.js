"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger_NoDM_NoAdmin = logger_NoDM_NoAdmin;
const chalk_1 = __importDefault(require("chalk"));
const time_1 = require("../loggers/time");
function logger_NoDM_NoAdmin(interaction) {
    const location = interaction.guild ? `Server: ${interaction.guild.name}` : "DM";
    console.log(chalk_1.default.underline(`[ INFO ]`) +
        "\n" +
        chalk_1.default.yellow(`User: ${interaction.user.username}`) +
        "\n" +
        chalk_1.default.magenta(`Command: /${interaction.commandName}`) +
        "\n" +
        chalk_1.default.cyan(`Location: ${location}`) +
        "\n" +
        chalk_1.default.blue((0, time_1.getFormattedIST)()) +
        "\n" +
        chalk_1.default.red(`Message: Unauthorized user attempted to execute!\n`));
}
