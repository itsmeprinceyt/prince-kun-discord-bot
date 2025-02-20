import {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    AttachmentBuilder
} from "discord.js";
import pool from "../db";
import ExcelJS from "exceljs";
import { RolesPerms } from "../utility/rolePerms";
import { logger_NoDM_NoAdmin } from "../utility/logger-NoDM-NoAdmin";
const adminId = RolesPerms[5].roleId;

const ExportCommand = {
    data: new SlashCommandBuilder()
        .setName("export")
        .setDescription("Exports the database data to an Excel file. (Admins Only)")
        .addStringOption(option =>
            option.setName("table")
                .setDescription("Enter the table name to export (leave empty to list tables)")
                .setRequired(false)
        ),

    async execute(interaction: ChatInputCommandInteraction) {
        const isDM = !interaction.guild;
        if (isDM) {
            if (interaction.user.id !== adminId) {
                await interaction.reply({
                    content: "🚫 You are not authorized to use this command in DMs!",
                    flags: 64
                });
                logger_NoDM_NoAdmin(interaction);
                return;
            }
        } else {
            const member = await interaction.guild!.members.fetch(interaction.user.id);
            if (!member.permissions.has("Administrator")) {
                await interaction.reply({
                    content: "🚫 You do not have permission to use this command!",
                    flags: 64
                });
                logger_NoDM_NoAdmin(interaction);
                return;
            }
        }

        const tableName = interaction.options.getString("table")?.trim();

        try {
            if (!tableName) {
                const [tables] = await pool.query("SHOW TABLES");

                if (!Array.isArray(tables) || tables.length === 0) {
                    await interaction.reply({ content: "❌ No tables found in the database!", flags: 64 });
                    return;
                }

                const tableNames = tables.map((row, index) => `${index + 1}. \`${Object.values(row)[0]}\``);

                await interaction.reply({
                    content: `📋 **Available tables:**\n${tableNames.join("\n")}\n`,
                    flags: 64
                });
                return;
            }

            const [rows] = await pool.query(`SELECT * FROM \`${tableName}\``);
            if (!Array.isArray(rows) || rows.length === 0) {
                await interaction.reply({ content: `❌ No data found in table \`${tableName}\`!`, flags: 64 });
                return;
            }

            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet("Data Export");

            worksheet.columns = Object.keys(rows[0]).map(key => ({
                header: key,
                key: key,
                width: 20
            }));

            rows.forEach(row => worksheet.addRow(row));
            const buffer = Buffer.from(await workbook.xlsx.writeBuffer());
            const attachment = new AttachmentBuilder(buffer, { name: `${tableName}_export.xlsx` });

            await interaction.reply({ content: `✅ Export complete for table \`${tableName}\`!`, files: [attachment] });
        } catch (error) {
            console.error("❌ Error exporting database:", error);
            await interaction.reply({ content: `❌ Failed to export table \`${tableName}\`. Check if the table exists.`, flags: 64 });
        }
    }
};

export default ExportCommand;
