"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const db_1 = __importDefault(require("../db"));
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
const profileCommand = {
    triggers: [".?profile"],
    async execute(message) {
        if (!message.guild) {
            return message.reply("You can only use \`/profile\` in DM");
        }
        const targetUser = message.mentions.users.first() || message.author;
        const targetUserId = targetUser.id;
        const targetUsername = targetUser.username;
        const avatarURL = targetUser.displayAvatarURL();
        const [rows] = await db_1.default.query("SELECT pp_cash, refer_tickets, total_purchases, registration_date, total_referred, spv FROM users WHERE user_id = ?", [targetUserId]);
        if (message.mentions.users.first() && rows.length === 0) {
            return message.reply(`${message.author}, that user is not registered. Ask them register using \`/register\`.`);
        }
        else if (!message.mentions.users.first() && rows.length === 0) {
            return message.reply("You are not registered. Use \`/register\` to register.");
        }
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
            await message.channel.send({ embeds: [embed], components: [row], files: [attachment] });
            return;
        }
    }
};
exports.default = profileCommand;
