"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const chalk_1 = __importDefault(require("chalk"));
const path_1 = __importDefault(require("path"));
const pingCommand = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName("ping")
        .setDescription("Replies with something Mambo!!"),
    async execute(interaction) {
        const ownerId = interaction.guild?.ownerId;
        const isDM = !interaction.guild;
        const location = isDM ? "DM" : `Server: ${interaction.guild?.name}`;
        if (isDM) {
            await interaction.reply({
                content: "This is a Server-Only Command! 🖕",
                flags: 64,
            });
            console.log(chalk_1.default.underline(`[ INFO ]`) +
                "\n" +
                chalk_1.default.yellow(`User: ${interaction.user.username}`) +
                "\n" +
                chalk_1.default.magenta(`Command: /ping`) +
                "\n" +
                chalk_1.default.cyan(`Location: DM`) +
                "\n" +
                chalk_1.default.cyan(`Message: Attempted to execute in DM!\n`));
            return;
        }
        const member = interaction.member;
        const userName = member.displayName || interaction.user.username;
        const gifPath = path_1.default.join(__dirname, "../public/GIF/sonic-sonic-exe.gif");
        const gifPath2 = path_1.default.join(__dirname, "../public/GIF/mambo.gif");
        const NonAdmin = new discord_js_1.AttachmentBuilder(gifPath);
        const Admin = new discord_js_1.AttachmentBuilder(gifPath2);
        if (interaction.user.id !== ownerId) {
            await interaction.reply({
                files: [NonAdmin],
                flags: 64,
            });
            await interaction.followUp("Pong!");
            console.log(chalk_1.default.underline(`[ INFO ]`) +
                "\n" +
                chalk_1.default.yellow(`User: ${userName}`) +
                "\n" +
                chalk_1.default.yellow(`Username: ${interaction.user.username}`) +
                "\n" +
                chalk_1.default.magenta(`Command: /ping`) +
                "\n" +
                chalk_1.default.cyan(`Location: ${location}`) +
                "\n" +
                chalk_1.default.red(`Message: Unauthorized user attempted to execute!\n`));
            return;
        }
        await interaction.reply({
            files: [Admin],
        });
        await interaction.followUp("Pong!");
        console.log(chalk_1.default.underline(`[ INFO ]`) +
            "\n" +
            chalk_1.default.yellow(`User: ${userName}`) +
            "\n" +
            chalk_1.default.yellow(`Username: ${interaction.user.username}`) +
            "\n" +
            chalk_1.default.magenta(`Command: /ping`) +
            "\n" +
            chalk_1.default.cyan(`Location: ${location}`) +
            "\n" +
            chalk_1.default.green(`Message: Command executed successfully!\n`));
    },
};
exports.default = pingCommand;
