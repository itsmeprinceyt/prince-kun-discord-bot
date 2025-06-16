import { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction, GuildMember } from 'discord.js';
import pool from '../db';
import { Command } from "../types/Command.type";
import { logger_custom } from "../utility/loggers/logger-custom";
import { COLOR_TRUE } from '../utility/uuid/Colors';
import { ProfileAuthorPicture } from '../utility/utils';

export const leaderboard: Command = {
    data: new SlashCommandBuilder()
        .setName('shop-leaderboard')
        .setDescription('View the leaderboard')
        .addStringOption(option =>
            option.setName('option')
                .setDescription('Select the field to sort by')
                .setRequired(false)
                .addChoices(
                    { name: 'PP Cash', value: 'pp_cash' },
                    { name: 'Referral Tickets', value: 'refer_tickets' },
                    { name: 'Total Purchases', value: 'total_purchases' },
                    { name: 'Total Referred', value: 'total_referred' }
                )
        ) as SlashCommandBuilder,

    execute: async function (interaction: ChatInputCommandInteraction) {
        const option: string | null = interaction.options.getString('option');
        const sortBy: string = option || 'spv';

        const fieldNames: Record<string, string> = {
            'pp_cash': '- PP Cash',
            'refer_tickets': '- Referral Tickets',
            'total_purchases': '- Total Purchases',
            'total_referred': '- Total Referred',
            'spv': ''
        };

        try {
            const [rows]: any = await pool.query(
                `SELECT user_id, pp_cash, refer_tickets, total_purchases, total_referred, spv 
                FROM users ORDER BY ${sortBy} DESC LIMIT 15`
            );

            if (!Array.isArray(rows) || rows.length === 0) {
                await interaction.reply({ content: '❌ No data found!', flags: 64 });
                return;
            }

            let leaderboardTitle =
                `\`${"ID ".padEnd(4)}\` ` +
                `\`${"💵".padEnd(5)}\` ` +
                `\`${"🎟️".padEnd(5)}\` ` +
                `\`${"🛒".padEnd(5)}\` ` +
                `\`${"👥".padEnd(5)}\` ` +
                `\`${"SPV".padEnd(6)}\` ` +
                `\`User\` `;


            let leaderboard = rows
                .map((user: any, index: number) =>
                    `\`${String(index + 1).padEnd(4)}\` ` +
                    `\`${String(user.pp_cash).padEnd(5)}\` ` +
                    `\`${String(user.refer_tickets).padEnd(5)}\` ` +
                    `\`${String(user.total_purchases).padEnd(5)}\` ` +
                    `\`${String(user.total_referred).padEnd(5)}\` ` +
                    `\`${String((parseFloat(user.spv) || 0).toFixed(2)).padEnd(6)}\` ` +
                    `<@${user.user_id}>`
                )
                .join('\n');

            let CASHTitle =
                `\`${"ID".padEnd(4)}\` ` +
                `\`${"💵".padEnd(5)}\` ` +
                `\`User\` `;

            let CASH = rows
                .map((user: any, index: number) =>
                    `\`${String(index + 1).padEnd(4)}\` ` +
                    `\`${String(user.pp_cash).padEnd(5)}\` ` +
                    `<@${user.user_id}>`
                )
                .join('\n');

            let RTTitle =
                `\`${"ID".padEnd(4)}\` ` +
                `\`${"🎟️".padEnd(5)}\` ` +
                `\`User\` `;

            let RT = rows
                .map((user: any, index: number) =>
                    `\`${String(index + 1).padEnd(4)}\` ` +
                    `\`${String(user.refer_tickets).padEnd(5)}\` ` +
                    `<@${user.user_id}>`
                )
                .join('\n');

            let TPTitle =
                `\`${"ID".padEnd(4)}\` ` +
                `\`${"🛒".padEnd(5)}\` ` +
                `\`User\` `;

            let TP = rows
                .map((user: any, index: number) =>
                    `\`${String(index + 1).padEnd(4)}\` ` +
                    `\`${String(user.total_purchases).padEnd(5)}\` ` +
                    `<@${user.user_id}>`
                )
                .join('\n');

            let TRTitle =
                `\`${"ID".padEnd(4)}\` ` +
                `\`${"👥".padEnd(5)}\` ` +
                `\`User\` `;

            let TR = rows
                .map((user: any, index: number) =>
                    `\`${String(index + 1).padEnd(4)}\` ` +
                    `\`${String(user.total_referred).padEnd(5)}\` ` +
                    `<@${user.user_id}>`
                )
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
            const embed = new EmbedBuilder()
                .setColor(COLOR_TRUE)
                .setTitle(`🏆 Leaderboard ${fieldNames[sortBy]}`)
                .setAuthor({
                    name: "Prince-Kun • ItsMe Prince Shop Leaderboard",
                    iconURL: ProfileAuthorPicture,
                })
                .setDescription(
                    finalTitle
                    +
                    `\n`
                    + finalDescription)
                .setTimestamp();
            await interaction.reply({ embeds: [embed] });

            const targetUser = interaction.user;
            const targetUserId: string = targetUser.id;
            let targetDisplayName: string = targetUser.username;
            const MessageString: string = ` User ${targetDisplayName} (${targetUserId}) used /shop-leaderboard-${sortBy}`;

            logger_custom(targetDisplayName, "shop-leaderboard", MessageString);
        } catch (error) {
            console.error('Error fetching leaderboard:', error);
            await interaction.reply({ content: '❌ An error occurred while fetching the leaderboard.', flags: 64 });
        }
    }
};

export default leaderboard;
