"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const db_1 = __importDefault(require("../db"));
const adminModals_1 = require("../modals/adminModals");
const logger_NoDM_NoAdmin_1 = require("../utility/loggers/logger-NoDM-NoAdmin");
const logger_custom_1 = require("../utility/loggers/logger-custom");
const RolesPerms_1 = require("../utility/uuid/RolesPerms");
const utils_1 = require("../utility/utils");
const adminCommand = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName("admin")
        .setDescription("Manage registered users (Admins only)."),
    async execute(interaction) {
        const adminId = RolesPerms_1.RolesPerms[5].roleId;
        if (!interaction.guild) {
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
            if (interaction.user.id !== interaction.guild.ownerId) {
                await interaction.reply({
                    content: "🚫 You do not have permission to use this command!",
                    flags: 64
                });
                (0, logger_NoDM_NoAdmin_1.logger_NoDM_NoAdmin)(interaction);
                return;
            }
        }
        let page = 0;
        const [users] = await db_1.default.query("SELECT user_id FROM users");
        (0, logger_custom_1.logger_custom)("ADMIN", "admin", "Fetched all registered users");
        if (users.length === 0) {
            await interaction.reply({
                content: "No registered users found!",
                flags: 64,
            });
            return;
        }
        const generateEmbed = () => {
            const start = page * utils_1.ADMIN_USERS_PER_PAGE;
            const end = start + utils_1.ADMIN_USERS_PER_PAGE;
            const pageUsers = users.slice(start, end);
            return new discord_js_1.EmbedBuilder()
                .setColor(0xeeff00)
                .setAuthor({
                name: "Prince-Kun • User Database",
                iconURL: utils_1.ProfileAuthorPicture,
            })
                .setTitle("Registered Users")
                .setDescription(`\`ID  \` \`Users\`\n` +
                pageUsers
                    .map((user, index) => `\`${(start + index + 1).toString().padEnd(4, ' ')}\` <@${user.user_id}>`)
                    .join("\n"))
                .setFooter({ text: `Page ${page + 1} of ${Math.ceil(users.length / utils_1.ADMIN_USERS_PER_PAGE)}` })
                .setColor("Blue")
                .setTimestamp();
        };
        const row = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder().setCustomId("prev").setLabel("⬅️ Previous").setStyle(discord_js_1.ButtonStyle.Primary), new discord_js_1.ButtonBuilder().setCustomId("select").setLabel("🔍 Select User").setStyle(discord_js_1.ButtonStyle.Success), new discord_js_1.ButtonBuilder().setCustomId("next").setLabel("➡️ Next").setStyle(discord_js_1.ButtonStyle.Primary));
        const reply = await interaction.reply({
            embeds: [generateEmbed()],
            components: [row],
            flags: 64,
        });
        const collector = reply.createMessageComponentCollector({
            componentType: discord_js_1.ComponentType.Button,
            time: 60000
        });
        collector.on("collect", async (buttonInteraction) => {
            if (buttonInteraction.user.id !== adminId) {
                await buttonInteraction.reply({ content: "You cannot use this!", flags: 64 });
                return;
            }
            if (buttonInteraction.customId === "prev" && page > 0) {
                page--;
                (0, logger_custom_1.logger_custom)("ADMIN", "admin", "Admin clicked previous button");
            }
            else if (buttonInteraction.customId === "next" && (page + 1) * utils_1.ADMIN_USERS_PER_PAGE < users.length) {
                page++;
                (0, logger_custom_1.logger_custom)("ADMIN", "admin", "Admin clicked next button");
            }
            else if (buttonInteraction.customId === "select") {
                await (0, adminModals_1.handleSelectUser)(buttonInteraction);
                return;
            }
            await buttonInteraction.update({ embeds: [generateEmbed()], components: [row] });
        });
    },
};
exports.default = adminCommand;
