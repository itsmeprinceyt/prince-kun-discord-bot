"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const db_1 = __importDefault(require("../db"));
const logger_custom_1 = require("../utility/logger-custom");
const text_channels_1 = require("../utility/text-channels");
const rolePerms_1 = require("../utility/rolePerms");
const PREDEFINED_SERVER_ID = "310675536340844544";
const ORDER_LOG_CHANNEL_ID = text_channels_1.TextChannels[1].roleId;
const adminId = rolePerms_1.RolesPerms[5].roleId;
const itemBoughtCommand = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName("item-bought")
        .setDescription("Log an item purchase for a user.")
        .addStringOption(option => option.setName("item")
        .setDescription("Enter the name of the item bought.")
        .setRequired(true))
        .addIntegerOption(option => option.setName("price")
        .setDescription("Enter the price of the item.")
        .setRequired(true))
        .addUserOption(option => option.setName("user")
        .setDescription("Mention a user (if they are in Discord).")
        .setRequired(false))
        .addStringOption(option => option.setName("username")
        .setDescription("Enter the username (if the user is not in Discord).")
        .setRequired(false)),
    async execute(interaction) {
        if (interaction.guild) {
            if (!interaction.memberPermissions?.has(discord_js_1.PermissionFlagsBits.Administrator)) {
                await interaction.reply({
                    content: "This is a Server-Only Command! 🖕",
                    flags: 64,
                });
                return;
            }
        }
        else if (interaction.user.id !== adminId) {
            await interaction.reply("❌ Only the bot admin can use this command in DMs!");
            return;
        }
        const mentionedUser = interaction.options.getUser("user");
        const usernameInput = interaction.options.getString("username");
        const item = interaction.options.getString("item", true);
        const price = interaction.options.getInteger("price", true);
        let targetUserId = mentionedUser ? mentionedUser.id : null;
        let targetUsername = mentionedUser ? mentionedUser.username : usernameInput || "Unknown";
        let targetAvatar = mentionedUser ? mentionedUser.displayAvatarURL() : "";
        if (!targetUserId && !usernameInput) {
            await interaction.reply({ content: "❌ Please mention a user or provide a username.", flags: 64 });
            return;
        }
        const [rows] = targetUserId
            ? await db_1.default.query("SELECT * FROM users WHERE user_id = ?", [targetUserId])
            : [[]];
        if (!rows || rows.length === 0) {
            const botGuild = await interaction.client.guilds.fetch(PREDEFINED_SERVER_ID);
            const orderLogChannel = await botGuild.channels.fetch(ORDER_LOG_CHANNEL_ID);
            let embed;
            let logMessage;
            if (mentionedUser) {
                embed = new discord_js_1.EmbedBuilder()
                    .setColor(0x00ff00)
                    .setTitle("Purchase Successful")
                    .setThumbnail(targetAvatar)
                    .setDescription(`
                        Ordered by: <@${targetUserId}>
                        Bought: **${item}**
                        Price: **${price}**\n
                        Register today using \`/register\`
                        To know more, type \`.?shoprules\``)
                    .setFooter({ text: targetUsername, iconURL: targetAvatar })
                    .setTimestamp();
                logMessage = `User ${mentionedUser.username} (ID: ${mentionedUser.id}) bought ${item} for ${price}, but is not registered.`;
            }
            else {
                embed = new discord_js_1.EmbedBuilder()
                    .setColor(0x00ff00)
                    .setTitle("Purchase Successful")
                    .setDescription(`Ordered by: **${targetUsername}**\nBought: **${item}**\nPrice: **${price}**`)
                    .setTimestamp();
                logMessage = `Unregistered user ${targetUsername} bought ${item} for ${price}.`;
            }
            if (orderLogChannel?.isTextBased()) {
                await orderLogChannel.send({ embeds: [embed] });
            }
            await interaction.reply({ content: `✅ Purchase logged in the order log channel! Check: <#${ORDER_LOG_CHANNEL_ID}>`, flags: 64 });
            (0, logger_custom_1.logger_custom)(targetUsername, "item-bought", logMessage);
            return;
        }
        await db_1.default.query("UPDATE users SET total_purchases = total_purchases + 1 WHERE user_id = ?", [targetUserId]);
        const referralTickets = Math.floor(price / 300);
        let finalEmbed = ``;
        let DiscordUserRegisteredBut300Below = `
        Ordered by: <@${targetUserId}>
        Bought: **${item}**
        Price: **${price}**\n
        To know more, type \`.?shoprules\``;
        let referralText = referralTickets === 1 ? "Referral Ticket 🎟️" : "Referral Tickets 🎟️";
        let DiscordUserRegisteredBut300Above = `
        Ordered by: <@${targetUserId}>
        Bought: **${item}**
        Price: **${price}**\n
        Reward: **You got \`${referralTickets}\` ${referralText} which you can convert to 💵 PP Cash by referring your friend!**\n
        Check your profile using \`/profile\`
        To know more, type \`.?shoprules\``;
        finalEmbed = DiscordUserRegisteredBut300Below;
        if (price >= 300) {
            await db_1.default.query("UPDATE users SET refer_tickets = refer_tickets + ? WHERE user_id = ?", [referralTickets, targetUserId]);
            finalEmbed = DiscordUserRegisteredBut300Above;
        }
        const embed = new discord_js_1.EmbedBuilder()
            .setColor(0x00ff00)
            .setTitle("Purchase Successful")
            .setThumbnail(targetAvatar)
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
        }
        else {
            await interaction.reply({ embeds: [embed] });
        }
        (0, logger_custom_1.logger_custom)(targetUsername, "item-bought", `User ${targetUsername} bought ${item} for ${price}.`);
    }
};
exports.default = itemBoughtCommand;
