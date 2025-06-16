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
const spvImage_1 = require("../utility/spv/spvImage");
const Emotes_1 = require("../utility/uuid/Emotes");
const utils_1 = require("../utility/utils");
const GC = Emotes_1.EMOTES[0].roleId;
const YC = Emotes_1.EMOTES[1].roleId;
const RC = Emotes_1.EMOTES[2].roleId;
const BC = Emotes_1.EMOTES[3].roleId;
const PC = Emotes_1.EMOTES[4].roleId;
const Colors_1 = require("../utility/uuid/Colors");
const utils_2 = require("../utility/utils");
const register_done_1 = require("../utility/embeds/register-done");
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
        const [rows] = await db_1.default.query("SELECT pp_cash, refer_tickets, total_purchases, registration_date, total_referred, spv FROM users WHERE user_id = ?", [targetUserId]);
        if (rows.length > 0) {
            const { pp_cash, refer_tickets, total_purchases, registration_date, total_referred } = rows[0];
            const spv = parseFloat(rows[0].spv) || 0.00;
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
            const spvRounded = Math.round(spv);
            const imageBuffer = await (0, spvImage_1.generateSPVImage)(spvRounded);
            const attachment = new discord_js_1.AttachmentBuilder(imageBuffer, { name: "spv.png" });
            const embed = new discord_js_1.EmbedBuilder()
                .setColor(Colors_1.YELLOW_EMBED)
                .setAuthor({
                name: "Prince-Kun • Profile Info",
                iconURL: utils_2.ProfileAuthorPicture,
            })
                .setThumbnail("attachment://spv.png")
                .setTitle("ItsMe Prince Shop")
                .setDescription(`${YC} **Name:** <@${targetUserId}>\n` +
                `${YC} **Username:** ${targetUsername}\n` +
                `${YC} **UserID:** ${targetUserId}\n` +
                `${YC} **Registered on:** ${formattedDate}\n` +
                `${YC} **__SPV:__** ${spv.toFixed(2)}\n\n` +
                `**📦 Inventory & Stats**\n` +
                `${YC} \`PP Cash          \` • \`${AA}\`\n` +
                `${YC} \`Referral Tickets \` • \`${BB}\`\n` +
                `${YC} \`Total Purchases  \` • \`${CC}\`\n` +
                `${YC} \`Total Referred   \` • \`${DD}\`\n\n` +
                `**🍱 Extra**\n` +
                `${GC} \`1 PP Cash = 1₹\`\n` +
                `${GC} To know rules & information, type \`.?shoprules\``)
                .setFooter({ text: `${targetUsername}`, iconURL: avatarURL })
                .setTimestamp();
            const websiteButton = new discord_js_1.ButtonBuilder()
                .setLabel("Visit Shop Website")
                .setStyle(discord_js_1.ButtonStyle.Link)
                .setURL(utils_1.WebsiteLink);
            const row = new discord_js_1.ActionRowBuilder().addComponents(websiteButton);
            await interaction.reply({
                embeds: [embed],
                components: [row],
                files: [attachment]
            });
            const MessageString = `[ DATABASE ] User ${targetDisplayName} (${targetUserId}) fetched profile`;
            (0, logger_custom_1.logger_custom)(targetDisplayName, "profile", MessageString);
            return;
        }
        const embed = new discord_js_1.EmbedBuilder()
            .setColor(Colors_1.COLOR_PRIMARY)
            .setAuthor({
            name: "Prince-Kun • ItsMe Prince Shop",
            iconURL: utils_2.ProfileAuthorPicture,
        })
            .setTitle("Rules & Information")
            .setThumbnail(interaction.user.displayAvatarURL())
            .setTitle("ItsMe Prince Shop - Profile Registeration")
            .setDescription(itsmeprince_rules_1.ItsMePrinceRules + `**You accept the rules by registering and you also agree to any future updates or changes in the value of PP CASH. It is your responsibility to stay updated with the latest rules.**`)
            .setFooter({ text: `${targetDisplayName}`, iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp();
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
                    embeds: [(0, register_done_1.getRegistrationSuccessEmbed)(interaction.user)],
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
