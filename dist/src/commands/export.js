"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const db_1 = __importDefault(require("../db"));
const exceljs_1 = __importDefault(require("exceljs"));
const rolePerms_1 = require("../utility/rolePerms");
const logger_NoDM_NoAdmin_1 = require("../utility/logger-NoDM-NoAdmin");
const adminId = rolePerms_1.RolesPerms[5].roleId;
const ExportCommand = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName("export")
        .setDescription("Exports the database data to an Excel file. (Admins Only)")
        .addStringOption(option => option.setName("table")
        .setDescription("Enter the table name to export (leave empty to list tables)")
        .setRequired(false)),
    async execute(interaction) {
        const isDM = !interaction.guild;
        if (isDM) {
            if (interaction.user.id !== adminId) {
                await interaction.reply({
                    content: "This is a Server-Only Command! 🖕",
                    flags: 64
                });
                (0, logger_NoDM_NoAdmin_1.logger_NoDM_NoAdmin)(interaction);
                return;
            }
        }
        else {
            const member = await interaction.guild.members.fetch(interaction.user.id);
            if (!member.permissions.has("Administrator")) {
                await interaction.reply({
                    content: "🚫 You do not have permission to use this command!",
                    flags: 64
                });
                (0, logger_NoDM_NoAdmin_1.logger_NoDM_NoAdmin)(interaction);
                return;
            }
        }
        const tableName = interaction.options.getString("table")?.trim();
        try {
            if (!tableName) {
                const [tables] = await db_1.default.query("SHOW TABLES");
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
            const [rows] = await db_1.default.query(`SELECT * FROM \`${tableName}\``);
            if (!Array.isArray(rows) || rows.length === 0) {
                await interaction.reply({ content: `❌ No data found in table \`${tableName}\`!`, flags: 64 });
                return;
            }
            const workbook = new exceljs_1.default.Workbook();
            const worksheet = workbook.addWorksheet("Data Export");
            worksheet.columns = Object.keys(rows[0]).map(key => ({
                header: key,
                key: key,
                width: 20
            }));
            rows.forEach(row => worksheet.addRow(row));
            const buffer = Buffer.from(await workbook.xlsx.writeBuffer());
            const attachment = new discord_js_1.AttachmentBuilder(buffer, { name: `${tableName}_export.xlsx` });
            await interaction.reply({ content: `✅ Export complete for table \`${tableName}\`!`, files: [attachment] });
        }
        catch (error) {
            console.error("❌ Error exporting database:", error);
            await interaction.reply({ content: `❌ Failed to export table \`${tableName}\`. Check if the table exists.`, flags: 64 });
        }
    }
};
exports.default = ExportCommand;
