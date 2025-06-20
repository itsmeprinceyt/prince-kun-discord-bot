"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.leaderboard = void 0;
const discord_js_1 = require("discord.js");
const db_1 = __importDefault(require("../db"));
const logger_custom_1 = require("../utility/loggers/logger-custom");
const Colors_1 = require("../utility/uuid/Colors");
const utils_1 = require("../utility/utils");
exports.leaderboard = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName('shop-leaderboard')
        .setDescription('View the leaderboard')
        .addStringOption(option => option.setName('option')
        .setDescription('Select the field to sort by')
        .setRequired(false)
        .addChoices({ name: 'PP Cash', value: 'pp_cash' }, { name: 'Referral Tickets', value: 'refer_tickets' }, { name: 'Total Purchases', value: 'total_purchases' }, { name: 'Total Referred', value: 'total_referred' })),
    execute: async function (interaction) {
        const option = interaction.options.getString('option');
        const sortBy = option || 'spv';
        const fieldNames = {
            'pp_cash': '- PP Cash',
            'refer_tickets': '- Referral Tickets',
            'total_purchases': '- Total Purchases',
            'total_referred': '- Total Referred',
            'spv': ''
        };
        try {
            const [rows] = await db_1.default.query(`SELECT user_id, pp_cash, refer_tickets, total_purchases, total_referred, spv 
                FROM users ORDER BY ${sortBy} DESC LIMIT 15`);
            if (!Array.isArray(rows) || rows.length === 0) {
                await interaction.reply({ content: '❌ No data found!', flags: 64 });
                return;
            }
            let leaderboardTitle = `\`${"ID ".padEnd(4)}\` ` +
                `\`${"💵".padEnd(5)}\` ` +
                `\`${"🎟️".padEnd(5)}\` ` +
                `\`${"🛒".padEnd(5)}\` ` +
                `\`${"👥".padEnd(5)}\` ` +
                `\`${"SPV".padEnd(6)}\` ` +
                `\`User\` `;
            let leaderboard = rows
                .map((user, index) => `\`${String(index + 1).padEnd(4)}\` ` +
                `\`${String(user.pp_cash).padEnd(5)}\` ` +
                `\`${String(user.refer_tickets).padEnd(5)}\` ` +
                `\`${String(user.total_purchases).padEnd(5)}\` ` +
                `\`${String(user.total_referred).padEnd(5)}\` ` +
                `\`${String((parseFloat(user.spv) || 0).toFixed(2)).padEnd(6)}\` ` +
                `<@${user.user_id}>`)
                .join('\n');
            let CASHTitle = `\`${"ID".padEnd(4)}\` ` +
                `\`${"💵".padEnd(5)}\` ` +
                `\`User\` `;
            let CASH = rows
                .map((user, index) => `\`${String(index + 1).padEnd(4)}\` ` +
                `\`${String(user.pp_cash).padEnd(5)}\` ` +
                `<@${user.user_id}>`)
                .join('\n');
            let RTTitle = `\`${"ID".padEnd(4)}\` ` +
                `\`${"🎟️".padEnd(5)}\` ` +
                `\`User\` `;
            let RT = rows
                .map((user, index) => `\`${String(index + 1).padEnd(4)}\` ` +
                `\`${String(user.refer_tickets).padEnd(5)}\` ` +
                `<@${user.user_id}>`)
                .join('\n');
            let TPTitle = `\`${"ID".padEnd(4)}\` ` +
                `\`${"🛒".padEnd(5)}\` ` +
                `\`User\` `;
            let TP = rows
                .map((user, index) => `\`${String(index + 1).padEnd(4)}\` ` +
                `\`${String(user.total_purchases).padEnd(5)}\` ` +
                `<@${user.user_id}>`)
                .join('\n');
            let TRTitle = `\`${"ID".padEnd(4)}\` ` +
                `\`${"👥".padEnd(5)}\` ` +
                `\`User\` `;
            let TR = rows
                .map((user, index) => `\`${String(index + 1).padEnd(4)}\` ` +
                `\`${String(user.total_referred).padEnd(5)}\` ` +
                `<@${user.user_id}>`)
                .join('\n');
            let finalDescription = leaderboard;
            let finalTitle = leaderboardTitle;
            switch (option) {
                case "pp_cash":
                    finalDescription = CASH;
                    finalTitle = CASHTitle;
                    break;
                case "refer_tickets":
                    finalDescription = RT;
                    finalTitle = RTTitle;
                    break;
                case "total_purchases":
                    finalDescription = TP;
                    finalTitle = TPTitle;
                    break;
                case "total_referred":
                    finalDescription = TR;
                    finalTitle = TRTitle;
                    break;
            }
            const embed = new discord_js_1.EmbedBuilder()
                .setColor(Colors_1.COLOR_TRUE)
                .setTitle(`🏆 Leaderboard ${fieldNames[sortBy]}`)
                .setAuthor({
                name: "Prince-Kun • ItsMe Prince Shop Leaderboard",
                iconURL: utils_1.ProfileAuthorPicture,
            })
                .setDescription(finalTitle
                +
                    `\n`
                + finalDescription)
                .setTimestamp();
            await interaction.reply({ embeds: [embed] });
            const targetUser = interaction.user;
            const targetUserId = targetUser.id;
            let targetDisplayName = targetUser.username;
            const MessageString = ` User ${targetDisplayName} (${targetUserId}) used /shop-leaderboard-${sortBy}`;
            (0, logger_custom_1.logger_custom)(targetDisplayName, "shop-leaderboard", MessageString);
        }
        catch (error) {
            console.error('Error fetching leaderboard:', error);
            await interaction.reply({ content: '❌ An error occurred while fetching the leaderboard.', flags: 64 });
        }
    }
};
exports.default = exports.leaderboard;
