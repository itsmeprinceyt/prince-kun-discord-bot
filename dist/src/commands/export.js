"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const db_1 = __importDefault(require("../db"));
const RolesPerms_1 = require("../utility/uuid/RolesPerms");
const logger_NoDM_NoAdmin_1 = require("../utility/loggers/logger-NoDM-NoAdmin");
const logger_custom_1 = require("../utility/loggers/logger-custom");
const Colors_1 = require("../utility/uuid/Colors");
const utils_1 = require("../utility/utils");
const adminId = RolesPerms_1.RolesPerms[5].roleId;
const ExportCommand = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName("export")
        .setDescription("Exports the database data to a CSV file. (Admins Only)")
        .addStringOption(option => option.setName("table")
        .setDescription("Enter the table name to export (leave empty to list tables)")
        .setRequired(false)),
    async execute(interaction) {
        const isDM = !interaction.guild;
        const userName = interaction.user.username;
        const tableName = interaction.options.getString("table")?.trim();
        // Permission checks
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
        try {
            if (!tableName) {
                const [tables] = await db_1.default.query("SHOW TABLES");
                if (!Array.isArray(tables) || tables.length === 0) {
                    await interaction.reply({ content: "❌ No tables found in the database!", flags: 64 });
                    return;
                }
                const tableNames = tables.map((row, index) => `${index + 1}. \`${Object.values(row)[0]}\``);
                const tableListEmbed = new discord_js_1.EmbedBuilder()
                    .setAuthor({
                    name: "Prince-Kun • Tables",
                    iconURL: utils_1.ProfileAuthorPicture,
                })
                    .setTitle("📋 Available Tables")
                    .setColor(Colors_1.COLOR_PRIMARY)
                    .setDescription(tableNames.join("\n"))
                    .setTimestamp();
                await interaction.reply({
                    embeds: [tableListEmbed],
                    ephemeral: true
                });
                (0, logger_custom_1.logger_custom)(userName, "export", `${userName} fetched all database tables`);
                return;
            }
            const [rows, fields] = await db_1.default.query(`SELECT * FROM \`${tableName}\``);
            if (!rows || rows.length === 0) {
                await interaction.reply({ content: `❌ No data found in table \`${tableName}\`!`, flags: 64 });
                return;
            }
            const headers = Object.keys(rows[0]);
            const csvRows = [
                headers.join(","),
                ...rows.map(row => headers.map(key => {
                    const value = row[key];
                    if (typeof value === "string") {
                        // Escape double quotes and wrap in quotes
                        return `"${value.replace(/"/g, '""')}"`;
                    }
                    return value;
                }).join(","))
            ];
            const buffer = Buffer.from(csvRows.join("\n"), "utf-8");
            const attachment = new discord_js_1.AttachmentBuilder(buffer, {
                name: `${tableName}_export.csv`,
                description: `CSV Export of ${tableName}`
            });
            await interaction.reply({
                content: `✅ Export complete for table \`${tableName}\`!`,
                files: [attachment]
            });
            (0, logger_custom_1.logger_custom)(userName, "export", `${userName} exported database table: ${tableName} as CSV.`);
        }
        catch (error) {
            console.error("❌ Error exporting database:", error);
            await interaction.reply({
                content: `❌ Failed to export table \`${tableName}\`. Check if the table exists.`,
                flags: 64
            });
        }
    }
};
exports.default = ExportCommand;
