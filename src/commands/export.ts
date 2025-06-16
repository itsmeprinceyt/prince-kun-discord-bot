import {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    AttachmentBuilder,
    EmbedBuilder
} from "discord.js";
import pool from "../db";
import { RowDataPacket, FieldPacket } from "mysql2";
import { RolesPerms } from "../utility/uuid/RolesPerms";
import { logger_NoDM_NoAdmin } from "../utility/loggers/logger-NoDM-NoAdmin";
import { logger_custom } from "../utility/loggers/logger-custom";
import { COLOR_PRIMARY } from '../utility/uuid/Colors';
import { ProfileAuthorPicture, DiscordBotProfilePicture } from '../utility/utils';

const adminId = RolesPerms[5].roleId;

const ExportCommand = {
    data: new SlashCommandBuilder()
        .setName("export")
        .setDescription("Exports the database data to a CSV file. (Admins Only)")
        .addStringOption(option =>
            option.setName("table")
                .setDescription("Enter the table name to export (leave empty to list tables)")
                .setRequired(false)
        ),

    async execute(interaction: ChatInputCommandInteraction) {
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

        try {
            if (!tableName) {
                const [tables] = await pool.query("SHOW TABLES");

                if (!Array.isArray(tables) || tables.length === 0) {
                    await interaction.reply({ content: "❌ No tables found in the database!", flags: 64 });
                    return;
                }

                const tableNames = tables.map((row, index) => `${index + 1}. \`${Object.values(row)[0]}\``);

                const tableListEmbed = new EmbedBuilder()
                    .setAuthor({
                        name: "Prince-Kun • Tables",
                        iconURL: ProfileAuthorPicture,
                    })
                    .setTitle("📋 Available Tables")
                    .setColor(COLOR_PRIMARY)
                    .setDescription(tableNames.join("\n"))
                    .setTimestamp();

                await interaction.reply({
                    embeds: [tableListEmbed],
                    flags: 64,
                });
                logger_custom(userName, "export", `${userName} fetched all database tables`);
                return;
            }
            type AnyRow = RowDataPacket & Record<string, any>;
            const [rows, fields]: [AnyRow[], FieldPacket[]] = await pool.query(`SELECT * FROM \`${tableName}\``);


            if (!rows || rows.length === 0) {
                await interaction.reply({ content: `❌ No data found in table \`${tableName}\`!`, flags: 64 });
                return;
            }

            const headers = Object.keys(rows[0]);
            const csvRows = [
                headers.map(h => `"${h}"`).join(","),
                ...rows.map(row =>
                    headers.map(key => {
                        let value = row[key];

                        if (value instanceof Date) {
                            value = value.toISOString().split("T")[0];
                        }

                        if (value === null || value === undefined) {
                            return '""';
                        }

                        return `"${String(value).replace(/"/g, '""')}"`;
                    }).join(",")
                )
            ];


            const buffer = Buffer.from(csvRows.join("\n"), "utf-8");
            const attachment = new AttachmentBuilder(buffer, {
                name: `${tableName}_export.csv`,
                description: `CSV Export of ${tableName}`
            });

            await interaction.reply({
                content: `✅ Export complete for table \`${tableName}\`!`,
                files: [attachment]
            });

            logger_custom(userName, "export", `${userName} exported database table: ${tableName} as CSV.`);
        } catch (error) {
            console.error("❌ Error exporting database:", error);
            await interaction.reply({
                content: `❌ Failed to export table \`${tableName}\`. Check if the table exists.`,
                flags: 64
            });
        }
    }
};

export default ExportCommand;
