"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const db_1 = __importDefault(require("../db"));
const logger_custom_1 = require("../utility/loggers/logger-custom");
const itsmeprince_rules_1 = require("../utility/commands/rules/itsmeprince-rules");
const register_done_1 = require("../utility/embeds/register-done");
const utils_1 = require("../utility/utils");
const registerCommand = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName("register")
        .setDescription("Register your profile for ItsMe Prince Shop."),
    async execute(interaction) {
        const userId = interaction.user.id;
        const member = interaction.member;
        const userName = member?.displayName || interaction.user.username;
        const [rows] = await db_1.default.query("SELECT user_id FROM users WHERE user_id = ?", [userId]);
        if (rows.length > 0) {
            await interaction.reply({
                content: "❌ You are already registered!",
                flags: 64,
            });
            return;
        }
        const embed = new discord_js_1.EmbedBuilder()
            .setColor(0xc200ff)
            .setAuthor({
            name: "Prince-Kun • ItsMe Prince Shop",
            iconURL: utils_1.ProfileAuthorPicture,
        })
            .setTitle("Rules & Information")
            .setThumbnail(interaction.user.displayAvatarURL())
            .setTitle("ItsMe Prince Shop - Profile Registeration")
            .setDescription(itsmeprince_rules_1.ItsMePrinceRules + `**You accept the rules by registering and you also agree to any future updates or changes in the value of PP CASH. It is your responsibility to stay updated with the latest rules.**`)
            .setFooter({ text: `${userName}`, iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp();
        const registerButton = new discord_js_1.ButtonBuilder()
            .setCustomId(`register_${userId}`)
            .setLabel("Accept & Register")
            .setStyle(discord_js_1.ButtonStyle.Success);
        const cancelButton = new discord_js_1.ButtonBuilder()
            .setCustomId(`cancel_${userId}`)
            .setLabel("Cancel")
            .setStyle(discord_js_1.ButtonStyle.Danger);
        const row = new discord_js_1.ActionRowBuilder().addComponents(registerButton, cancelButton);
        const reply = await interaction.reply({
            embeds: [embed],
            components: [row]
        });
        const collector = reply.createMessageComponentCollector({
            componentType: discord_js_1.ComponentType.Button,
            time: 30000,
            filter: (buttonInteraction) => buttonInteraction.user.id === userId
        });
        collector.on("collect", async (buttonInteraction) => {
            if (buttonInteraction.customId === `register_${userId}`) {
                const istTime = moment_timezone_1.default.tz("Europe/Paris").tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");
                await db_1.default.query("INSERT INTO users (user_id, pp_cash, refer_tickets, total_purchases, registration_date, total_referred) VALUES (?, ?, ?, ?, ?, ?)", [userId, 0, 0, 0, istTime, 0]);
                const MessageString = `[ DATABASE ] User ${userName} (${userId}) registered`;
                (0, logger_custom_1.logger_custom)(userName, "register", MessageString);
                await buttonInteraction.update({
                    embeds: [(0, register_done_1.getRegistrationSuccessEmbed)(interaction.user)],
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
exports.default = registerCommand;
