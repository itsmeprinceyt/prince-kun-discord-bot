"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const db_1 = __importDefault(require("../db"));
const logger_NoDM_NoAdmin_1 = require("../utility/loggers/logger-NoDM-NoAdmin");
const logger_custom_1 = require("../utility/loggers/logger-custom");
const TextChannels_1 = require("../utility/uuid/TextChannels");
const spvCalculator_1 = require("../utility/spv/spvCalculator");
const RolesPerms_1 = require("../utility/uuid/RolesPerms");
const utils_1 = require("../utility/utils");
const Colors_1 = require("../utility/uuid/Colors");
const ORDER_LOG_CHANNEL_ID = TextChannels_1.TextChannels[1].roleId;
const adminId = RolesPerms_1.RolesPerms[5].roleId;
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
        const botGuild = await interaction.client.guilds.fetch(utils_1.SERVER_ID);
        const orderLogChannel = await botGuild.channels.fetch(ORDER_LOG_CHANNEL_ID);
        const referrer = interaction.options.getUser("referrer", true);
        const referred = interaction.options.getUser("referred", true);
        const game = interaction.options.getString("game", true);
        const item = interaction.options.getString("item", true);
        const price = interaction.options.getInteger("price", true);
        let referrer_username = referrer.username;
        let referrer_avatar = referrer.displayAvatarURL();
        let referred_username = referred.username;
        let imageUrl = ``;
        let boughtText = ``;
        let logMessage;
        if (game === "genshin") {
            imageUrl = utils_1.LOGO_GENSHIN;
            boughtText = `Genshin Impact - `;
        }
        else if (game === "hsr") {
            imageUrl = utils_1.LOGO_HSR;
            boughtText = `Honkai Star Rail - `;
        }
        else if (game === "wuwa") {
            imageUrl = utils_1.LOGO_Wuwa;
            boughtText = `Wuthering Waves - `;
        }
        else if (game === "zzz") {
            imageUrl = utils_1.LOGO_ZZZ;
            boughtText = `Zenless Zone Zero - `;
        }
        const [referrerRows] = await db_1.default.query("SELECT * FROM users WHERE user_id = ?", [referrer.id]);
        if (!referrerRows || referrerRows.length === 0) {
            const embed = new discord_js_1.EmbedBuilder()
                .setColor(Colors_1.COLOR_TRUE)
                .setTitle("Referral Processed Successfully")
                .setThumbnail(imageUrl)
                .setDescription(`Referral: <@${referrer.id}>
                    Referred: <@${referred.id}>
                    Bought: ${boughtText} **${item}**
                    Price: **${price} INR/-**\n
                    <@${referrer.id}> register today using \`/register\`
                    To know more, type \`.?shoprules\``)
                .setFooter({ text: referrer_username, iconURL: referrer_avatar })
                .setTimestamp();
            logMessage = `User ${referred.username} (ID: ${referred.id}) bought ${item} for ${price} INR/- , but is not registered.`;
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
        let { pp_cash, refer_tickets, total_purchases, total_referred } = referrerRows[0];
        let spv = parseFloat(referrerRows[0].spv) || 0.00;
        refer_tickets -= 1;
        total_referred += 1;
        pp_cash += 10;
        spv = (0, spvCalculator_1.calculateSPV)(pp_cash, refer_tickets, total_purchases, total_referred);
        await db_1.default.query("UPDATE users SET refer_tickets = ?, total_referred = ?, pp_cash = ?, spv = ? WHERE user_id = ?", [refer_tickets, total_referred, pp_cash, parseFloat(spv.toFixed(2)), referrer.id]);
        const [referredRows] = await db_1.default.query("SELECT * FROM users WHERE user_id = ?", [referred.id]);
        if (!referredRows || referredRows.length === 0) {
            const embed = new discord_js_1.EmbedBuilder()
                .setColor(Colors_1.COLOR_TRUE)
                .setTitle("Referral Processed Successfully")
                .setThumbnail(imageUrl)
                .setDescription(`Referral: <@${referrer.id}>
                    Referred: <@${referred.id}>
                    Bought: ${boughtText} **${item}**
                    Price: **${price} INR/-**\n
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
            logMessage = `User ${referrer.username} (ID: ${referrer.id}) referred ${referred.username} (ID: ${referred.id}) who bought ${item} for ${price} INR/- , but is not registered.`;
            (0, logger_custom_1.logger_custom)("ADMIN", "item-bought", logMessage);
            if (orderLogChannel?.isTextBased()) {
                await orderLogChannel.send({ embeds: [embed] });
            }
            return;
        }
        let rewardText = ``;
        if (price >= 300) {
            const referralTicketsEarned = Math.floor(price / 300);
            let { pp_cash, refer_tickets, total_purchases, total_referred } = referredRows[0];
            let spv = parseFloat(referredRows[0].spv) || 0.00;
            refer_tickets += referralTicketsEarned;
            total_purchases += 1;
            spv = (0, spvCalculator_1.calculateSPV)(pp_cash, refer_tickets, total_purchases, total_referred);
            await db_1.default.query("UPDATE users SET refer_tickets = ?, total_purchases = ?, spv = ? WHERE user_id = ?", [refer_tickets, total_purchases, parseFloat(spv.toFixed(2)), referred.id]);
            rewardText = `<@${referred.id}>, you earned yourself **${referralTicketsEarned} Referral Ticket🎟️** which you can convert to 💵 PP Cash by referring your friend!**\n\n`;
        }
        else if (price > 0) {
            let { pp_cash, refer_tickets, total_purchases, total_referred } = referrerRows[0];
            let spv = parseFloat(referrerRows[0].spv) || 0.00;
            total_purchases += 1;
            spv = (0, spvCalculator_1.calculateSPV)(pp_cash, refer_tickets, total_purchases, total_referred);
            await db_1.default.query("UPDATE users SET total_purchases = ?, spv = ? WHERE user_id = ?", [total_purchases, parseFloat(spv.toFixed(2)), referred.id]);
        }
        const embed = new discord_js_1.EmbedBuilder()
            .setColor(Colors_1.COLOR_TRUE)
            .setTitle("Referral Processed Successfully")
            .setThumbnail(imageUrl)
            .setDescription(`Referral: <@${referrer.id}>
                    Referred: <@${referred.id}>
                    Bought: ${boughtText} **${item}**
                    Price: **${price} INR/-**\n
                    **Rewards:**\n<@${referrer.id}> used **1 Referral Ticket🎟️** and got **10 PP Cash💵** which you can use when purchasing any item from the shop!!\n\n`
            + rewardText + `
                    Check your profile using \`/profile\`
                    To know more, type \`.?shoprules\``)
            .setFooter({ text: `${referrer_username} referred ${referred_username}`, iconURL: referrer_avatar })
            .setTimestamp();
        logMessage = `User ${referrer.username} (ID: ${referrer.id}) referred ${referred.username} (ID: ${referred.id}) who bought ${item} for ${price} INR/-`;
        (0, logger_custom_1.logger_custom)("ADMIN", "item-bought", logMessage);
        await interaction.reply({ content: `✅ Purchase logged in the order log channel! Check: <#${ORDER_LOG_CHANNEL_ID}>`, flags: 64 });
        if (orderLogChannel?.isTextBased()) {
            await orderLogChannel.send({ embeds: [embed] });
        }
    }
};
exports.default = referring;
