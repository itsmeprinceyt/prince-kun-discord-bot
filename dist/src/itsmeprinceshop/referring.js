"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const db_1 = __importDefault(require("../db"));
const logger_NoDM_NoAdmin_1 = require("../utility/logger-NoDM-NoAdmin");
const logger_custom_1 = require("../utility/logger-custom");
const text_channels_1 = require("../utility/text-channels");
const rolePerms_1 = require("../utility/rolePerms");
const PREDEFINED_SERVER_ID = "310675536340844544";
const ORDER_LOG_CHANNEL_ID = text_channels_1.TextChannels[1].roleId;
const adminId = rolePerms_1.RolesPerms[5].roleId;
const DefaultImageGenshin = "https://media.discordapp.net/attachments/1336322293437038602/1342230984464138392/gi-logo.png";
const DefaultImageHSR = "https://media.discordapp.net/attachments/1336322293437038602/1342230984728252498/hsr-logo.png";
const DefaultImageWuwa = "https://media.discordapp.net/attachments/1336322293437038602/1342230985034567761/www-logo.png";
const DefaultImageZZZ = "https://media.discordapp.net/attachments/1336322293437038602/1342230985579823206/zzz-logo.png";
const referring = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName("referring")
        .setDescription("Process a referral between two users.")
        .addUserOption(option => option.setName("referrer")
        .setDescription("User who is referring someone.")
        .setRequired(true))
        .addUserOption(option => option.setName("referred")
        .setDescription("User who is being referred.")
        .setRequired(true))
        .addStringOption((option) => option.setName("game")
        .setDescription("Select game")
        .setRequired(true)
        .addChoices({ name: "Genshin Impact", value: "genshin" }, { name: "Honkai Star Rail", value: "hsr" }, { name: "Wuthering Waves", value: "wuwa" }, { name: "Zenless Zone Zero", value: "zzz" }))
        .addStringOption(option => option.setName("item")
        .setDescription("Enter the name of the item bought.")
        .setRequired(true))
        .addIntegerOption(option => option.setName("price")
        .setDescription("Enter the price of the item.")
        .setRequired(true)),
    async execute(interaction) {
        if (interaction.guild) {
            if (!interaction.memberPermissions?.has(discord_js_1.PermissionFlagsBits.Administrator)) {
                await interaction.reply({
                    content: "This is a Server-Only Command! 🖕",
                    flags: 64,
                });
                (0, logger_NoDM_NoAdmin_1.logger_NoDM_NoAdmin)(interaction);
                return;
            }
        }
        else if (interaction.user.id !== adminId) {
            await interaction.reply("❌ Only the bot admin can use this command in DMs!");
            (0, logger_NoDM_NoAdmin_1.logger_NoDM_NoAdmin)(interaction);
            return;
        }
        const botGuild = await interaction.client.guilds.fetch(PREDEFINED_SERVER_ID);
        const orderLogChannel = await botGuild.channels.fetch(ORDER_LOG_CHANNEL_ID);
        const referrer = interaction.options.getUser("referrer", true);
        const referred = interaction.options.getUser("referred", true);
        const game = interaction.options.getString("game", true);
        const item = interaction.options.getString("item", true);
        const price = interaction.options.getInteger("price", true);
        let referrer_username = referrer.username;
        let referrer_avatar = referrer.displayAvatarURL();
        let referred_username = referred.username;
        //let referred_avatar: string = referred.displayAvatarURL();
        let imageUrl = ``;
        let boughtText = ``;
        let logMessage;
        if (game === "genshin") {
            imageUrl = DefaultImageGenshin;
            boughtText = `Genshin Impact - `;
        }
        else if (game === "hsr") {
            imageUrl = DefaultImageHSR;
            boughtText = `Honkai Star Rail - `;
        }
        else if (game === "wuwa") {
            imageUrl = DefaultImageWuwa;
            boughtText = `Wuthering Waves - `;
        }
        else if (game === "zzz") {
            imageUrl = DefaultImageZZZ;
            boughtText = `Zenless Zone Zero - `;
        }
        const [referrerRows] = await db_1.default.query("SELECT * FROM users WHERE user_id = ?", [referrer.id]);
        if (!referrerRows || referrerRows.length === 0) {
            const embed = new discord_js_1.EmbedBuilder()
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
            (0, logger_custom_1.logger_custom)("ADMIN", "item-bought", logMessage);
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
            (0, logger_custom_1.logger_custom)("ADMIN", "item-bought", logMessage);
            return;
        }
        await db_1.default.query("UPDATE users SET refer_tickets = refer_tickets - 1, total_referred = total_referred + 1, pp_cash = pp_cash + 10 WHERE user_id = ?", [referrer.id]);
        const [referredRows] = await db_1.default.query("SELECT * FROM users WHERE user_id = ?", [referred.id]);
        if (!referredRows || referredRows.length === 0) {
            const embed = new discord_js_1.EmbedBuilder()
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
            (0, logger_custom_1.logger_custom)("ADMIN", "item-bought", logMessage);
            if (orderLogChannel?.isTextBased()) {
                await orderLogChannel.send({ embeds: [embed] });
            }
            return;
        }
        const referredData = referredRows[0];
        let rewardText = ``;
        if (price >= 300) {
            const referralTicketsEarned = Math.floor(price / 300);
            await db_1.default.query("UPDATE users SET refer_tickets = refer_tickets + ?, total_purchases = total_purchases + 1 WHERE user_id = ?", [referralTicketsEarned, referred.id]);
            rewardText = `<@${referred.id}>, you earned yourself **${referralTicketsEarned} Referral Ticket🎟️** which you can convert to 💵 PP Cash by referring your friend!**\n\n`;
        }
        else if (price > 0) {
            await db_1.default.query("UPDATE users SET total_purchases = total_purchases + 1 WHERE user_id = ?", [referred.id]);
        }
        const embed = new discord_js_1.EmbedBuilder()
            .setColor(0x00ff00)
            .setTitle("Referral Processed Successfully")
            .setThumbnail(imageUrl)
            .setDescription(`Referral: <@${referrer.id}>
                    Referred: <@${referred.id}>
                    Bought: ${boughtText} **${item}**
                    Price: **${price}**\n
                    **Rewards:**\n<@${referrer.id}> used **1 Referral Ticket🎟️** and got **10 PP Cash💵** which you can use when purchasing any item from the shop!!\n\n`
            + rewardText + `
                    Check your profile using \`/profile\`
                    To know more, type \`.?shoprules\``)
            .setFooter({ text: `${referrer_username} referred ${referred_username}`, iconURL: referrer_avatar })
            .setTimestamp();
        logMessage = `User ${referrer.username} (ID: ${referrer.id}) referred ${referred.username} (ID: ${referred.id}) who bought ${item} for ${price}`;
        (0, logger_custom_1.logger_custom)("ADMIN", "item-bought", logMessage);
        await interaction.reply({ content: `✅ Purchase logged in the order log channel! Check: <#${ORDER_LOG_CHANNEL_ID}>`, flags: 64 });
        if (orderLogChannel?.isTextBased()) {
            await orderLogChannel.send({ embeds: [embed] });
        }
    }
};
exports.default = referring;
