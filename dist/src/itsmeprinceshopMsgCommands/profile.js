"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const db_1 = __importDefault(require("../db"));
const emotes_1 = require("../utility/emotes");
const GC = emotes_1.EMOTES[0].roleId;
const YC = emotes_1.EMOTES[1].roleId;
const RC = emotes_1.EMOTES[2].roleId;
const BC = emotes_1.EMOTES[3].roleId;
const PC = emotes_1.EMOTES[4].roleId;
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
        const [rows] = await db_1.default.query("SELECT pp_cash, refer_tickets, total_purchases, registration_date, total_referred FROM users WHERE user_id = ?", [targetUserId]);
        if (message.mentions.users.first() && rows.length === 0) {
            return message.reply(`${message.author}, that user is not registered. Ask them register using \`/register\`.`);
        }
        else if (!message.mentions.users.first() && rows.length === 0) {
            return message.reply("You are not registered. Use \`/register\` to register.");
        }
        if (rows.length > 0) {
            const { pp_cash, refer_tickets, total_purchases, registration_date, total_referred } = rows[0];
            const AA = String(pp_cash).padEnd(8, " ");
            const BB = String(refer_tickets).padEnd(8, " ");
            const CC = String(total_purchases).padEnd(8, " ");
            const DD = String(total_referred).padEnd(8, " ");
            const formattedDate = (0, moment_timezone_1.default)(registration_date).tz("Asia/Kolkata").format("DD MMM YYYY, hh:mm A");
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
            await message.channel.send({ embeds: [embed] });
            return;
        }
    }
};
exports.default = profileCommand;
