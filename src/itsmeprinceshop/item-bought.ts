import {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    EmbedBuilder,
    User,
    PermissionFlagsBits
} from "discord.js";
import pool from "../db";
import { Command } from "../types/Command.type";
import { logger_NoDM_NoAdmin } from "../utility/loggers/logger-NoDM-NoAdmin";
import { logger_custom } from "../utility/loggers/logger-custom";
import { TextChannels } from "../utility/uuid/TextChannels";
import { calculateSPV } from "../utility/spv/spvCalculator";
import { RolesPerms } from "../utility/uuid/RolesPerms";
import { SERVER_ID, LOGO_GENSHIN, LOGO_HSR, LOGO_Wuwa, LOGO_ZZZ } from "../utility/utils";
import { COLOR_TRUE } from "../utility/uuid/Colors";
const ORDER_LOG_CHANNEL_ID = TextChannels[1].roleId;
const adminId = RolesPerms[5].roleId;

const itemBoughtCommand: Command = {
    data: new SlashCommandBuilder()
        .setName("item-bought")
        .setDescription("Log an item purchase for a user.")
        .addStringOption((option) =>
            option.setName("game")
                .setDescription("Select game")
                .setRequired(true)
                .addChoices(
                    { name: "Genshin Impact", value: "genshin" },
                    { name: "Honkai Star Rail", value: "hsr" },
                    { name: "Wuthering Waves", value: "wuwa" },
                    { name: "Zenless Zone Zero", value: "zzz" }
                )
        )
        .addStringOption(option =>
            option.setName("item")
                .setDescription("Enter the name of the item bought.")
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option.setName("price")
                .setDescription("Enter the price of the item.")
                .setRequired(true)
        )
        .addUserOption(option =>
            option.setName("user")
                .setDescription("Mention a user (if they are in Discord).")
                .setRequired(false)
        )
        .addStringOption(option =>
            option.setName("username")
                .setDescription("Enter the username (if the user is not in Discord).")
                .setRequired(false)
        )
        .addBooleanOption(option =>
            option.setName("use_pp_cash")
                .setDescription("Use PP Cash for discount (only for registered users).")
                .setRequired(false)
        )
        .addIntegerOption(option =>
            option.setName("pp_scale")
                .setDescription("How much PP Cash to use (1-20 scale).")
                .setRequired(false)
        ) as SlashCommandBuilder,


    async execute(interaction: ChatInputCommandInteraction) {
        if (interaction.guild) {
            if (!interaction.memberPermissions?.has(PermissionFlagsBits.Administrator)) {
                await interaction.reply({
                    content: "This is a Server-Only Command! 🖕",
                    flags: 64,
                });
                logger_NoDM_NoAdmin(interaction);
                return;
            }
        } else if (interaction.user.id !== adminId) {
            await interaction.reply("❌ Only the bot admin can use this command in DMs!");
            logger_NoDM_NoAdmin(interaction);
            return;
        }

        const game = interaction.options.getString("game", true);
        const mentionedUser: User | null = interaction.options.getUser("user");
        const usernameInput: string | null = interaction.options.getString("username");
        const item = interaction.options.getString("item", true);
        let price = interaction.options.getInteger("price", true);
        const usePPCash = interaction.options.getBoolean("use_pp_cash") || false;
        const ppScale = interaction.options.getInteger("pp_scale") || 0;

        if (usePPCash && (ppScale < 1 || ppScale > 20)) {
            await interaction.reply({ content: "❌ PP Scale must be between 1 and 20.", flags: 64 });
            return;
        }

        let targetUserId: string | null = mentionedUser ? mentionedUser.id : null;
        let targetUsername: string = mentionedUser ? mentionedUser.username : usernameInput || "Unknown";
        let targetAvatar: string = mentionedUser ? mentionedUser.displayAvatarURL() : "";
        let imageUrl: string = ``;
        let boughtText: string = ``;

        if (game === "genshin") {
            imageUrl = LOGO_GENSHIN;
            boughtText = `Genshin Impact - `;
        } else if (game === "hsr") {
            imageUrl = LOGO_HSR;
            boughtText = `Honkai Star Rail - `;
        } else if (game === "wuwa") {
            imageUrl = LOGO_Wuwa;
            boughtText = `Wuthering Waves - `;
        } else if (game === "zzz") {
            imageUrl = LOGO_ZZZ;
            boughtText = `Zenless Zone Zero - `;
        }

        if (!targetUserId && !usernameInput) {
            await interaction.reply({ content: "❌ Please mention a user or provide a username.", flags: 64 });
            return;
        }

        const [rows]: any = targetUserId
            ? await pool.query("SELECT * FROM users WHERE user_id = ?", [targetUserId])
            : [[]];

        if (!rows || rows.length === 0) {
            const botGuild = await interaction.client.guilds.fetch(SERVER_ID);
            const orderLogChannel = await botGuild.channels.fetch(ORDER_LOG_CHANNEL_ID);

            let embed: EmbedBuilder;
            let logMessage: string;

            if (mentionedUser) {
                embed = new EmbedBuilder()
                    .setColor(COLOR_TRUE)
                    .setTitle("Purchase Successful")
                    .setThumbnail(imageUrl)
                    .setDescription(`Ordered by: <@${targetUserId}>\nBought: ${boughtText} **${item}**\nPrice: **${price} INR/-**\n\nRegister today using \`/register\`\nTo know more, type \`.?shoprules\``)
                    .setFooter({ text: targetUsername, iconURL: targetAvatar })
                    .setTimestamp();
                logMessage = `User ${mentionedUser.username} (ID: ${mentionedUser.id}) bought ${item} for ${price} INR/- , but is not registered.`;
            } else {
                embed = new EmbedBuilder()
                    .setColor(COLOR_TRUE)
                    .setTitle("Purchase Successful")
                    .setThumbnail(imageUrl)
                    .setDescription(`Ordered by: **${targetUsername}**\nBought: ${boughtText} **${item}**\nPrice: **${price} INR/-**`)
                    .setTimestamp();
                logMessage = `Unregistered user ${targetUsername} bought ${item} for ${price} INR/-`;
            }
            if (orderLogChannel?.isTextBased()) {
                await orderLogChannel.send({ embeds: [embed] });
            }
            await interaction.reply({ content: `✅ Purchase logged in the order log channel! Check: <#${ORDER_LOG_CHANNEL_ID}>`, flags: 64 });
            logger_custom("ADMIN", "item-bought", logMessage);
            return;
        }

        const referralTickets = Math.floor(price / 300);
        let finalEmbed: string = ``;

let DiscordUserRegisteredBut300Below: string = `Ordered by: <@${targetUserId}>\nBought: ${boughtText} **${item}**\nPrice: **${price} INR/-**\n\nTo know more, type \`.?shoprules\``;

let referralText: string = referralTickets === 1 ? "Referral Ticket 🎟️" : "Referral Tickets 🎟️";
let DiscordUserRegisteredBut300Above: string = `Ordered by: <@${targetUserId}>\nBought: ${boughtText} **${item}**\nPrice: **${price} INR/-**\n\nReward: **You got \`${referralTickets}\` ${referralText} which you can convert to 💵 PP Cash by referring your friend!**\n\nCheck your profile using \`/profile\`\nTo know more, type \`.?shoprules\``;

let DiscordUserRegisteredBut300Above_UsingPPCASH: string = `Ordered by: <@${targetUserId}>\nBought: ${boughtText} **${item}**\nOriginal Price: **${price} INR/-**\nDiscounted Price: **${price - ppScale} INR/-**\n\nReward: **You used \`${ppScale} PP Cash💵\` and got \`₹${ppScale}\` discount and \`${referralTickets}\` ${referralText} ! If you want to earn more \`PP Cash💵\` then make sure to refer to your friends!**\n\nCheck your profile using \`/profile\`\nTo know more, type \`.?shoprules\``;

        finalEmbed = DiscordUserRegisteredBut300Below;
        if (usePPCash && price > 400) {
            if (usePPCash && (ppScale < 1 || ppScale > 20)) {
            await interaction.reply({ content: "❌ PP Scale must be between 1 and 20.", flags: 64 });
            return;
        }
            let { pp_cash, refer_tickets, total_purchases, total_referred } = rows[0];
            let spv = parseFloat(rows[0].spv) || 0.00;
            let ppToDeduct: number = ppScale;

            if (pp_cash < ppToDeduct) {
                await interaction.reply({ content: "❌ Not enough PP Cash to use this scale.", flags: 64 });
                return;
            }

            pp_cash -= ppToDeduct;
            price -= ppToDeduct;
            const updatedReferTickets: number = refer_tickets + referralTickets;
            const updatedTotalPurchases: number = total_purchases + 1;
            spv = calculateSPV(pp_cash, updatedReferTickets, updatedTotalPurchases, total_referred);

            await pool.query("UPDATE users SET pp_cash = ? , refer_tickets = ? , total_purchases = ? , spv = ? WHERE user_id = ?", [pp_cash, updatedReferTickets, updatedTotalPurchases, spv.toFixed(2), targetUserId]);
            finalEmbed = DiscordUserRegisteredBut300Above_UsingPPCASH;

        } else if (price >= 300) {
            const { pp_cash, refer_tickets, total_purchases, total_referred } = rows[0];
            let spv = parseFloat(rows[0].spv) || 0.00;
            const updatedTotalPurchases = total_purchases + 1;
            const updatedReferTickets = refer_tickets + referralTickets;
            spv = calculateSPV(pp_cash, updatedReferTickets, updatedTotalPurchases, total_referred);
            
            await pool.query(
                "UPDATE users SET total_purchases = ? , refer_tickets = ?, spv = ? WHERE user_id = ?",
                [updatedTotalPurchases, updatedReferTickets, parseFloat(spv.toFixed(2)), targetUserId]
            );
            finalEmbed = DiscordUserRegisteredBut300Above;
        }
        const embed = new EmbedBuilder()
            .setColor(COLOR_TRUE)
            .setTitle("Purchase Successful")
            .setThumbnail(imageUrl)
            .setDescription(finalEmbed)
            .setFooter({ text: targetUsername, iconURL: targetAvatar })
            .setTimestamp();

        if (!interaction.guild) {
            const botGuild = await interaction.client.guilds.fetch(SERVER_ID);
            const orderLogChannel = await botGuild.channels.fetch(ORDER_LOG_CHANNEL_ID);
            if (orderLogChannel?.isTextBased()) {
                await orderLogChannel.send({ embeds: [embed] });
            }
            await interaction.reply({ content: `✅ Purchase logged in the order log channel! Check: <#${ORDER_LOG_CHANNEL_ID}>`, flags: 64 });
        } else {
            await interaction.reply({ embeds: [embed] });
        }

        logger_custom("ADMIN", "item-bought", `User ${targetUsername} bought ${item} for ${price} INR/-`);
    }
};

export default itemBoughtCommand;