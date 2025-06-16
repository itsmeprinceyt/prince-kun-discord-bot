import {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    AttachmentBuilder
} from "discord.js";
import ExcelJS from "exceljs";
import { logger_custom } from "../utility/loggers/logger-custom";
import { commandsList } from '../utility/commands/export-commands.utils';

const ExportCommands = {
    data: new SlashCommandBuilder()
        .setName("export-commands")
        .setDescription("Exports all command permissions to an Excel file. (Admins Only)"),

    async execute(interaction: ChatInputCommandInteraction) {
        const userName = interaction.user.username;

        try {
            await interaction.deferReply({ flags: 64 });

            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet("Commands");
            worksheet.columns = [
                { header: "Command Name", key: "name", width: 25 },
                { header: "Type", key: "type", width: 15 },
                { header: "DM or Guild", key: "scope", width: 15 },
                { header: "Who Can Use?", key: "access", width: 30 }
            ];

            commandsList.forEach(cmd => {
                worksheet.addRow({
                    name: cmd.name,
                    type: cmd.type,
                    scope: cmd.scope,
                    access: cmd.access
                });
            });

            const buffer = Buffer.from(await workbook.xlsx.writeBuffer());
            const attachment = new AttachmentBuilder(buffer, { name: "commands_export.xlsx" });

            await interaction.editReply({
                content: "✅ Export complete! Here is the list of all commands and their permissions:",
                files: [attachment]
            });
            logger_custom(userName, "export-commands", `${userName} exported all commands in excel.`);
        } catch (error) {
            console.error("❌ Error exporting commands:", error);
            await interaction.editReply({
                content: "❌ Failed to export commands. Please try again later.",
            });
        }
    }
};

export default ExportCommands;
