import {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    EmbedBuilder,
    User,
    PermissionFlagsBits,
    TextChannel
} from "discord.js";
import pool from "../db";
import { Command } from "../types/Command";
import { logger_NoDM_NoAdmin } from "../utility/logger-NoDM-NoAdmin";
import { logger_custom } from "../utility/logger-custom";
import { TextChannels } from "../utility/text-channels";
import { RolesPerms } from "../utility/rolePerms";

const PREDEFINED_SERVER_ID = "310675536340844544";
const ORDER_LOG_CHANNEL_ID = TextChannels[1].roleId;
const adminId = RolesPerms[5].roleId;

const DefaultImageGenshin = "https://media.discordapp.net/attachments/1336322293437038602/1342230984464138392/gi-logo.png";
const DefaultImageHSR = "https://media.discordapp.net/attachments/1336322293437038602/1342230984728252498/hsr-logo.png";
const DefaultImageWuwa = "https://media.discordapp.net/attachments/1336322293437038602/1342230985034567761/www-logo.png";
const DefaultImageZZZ = "https://media.discordapp.net/attachments/1336322293437038602/1342230985579823206/zzz-logo.png";

const referring: Command = {
    data: new SlashCommandBuilder()
        .setName("referring")
        .setDescription("Process a referral between two users.")
        .addUserOption(option =>
            option.setName("referrer")
                .setDescription("User who is referring someone.")
                .setRequired(true)
        )
        .addUserOption(option =>
            option.setName("referred")
                .setDescription("User who is being referred.")
                .setRequired(true)
        )
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
        ) as SlashCommandBuilder,

    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
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

        const botGuild = await interaction.client.guilds.fetch(PREDEFINED_SERVER_ID);
        const orderLogChannel = await botGuild.channels.fetch(ORDER_LOG_CHANNEL_ID);

        const referrer: User = interaction.options.getUser("referrer", true);
        const referred: User = interaction.options.getUser("referred", true);
        const game = interaction.options.getString("game", true);
        const item = interaction.options.getString("item", true);
        const price = interaction.options.getInteger("price", true);

        let referrer_username: string = referrer.username;
        let referrer_avatar: string = referrer.displayAvatarURL();
        let referred_username: string = referred.username;
        //let referred_avatar: string = referred.displayAvatarURL();
        let imageUrl = ``;
        let boughtText = ``;
        let logMessage: string;

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

        const [referrerRows]: any = await pool.query("SELECT * FROM users WHERE user_id = ?", [referrer.id]);
        if (!referrerRows || referrerRows.length === 0) {

            const embed = new EmbedBuilder()
                .setColor(0x00ff00)
                .setTitle("Referral Processed Successfully")
                .setThumbnail(imageUrl)
                .setDescription(`Referral: <@${referrer.id}>
                    Referred: <@${referred.id}>
                    Bought: ${boughtText} **${item}**
                    Price: **${price}**\n
                    <@${referrer.id}> register today using \`/register\`
                    To know more, type \`.?shoprules\``)
                .setFooter({ text: referrer_username, iconURL: referrer_avatar })
                .setTimestamp();

            logMessage = `User ${referred.username} (ID: ${referred.id}) bought ${item} for ${price}, but is not registered.`;
            logger_custom("ADMIN", "item-bought", logMessage);

            await interaction.reply({ content: `✅ Order logged but, ❌ the referrer <@${referrer.id}> is not registered! Check: <#${ORDER_LOG_CHANNEL_ID}>`, flags: 64 });

            if (orderLogChannel?.isTextBased()) {
                await orderLogChannel.send({ embeds: [embed] });
            }
            return;
        }
        const referrerData = referrerRows[0];

        if (referrerData.refer_tickets < 1) {
            await interaction.reply({ content: `❌Order not logged as <@${referrer.id}> does not have enough referral tickets!`, flags: 64 });

            logMessage = `User ${referrer.username} (ID: ${referrer.id}) could not refer due to insufficient referral tickets!.`;
            logger_custom("ADMIN", "item-bought", logMessage);

            return;
        }

        await pool.query("UPDATE users SET refer_tickets = refer_tickets - 1, total_referred = total_referred + 1, pp_cash = pp_cash + 10 WHERE user_id = ?", [referrer.id]);

        const [referredRows]: any = await pool.query("SELECT * FROM users WHERE user_id = ?", [referred.id]);
        if (!referredRows || referredRows.length === 0) {


            const embed = new EmbedBuilder()
                .setColor(0x00ff00)
                .setTitle("Referral Processed Successfully")
                .setThumbnail(imageUrl)
                .setDescription(`Referral: <@${referrer.id}>
                    Referred: <@${referred.id}>
                    Bought: ${boughtText} **${item}**
                    Price: **${price}**\n
                    **Reward:**\n<@${referrer.id}> used **1 Referral Ticket🎟️** and got **10 PP Cash💵** which you can use when purchasing any item from the shop!!\n
                    Hey <@${referred.id}>, you should probably register using \`/register\`\n
                    Check your profile using \`/profile\`
                    To know more, type \`.?shoprules\``)
                .setFooter({ text: `${referrer_username} referred ${referred_username}`, iconURL: referrer_avatar })
                .setTimestamp();

            await interaction.reply({
                content: `✅Order Logged, but the referred user <@${referred.id}> is not registered,❌ so they did not receive any referred rewards. Check: <#${ORDER_LOG_CHANNEL_ID}>`,
                flags: 64
            });

            logMessage = `User ${referrer.username} (ID: ${referrer.id}) referred ${referred.username} (ID: ${referred.id}) who bought ${item} for ${price}, but is not registered.`;
            logger_custom("ADMIN", "item-bought", logMessage);

            if (orderLogChannel?.isTextBased()) {
                await orderLogChannel.send({ embeds: [embed] });
            }
            return;
        }

        const referredData = referredRows[0];
        let rewardText = ``;

        if (price >= 300) {
            const referralTicketsEarned = Math.floor(price / 300);
            await pool.query("UPDATE users SET refer_tickets = refer_tickets + ?, total_purchases = total_purchases + 1 WHERE user_id = ?", [referralTicketsEarned, referred.id]);

            rewardText = `<@${referred.id}> earned yourself ${referralTicketsEarned} which you can convert to 💵 PP Cash by referring your friend!**\n\n`;
        } else if (price > 0) {
            await pool.query(
                "UPDATE users SET total_purchases = total_purchases + 1 WHERE user_id = ?",
                [referred.id]
            );
        }

        const embed = new EmbedBuilder()
            .setColor(0x00ff00)
            .setTitle("Referral Processed Successfully")
            .setThumbnail(imageUrl)
            .setDescription(`Referral: <@${referrer.id}>
                    Referred: <@${referred.id}>
                    Bought: ${boughtText} **${item}**
                    Price: **${price}**\n
                    **Rewards:**\n<@${referrer.id}> used **1 Referral Ticket🎟️** got **10 PP Cash💵** which you can use when purchasing any item from the shop!!\n\n`
                + rewardText + `
                    Check your profile using \`/profile\`
                    To know more, type \`.?shoprules\``)
            .setFooter({ text: `${referrer_username} referred ${referred_username}`, iconURL: referrer_avatar })
            .setTimestamp();

        logMessage = `User ${referrer.username} (ID: ${referrer.id}) referred ${referred.username} (ID: ${referred.id}) who bought ${item} for ${price}`;
        logger_custom("ADMIN", "item-bought", logMessage);

        await interaction.reply({ content: `✅ Purchase logged in the order log channel! Check: <#${ORDER_LOG_CHANNEL_ID}>`, flags: 64 });

        if (orderLogChannel?.isTextBased()) {
            await orderLogChannel.send({ embeds: [embed] });
        }
    }
};

export default referring;
