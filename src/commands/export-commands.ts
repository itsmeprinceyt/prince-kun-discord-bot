import {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    AttachmentBuilder
} from "discord.js";
import ExcelJS from "exceljs";
import { logger_custom } from "../utility/logger-custom";

const ExportCommands = {
    data: new SlashCommandBuilder()
        .setName("export-commands")
        .setDescription("Exports all command permissions to an Excel file. (Admins Only)"),

    async execute(interaction: ChatInputCommandInteraction) {
        const userName = interaction.user.username;

        try {
            await interaction.deferReply({ flags: 64 });

            const commandsList = [
                { name: "/admin", access: "Admins Only", scope: "Guild & DM", type: "Slash" },
                { name: "/bot-updates", access: "Admins Only", scope: "Guild Only", type: "Slash" },
                { name: "/export", access: "Admins Only", scope: "Guild & DM", type: "Slash" },
                { name: "/export-commands", access: "Admins Only", scope: "Guild Only", type: "Slash" },
                { name: "/server-updates", access: "Admins Only", scope: "Guild Only", type: "Slash" },
                { name: "/ban", access: "Moderators & Admins", scope: "Guild Only", type: "Slash" },
                { name: ".?help", access: "Everyone", scope: "Guild & DM", type: "Message" },
                { name: "/help", access: "Everyone", scope: "Guild & DM", type: "Slash" },
                { name: "/kick", access: "Moderators & Admins", scope: "Guild Only", type: "Slash" },
                { name: "/purge", access: "Moderators & Admins", scope: "Guild Only", type: "Slash" },
                { name: "/purchase-done", access: "Admins", scope: "Guild Only & DM", type: "Slash" },
                { name: "/mega-purge", access: "Admins Only", scope: "Guild Only", type: "Slash" },
                { name: "/set-bot-tester", access: "Admins Only", scope: "Guild Only", type: "Slash" },
                { name: "/set-client", access: "Admins Only", scope: "Guild Only", type: "Slash" },
                { name: "/set-code-poster-role", access: "Admins Only", scope: "Guild Only", type: "Slash" },
                { name: "/set-leaker", access: "Admins Only", scope: "Guild Only", type: "Slash" },
                { name: "/set-mod", access: "Admins Only", scope: "Guild Only", type: "Slash" },
                { name: "/set-shop-manager-role", access: "Admins Only", scope: "Guild Only", type: "Slash" },
                { name: "/remove-bot-tester", access: "Admins Only", scope: "Guild Only", type: "Slash" },
                { name: "/remove-client", access: "Admins Only", scope: "Guild Only", type: "Slash" },
                { name: "/remove-code-poster-role", access: "Admins Only", scope: "Guild Only", type: "Slash" },
                { name: "/remove-leaker", access: "Admins Only", scope: "Guild Only", type: "Slash" },
                { name: "/remove-mod", access: "Admins Only", scope: "Guild Only", type: "Slash" },
                { name: "/remove-shop-manager-role", access: "Admins Only", scope: "Guild Only", type: "Slash" },
                { name: "/delete-user", access: "Admins Only", scope: "Guild & DM", type: "Slash" },
                { name: "/item-bought", access: "Admins Only", scope: "Guild & DM", type: "Slash" },
                { name: "/modify-data", access: "Admins Only", scope: "Guild & DM", type: "Slash" },
                { name: "/referring", access: "Admins Only", scope: "Guild & DM", type: "Slash" },
                { name: "/register-user", access: "Admins Only", scope: "Guild & DM", type: "Slash" },
                { name: "/reset-data", access: "Admins Only", scope: "Guild & DM", type: "Slash" },
                { name: "/update-data", access: "Admins Only", scope: "Guild & DM", type: "Slash" },
                { name: "/shop-updates", access: "Admins Only", scope: "Guild Only", type: "Slash" },
                { name: "/donation-bot", access: "Admins Only", scope: "Guild Only", type: "Slash" },
                { name: "/game-code", access: "Admins Only", scope: "Guild Only", type: "Slash" },
                { name: "/game-items-no-stock", access: "Admins Only", scope: "Guild Only", type: "Slash" },
                { name: "/game-items-stock", access: "Admins Only", scope: "Guild Only", type: "Slash" },
                { name: "/game-livestream-codes", access: "Admins Only", scope: "Guild Only", type: "Slash" },
                { name: "/new-redeems", access: "Admins Only", scope: "Guild Only", type: "Slash" },
                { name: "/new-highlight", access: "Admins Only", scope: "Guild & DM", type: "Slash" },
                { name: "/profile", access: "Everyone", scope: "Guild & DM", type: "Slash" },
                { name: "/register", access: "Everyone", scope: "Guild & DM", type: "Slash" },
                { name: "/ping", access: "Everyone", scope: "Guild Only", type: "Slash" },
                { name: ".?av", access: "Everyone", scope: "Guild & DM", type: "Message" },
                { name: ".?device", access: "Everyone", scope: "Guild & DM", type: "Message" },
                { name: ".?delete", access: "Everyone", scope: "Guild & DM", type: "Message" },
                { name: ".?pcspecs", access: "Everyone", scope: "Guild & DM", type: "Message" },
                { name: ".?math", access: "Everyone", scope: "Guild & DM", type: "Message" },
                { name: ".?life", access: "Everyone", scope: "Guild & DM", type: "Message" },
                { name: ".?sofi-guides", access: "Everyone", scope: "Guild & DM", type: "Message" },
                { name: ".?scan", access: "Everyone", scope: "Guild", type: "Message" },
                { name: ".?work", access: "Everyone", scope: "Guild", type: "Message" },
                { name: ".?github", access: "Everyone", scope: "Guild & DM", type: "Message" },
                { name: ".?instagram", access: "Everyone", scope: "Guild & DM", type: "Message" },
                { name: ".?x", access: "Everyone", scope: "Guild & DM", type: "Message" },
                { name: ".?whatsapp", access: "Everyone", scope: "Guild & DM", type: "Message" },
                { name: ".?discord", access: "Everyone", scope: "Guild & DM", type: "Message" },
                { name: ".?youtube", access: "Everyone", scope: "Guild & DM", type: "Message" },
                { name: ".?clips", access: "Everyone", scope: "Guild & DM", type: "Message" },
                { name: ".?shop-leaderboard", access: "Everyone", scope: "Guild & DM", type: "Message" },
                { name: ".?shoprules", access: "Everyone", scope: "Guild & DM", type: "Message" },
                { name: ".?profile", access: "Everyone", scope: "Guild", type: "Message" },
                { name: ".?register", access: "Everyone", scope: "Guild", type: "Message" }
            ];



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
