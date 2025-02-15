"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const db_1 = __importDefault(require("../db"));
const logger_NoDM_NoAdmin_1 = require("../utility/logger-NoDM-NoAdmin");
const logger_custom_1 = require("../utility/logger-custom");
const profileCommand = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName("profile")
        .setDescription("Check your profile and register if needed."),
    async execute(interaction) {
        if (!interaction.guild) {
            await interaction.reply({
                content: "This is a Server-Only Command! 🖕",
                flags: 64,
            });
            (0, logger_NoDM_NoAdmin_1.logger_NoDM_NoAdmin)(interaction);
            return;
        }
        const userId = interaction.user.id;
        const member = interaction.member;
        const userName = member?.displayName || interaction.user.username;
        const [rows] = await db_1.default.query("SELECT pp_cash, refer_tickets, total_purchases FROM users WHERE user_id = ?", [userId]);
        if (rows.length > 0) {
            const { pp_cash, refer_tickets, total_purchases } = rows[0];
            const embed = new discord_js_1.EmbedBuilder()
                .setTitle("Your Profile")
                .setDescription(`🎉 **You're registered!**\n` +
                `💰 **PP CASH:** ${pp_cash}\n` +
                `🎟 **Refer Tickets:** ${refer_tickets}\n` +
                `🛒 **Total Purchases:** ${total_purchases}`)
                .setColor("Green");
            await interaction.reply({ embeds: [embed], flags: 64 });
            const MessageString = `[ DATABASE ] User ${userName} (${userId}) fetched profile`;
            (0, logger_custom_1.logger_custom)(userName, "profile", MessageString);
            return;
        }
        const embed = new discord_js_1.EmbedBuilder()
            .setTitle("ItsMe Prince Shop - Profile")
            .setDescription("You are not registered yet. Click **Register** to create your profile.")
            .setColor("Blue");
        const registerButton = new discord_js_1.ButtonBuilder()
            .setCustomId(`register_${userId}`)
            .setLabel("Register")
            .setStyle(discord_js_1.ButtonStyle.Success);
        const cancelButton = new discord_js_1.ButtonBuilder()
            .setCustomId(`cancel_${userId}`)
            .setLabel("Cancel")
            .setStyle(discord_js_1.ButtonStyle.Danger);
        const row = new discord_js_1.ActionRowBuilder().addComponents(registerButton, cancelButton);
        const reply = await interaction.reply({
            embeds: [embed],
            components: [row],
            flags: 64,
        });
        const collector = reply.createMessageComponentCollector({
            componentType: discord_js_1.ComponentType.Button,
            time: 30000,
            filter: (buttonInteraction) => buttonInteraction.user.id === userId
        });
        collector.on("collect", async (buttonInteraction) => {
            if (buttonInteraction.customId === `register_${userId}`) {
                await db_1.default.query("INSERT INTO users (user_id, pp_cash, refer_tickets, total_purchases) VALUES (?, ?, ?, ?)", [userId, 0, 0, 0]);
                const MessageString = `[ DATABASE ] User ${userName} (${userId}) registered`;
                (0, logger_custom_1.logger_custom)(userName, "profile", MessageString);
                await buttonInteraction.update({
                    embeds: [
                        new discord_js_1.EmbedBuilder()
                            .setTitle("Registration Successful!")
                            .setDescription("🎉 **You are now registered!**\n" +
                            "💰 **PP CASH: 0**\n" +
                            "🎟 **Refer Tickets: 0**\n" +
                            "🛒 **Total Purchases: 0**")
                            .setColor("Green")
                    ],
                    components: []
                });
            }
            else if (buttonInteraction.customId === `cancel_${userId}`) {
                console.log(`[ INFO ] User ${userName} (${userId}) cancelled registration.`);
                await buttonInteraction.update({
                    content: "Registration cancelled.",
                    components: []
                });
            }
        });
        collector.on("end", async () => {
            try {
                await interaction.editReply({ components: [] });
            }
            catch (error) {
                console.error(`[ ERROR ] Failed to edit reply after collector ended: ${error}`);
            }
        });
    }
};
exports.default = profileCommand;
