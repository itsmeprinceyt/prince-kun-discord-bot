"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger_command_sent = logger_command_sent;
const chalk_1 = __importDefault(require("chalk"));
const time_1 = require("./time");
function logger_command_sent(interaction) {
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
        chalk_1.default.green(`Message: Command executed successfully!\n`));
}
