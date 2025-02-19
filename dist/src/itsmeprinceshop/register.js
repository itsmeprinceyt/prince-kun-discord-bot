"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const db_1 = __importDefault(require("../db"));
const logger_custom_1 = require("../utility/logger-custom");
const itsmeprince_rules_1 = require("../utility/itsmeprince-rules");
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
            iconURL: "https://media.discordapp.net/attachments/1336322293437038602/1336322635939975168/Profile_Pic_2.jpg",
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
                    embeds: [
                        new discord_js_1.EmbedBuilder()
                            .setColor(0x00ff00)
                            .setTitle("Registration Successful !")
                            .setThumbnail(interaction.user.displayAvatarURL())
                            .setDescription(`Well then, <@${userId}>, you're registered!\n Use \`/profile\` or \`.?profile\` to check your inventory!\n\n**Current Marketplace:** https://discord.com/channels/310675536340844544/1177928471951966339/1179354261365211218`).setTimestamp()
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
exports.default = registerCommand;
