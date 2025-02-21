import {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    EmbedBuilder,
    User,
    PermissionFlagsBits
} from "discord.js";
import pool from "../db";
import { Command } from "../types/Command";
import { logger_NoDM_NoAdmin } from "../utility/logger-NoDM-NoAdmin";
import { logger_custom } from "../utility/logger-custom";
import { TextChannels } from "../utility/text-channels";
import { calculateSPV } from "../utility/spvCalculator";
import { RolesPerms } from "../utility/rolePerms";

const PREDEFINED_SERVER_ID = "310675536340844544";
const ORDER_LOG_CHANNEL_ID = TextChannels[1].roleId;
const adminId = RolesPerms[5].roleId;

const DefaultImageGenshin = "https://media.discordapp.net/attachments/1336322293437038602/1342230984464138392/gi-logo.png";
const DefaultImageHSR = "https://media.discordapp.net/attachments/1336322293437038602/1342230984728252498/hsr-logo.png";
const DefaultImageWuwa = "https://media.discordapp.net/attachments/1336322293437038602/1342230985034567761/www-logo.png";
const DefaultImageZZZ = "https://media.discordapp.net/attachments/1336322293437038602/1342230985579823206/zzz-logo.png";


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
        const price = interaction.options.getInteger("price", true);

        let targetUserId: string | null = mentionedUser ? mentionedUser.id : null;
        let targetUsername: string = mentionedUser ? mentionedUser.username : usernameInput || "Unknown";
        let targetAvatar: string = mentionedUser ? mentionedUser.displayAvatarURL() : "";
        let imageUrl = ``;
        let boughtText = ``;

        if (game === "genshin") {
            imageUrl = DefaultImageGenshin;
            boughtText = `Genshin Impact - `;
        } else if (game === "hsr") {
            imageUrl = DefaultImageHSR;
            boughtText = `Honkai Star Rail - `;
        } else if (game === "wuwa") {
            imageUrl = DefaultImageWuwa;
            boughtText = `Wuthering Waves - `;
        } else if (game === "zzz") {
            imageUrl = DefaultImageZZZ;
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
            const botGuild = await interaction.client.guilds.fetch(PREDEFINED_SERVER_ID);
            const orderLogChannel = await botGuild.channels.fetch(ORDER_LOG_CHANNEL_ID);

            let embed: EmbedBuilder;
            let logMessage: string;

            if (mentionedUser) {
                embed = new EmbedBuilder()
                    .setColor(0x00ff00)
                    .setTitle("Purchase Successful")
                    .setThumbnail(imageUrl)
                    .setDescription(`
                        Ordered by: <@${targetUserId}>
                        Bought: ${boughtText} **${item}**
                        Price: **${price}**\n
                        Register today using \`/register\`
                        To know more, type \`.?shoprules\``
                    )
                    .setFooter({ text: targetUsername, iconURL: targetAvatar })
                    .setTimestamp();
                logMessage = `User ${mentionedUser.username} (ID: ${mentionedUser.id}) bought ${item} for ${price}, but is not registered.`;
            } else {
                embed = new EmbedBuilder()
                    .setColor(0x00ff00)
                    .setTitle("Purchase Successful")
                    .setThumbnail(imageUrl)
                    .setDescription(`Ordered by: **${targetUsername}**\nBought: ${boughtText} **${item}**\nPrice: **${price}**`)
                    .setTimestamp();
                logMessage = `Unregistered user ${targetUsername} bought ${item} for ${price}.`;
            }
            if (orderLogChannel?.isTextBased()) {
                await orderLogChannel.send({ embeds: [embed] });
            }
            await interaction.reply({ content: `✅ Purchase logged in the order log channel! Check: <#${ORDER_LOG_CHANNEL_ID}>`, flags: 64 });
            logger_custom("ADMIN", "item-bought", logMessage);
            return;
        }

        const { pp_cash, refer_tickets, total_purchases, registration_date, total_referred } = rows[0];
        let spv = parseFloat(rows[0].spv) || 0.00;
        const updatedTotalPurchases = total_purchases + 1;
        spv = calculateSPV(pp_cash, refer_tickets, updatedTotalPurchases, total_referred);
        await pool.query(
            "UPDATE users SET total_purchases = ?, spv = ? WHERE user_id = ?",
            [updatedTotalPurchases, parseFloat(spv.toFixed(2)), targetUserId]
        );

        const referralTickets = Math.floor(price / 300);
        let finalEmbed = ``;

        let DiscordUserRegisteredBut300Below = `
        Ordered by: <@${targetUserId}>
        Bought: ${boughtText} **${item}**
        Price: **${price}**\n
        To know more, type \`.?shoprules\``;

        let referralText = referralTickets === 1 ? "Referral Ticket 🎟️" : "Referral Tickets 🎟️";
        let DiscordUserRegisteredBut300Above = `
        Ordered by: <@${targetUserId}>
        Bought: ${boughtText} **${item}**
        Price: **${price}**\n
        Reward: **You got \`${referralTickets}\` ${referralText} which you can convert to 💵 PP Cash by referring your friend!**\n
        Check your profile using \`/profile\`
        To know more, type \`.?shoprules\``;


        finalEmbed = DiscordUserRegisteredBut300Below;
        if (price >= 300) {
            const { pp_cash, refer_tickets, total_purchases, total_referred } = rows[0];
            let spv = parseFloat(rows[0].spv) || 0.00;
            const updatedReferTickets = refer_tickets + referralTickets;
            spv = calculateSPV(pp_cash, updatedReferTickets, total_purchases, total_referred);
            await pool.query(
                "UPDATE users SET refer_tickets = ?, spv = ? WHERE user_id = ?",
                [updatedReferTickets, parseFloat(spv.toFixed(2)), targetUserId]
            );
            finalEmbed = DiscordUserRegisteredBut300Above;
        }
        const embed = new EmbedBuilder()
            .setColor(0x00ff00)
            .setTitle("Purchase Successful")
            .setThumbnail(imageUrl)
            .setDescription(finalEmbed)
            .setFooter({ text: targetUsername, iconURL: targetAvatar })
            .setTimestamp();

        if (!interaction.guild) {
            const botGuild = await interaction.client.guilds.fetch(PREDEFINED_SERVER_ID);
            const orderLogChannel = await botGuild.channels.fetch(ORDER_LOG_CHANNEL_ID);
            if (orderLogChannel?.isTextBased()) {
                await orderLogChannel.send({ embeds: [embed] });
            }
            await interaction.reply({ content: `✅ Purchase logged in the order log channel! Check: <#${ORDER_LOG_CHANNEL_ID}>`, flags: 64 });
        } else {
            await interaction.reply({ embeds: [embed] });
        }

        logger_custom("ADMIN", "item-bought", `User ${targetUsername} bought ${item} for ${price}.`);
    }
};

export default itemBoughtCommand;