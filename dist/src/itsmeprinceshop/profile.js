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
const emotes_1 = require("../utility/emotes");
const GC = emotes_1.EMOTES[0].roleId;
const YC = emotes_1.EMOTES[1].roleId;
const RC = emotes_1.EMOTES[2].roleId;
const BC = emotes_1.EMOTES[3].roleId;
const PC = emotes_1.EMOTES[4].roleId;
const profileCommand = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName("profile")
        .setDescription("Check your ItsMe Prince Shop profile or someone else's.")
        .addUserOption(option => option.setName("user")
        .setDescription("Mention a user to check their profile.")
        .setRequired(false)),
    async execute(interaction) {
        const mentionedUser = interaction.options.getUser("user");
        const targetUser = mentionedUser || interaction.user;
        const targetUserId = targetUser.id;
        const targetUsername = targetUser.username;
        const targetDisplayName = interaction.guild?.members.cache.get(targetUserId)?.displayName || targetUsername;
        if (mentionedUser) {
            const [rows] = await db_1.default.query("SELECT pp_cash FROM users WHERE user_id = ?", [mentionedUser.id]);
            if (rows.length === 0) {
                await interaction.reply({
                    content: `❌ **${mentionedUser.username}** is not registered in the ItsMe Prince Shop database.`,
                    flags: 64,
                });
                return;
            }
        }
        const [rows] = await db_1.default.query("SELECT pp_cash, refer_tickets, total_purchases, registration_date, total_referred FROM users WHERE user_id = ?", [targetUserId]);
        if (rows.length > 0) {
            const { pp_cash, refer_tickets, total_purchases, registration_date, total_referred } = rows[0];
            const AA = String(pp_cash).padEnd(8, " ");
            const BB = String(refer_tickets).padEnd(8, " ");
            const CC = String(total_purchases).padEnd(8, " ");
            const DD = String(total_referred).padEnd(8, " ");
            const formattedDate = (0, moment_timezone_1.default)(registration_date)
                .tz("Asia/Kolkata", true)
                .format("DD MMM YYYY, hh:mm A");
            const avatarURL = mentionedUser && rows.length > 0
                ? mentionedUser.displayAvatarURL()
                : interaction.user.displayAvatarURL();
            const embed = new discord_js_1.EmbedBuilder()
                .setColor(0xeeff00)
                .setAuthor({
                name: "Prince-Kun • Profile Info",
                iconURL: "https://media.discordapp.net/attachments/1336322293437038602/1336322635939975168/Profile_Pic_2.jpg",
            })
                .setThumbnail(avatarURL)
                .setTitle("ItsMe Prince Shop")
                .setDescription(`${YC} **Name:** <@${targetUserId}>\n` +
                `${YC} **Username:** ${targetUsername}\n` +
                `${YC} **UserID:** ${targetUserId}\n` +
                `${YC} **Registered on:** ${formattedDate}\n\n` +
                `**Stats**\n` +
                `${YC} \`PP Cash          \` • \`${AA}\`\n` +
                `${YC} \`Referral Tickets \` • \`${BB}\`\n` +
                `${YC} \`Total Purchases  \` • \`${CC}\`\n` +
                `${YC} \`Total Referred   \` • \`${DD}\`\n\n` +
                `**Extra**\n` +
                `${GC} \`1 PP Cash = 1₹\`\n` +
                `${GC} To know rules & information, type \`.?shoprules\``)
                .setFooter({
                text: `${targetUsername} | ${new Date().toLocaleTimeString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                    timeZone: "Asia/Kolkata",
                })} ${new Date().getHours() >= 12 ? "PM" : "AM"}`,
                iconURL: avatarURL,
            });
            await interaction.reply({ embeds: [embed] });
            const MessageString = `[ DATABASE ] User ${targetDisplayName} (${targetUserId}) fetched profile`;
            (0, logger_custom_1.logger_custom)(targetDisplayName, "profile", MessageString);
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
            .setFooter({
            text: `${targetDisplayName} | ${new Date().toLocaleTimeString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
                timeZone: "Asia/Kolkata",
            })} ${new Date().getHours() >= 12 ? "PM" : "AM"}`,
            iconURL: interaction.user.displayAvatarURL(),
        });
        const registerButton = new discord_js_1.ButtonBuilder()
            .setCustomId(`register_${targetUserId}`)
            .setLabel("Accept & Register")
            .setStyle(discord_js_1.ButtonStyle.Success);
        const cancelButton = new discord_js_1.ButtonBuilder()
            .setCustomId(`cancel_${targetUserId}`)
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
            filter: (buttonInteraction) => buttonInteraction.user.id === targetUserId
        });
        collector.on("collect", async (buttonInteraction) => {
            if (buttonInteraction.customId === `register_${targetUserId}`) {
                const istTime = moment_timezone_1.default.utc().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");
                await db_1.default.query("INSERT INTO users (user_id, pp_cash, refer_tickets, total_purchases, registration_date, total_referred) VALUES (?, ?, ?, ?, ?, ?)", [targetUserId, 0, 0, 0, istTime, 0]);
                const MessageString = `[ DATABASE ] User ${targetDisplayName} (${targetUserId}) registered`;
                (0, logger_custom_1.logger_custom)(targetDisplayName, "profile", MessageString);
                await buttonInteraction.update({
                    embeds: [
                        new discord_js_1.EmbedBuilder()
                            .setTitle("Registration Successful!")
                            .setThumbnail(interaction.user.displayAvatarURL())
                            .setDescription("Well, you're registered!\n Use \`/profile\` to check your inventory!\n\n**Current Marketplace:** https://discord.com/channels/310675536340844544/1177928471951966339/1179354261365211218")
                            .setColor(0x00ff00)
                    ],
                    components: []
                });
            }
            else if (buttonInteraction.customId === `cancel_${targetUserId}`) {
                console.log(`[ INFO ] User ${targetDisplayName} (${targetUserId}) cancelled registration.`);
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
