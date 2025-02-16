"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleShopModalSubmit = handleShopModalSubmit;
const discord_js_1 = require("discord.js");
const logger_NoDM_NoAdmin_1 = require("../utility/logger-NoDM-NoAdmin");
const logger_command_sent_1 = require("../utility/logger-command-sent");
const logger_custom_1 = require("../utility/logger-custom");
const roles_1 = require("../utility/roles");
const rolePerms_1 = require("../utility/rolePerms");
const StockUpdate = roles_1.Roles[5].roleId;
const MarketUpdate = roles_1.Roles[4].roleId;
const ShopManager = rolePerms_1.RolesPerms[1].roleId;
const userCache = new Map();
const ShopUpdateCommand = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName("shop-updates")
        .setDescription("Send an embed message for server updates (admin only)."),
    async execute(interaction) {
        const isDM = !interaction.guild;
        const location = isDM ? "DM" : `Server: ${interaction.guild?.name}`;
        if (isDM) {
            await interaction.reply({
                content: "This is a Server-Only Command! 🖕",
                flags: 64,
            });
            (0, logger_NoDM_NoAdmin_1.logger_NoDM_NoAdmin)(interaction);
            return;
        }
        const ownerId = interaction.guild.ownerId;
        const member = interaction.member;
        const userRoles = member.roles.cache.map((role) => role.id);
        const hasRequiredRole = userRoles.includes(ShopManager);
        if (interaction.user.id !== ownerId && !hasRequiredRole) {
            await interaction.reply({
                content: "🚫 Only the server owner or users with the required role can use this command!",
                flags: 64,
            });
            (0, logger_NoDM_NoAdmin_1.logger_NoDM_NoAdmin)(interaction);
            return;
        }
        userCache.set(interaction.user.id, {
            username: interaction.user.username,
            avatarURL: interaction.user.displayAvatarURL(),
        });
        (0, logger_command_sent_1.logger_command_sent)(interaction);
        const modal = new discord_js_1.ModalBuilder()
            .setCustomId("shopUpdateModal")
            .setTitle("Shop Update Message");
        const messageInput = new discord_js_1.TextInputBuilder()
            .setCustomId("shopUpdateMessage")
            .setLabel("Enter the update message:")
            .setStyle(discord_js_1.TextInputStyle.Paragraph);
        const actionRow = new discord_js_1.ActionRowBuilder().addComponents(messageInput);
        modal.addComponents(actionRow);
        await interaction.showModal(modal);
    },
};
exports.default = ShopUpdateCommand;
async function handleShopModalSubmit(interaction) {
    if (interaction.customId !== "shopUpdateModal")
        return;
    const messageContent = interaction.fields.getTextInputValue("shopUpdateMessage");
    const userInfo = userCache.get(interaction.user.id);
    const username = userInfo?.username || "Unknown User";
    const avatarURL = userInfo?.avatarURL || interaction.user.displayAvatarURL();
    const embed = new discord_js_1.EmbedBuilder()
        .setColor(0xff6767)
        .setTitle("📢 LATEST SHOP UPDATES")
        .setDescription(messageContent)
        .setFooter({ text: `${username}`, iconURL: avatarURL })
        .setTimestamp();
    await interaction.reply({
        content: "✅ Shop update message sent!",
        flags: 64,
    });
    (0, logger_custom_1.logger_custom)(username, "shop-updates modal submit", "Shop update sent successfully!");
    const channel = interaction.channel;
    if (channel) {
        await channel.send({
            content: `<@&${StockUpdate}> <@&${MarketUpdate}>`,
            embeds: [embed],
        });
    }
}
