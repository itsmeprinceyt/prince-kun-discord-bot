"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const exceljs_1 = __importDefault(require("exceljs"));
const logger_custom_1 = require("../utility/loggers/logger-custom");
const export_commands_utils_1 = require("../utility/commands/export-commands.utils");
const ExportCommands = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName("export-commands")
        .setDescription("Exports all command permissions to an Excel file. (Admins Only)"),
    async execute(interaction) {
        const userName = interaction.user.username;
        try {
            await interaction.deferReply({ flags: 64 });
            const workbook = new exceljs_1.default.Workbook();
            const worksheet = workbook.addWorksheet("Commands");
            worksheet.columns = [
                { header: "Command Name", key: "name", width: 25 },
                { header: "Type", key: "type", width: 15 },
                { header: "DM or Guild", key: "scope", width: 15 },
                { header: "Who Can Use?", key: "access", width: 30 }
            ];
            export_commands_utils_1.commandsList.forEach(cmd => {
                worksheet.addRow({
                    name: cmd.name,
                    type: cmd.type,
                    scope: cmd.scope,
                    access: cmd.access
                });
            });
            const buffer = Buffer.from(await workbook.xlsx.writeBuffer());
            const attachment = new discord_js_1.AttachmentBuilder(buffer, { name: "commands_export.xlsx" });
            await interaction.editReply({
                content: "✅ Export complete! Here is the list of all commands and their permissions:",
                files: [attachment]
            });
            (0, logger_custom_1.logger_custom)(userName, "export-commands", `${userName} exported all commands in excel.`);
        }
        catch (error) {
            console.error("❌ Error exporting commands:", error);
            await interaction.editReply({
                content: "❌ Failed to export commands. Please try again later.",
            });
        }
    }
};
exports.default = ExportCommands;
