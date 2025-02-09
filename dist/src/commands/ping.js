"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const path_1 = __importDefault(require("path"));
const logger_NoDM_NoAdmin_1 = require("../utility/logger-NoDM-NoAdmin");
const logger_custom_1 = require("../utility/logger-custom");
const pingCommand = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName("ping")
        .setDescription("Replies with something Mambo!!"),
    async execute(interaction) {
        const ownerId = interaction.guild?.ownerId;
        const isDM = !interaction.guild;
        if (isDM) {
            await interaction.reply({
                content: "This is a Server-Only Command! 🖕",
                flags: 64,
            });
            (0, logger_NoDM_NoAdmin_1.logger_NoDM_NoAdmin)(interaction);
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
            (0, logger_NoDM_NoAdmin_1.logger_NoDM_NoAdmin)(interaction);
            return;
        }
        await interaction.reply({
            files: [Admin],
        });
        await interaction.followUp("Pong!");
        (0, logger_custom_1.logger_custom)(userName, "ping", "Command executed successfully!");
    },
};
exports.default = pingCommand;
