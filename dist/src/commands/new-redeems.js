"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleRedeemModalSubmit = handleRedeemModalSubmit;
const discord_js_1 = require("discord.js");
const logger_NoDM_NoAdmin_1 = require("../utility/logger-NoDM-NoAdmin");
const logger_command_sent_1 = require("../utility/logger-command-sent");
const logger_custom_1 = require("../utility/logger-custom");
const userCache = new Map();
const botUpdatesCommand = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName("new-redeems")
        .setDescription("Send an embed message to announce new redeems (admin only)."),
    async execute(interaction) {
        const isDM = !interaction.guild;
        if (isDM) {
            await interaction.reply({
                content: "This is a Server-Only Command! 🖕",
                flags: 64,
            });
            (0, logger_NoDM_NoAdmin_1.logger_NoDM_NoAdmin)(interaction);
            return;
        }
        const ownerId = interaction.guild.ownerId;
        if (interaction.user.id !== ownerId) {
            await interaction.reply({
                content: "🚫 Only the server owner can use this command!",
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
            .setCustomId("newRedeemsModal")
            .setTitle("New Redeems Message");
        const messageInput = new discord_js_1.TextInputBuilder()
            .setCustomId("newRedeemsMessage")
            .setLabel("Enter new redeems:")
            .setStyle(discord_js_1.TextInputStyle.Paragraph);
        const actionRow = new discord_js_1.ActionRowBuilder().addComponents(messageInput);
        modal.addComponents(actionRow);
        await interaction.showModal(modal);
    },
};
exports.default = botUpdatesCommand;
async function handleRedeemModalSubmit(interaction) {
    if (interaction.customId !== "newRedeemsModal")
        return;
    const messageContent = interaction.fields.getTextInputValue("newRedeemsMessage");
    const userInfo = userCache.get(interaction.user.id);
    const username = userInfo?.username || "Unknown User";
    const avatarURL = userInfo?.avatarURL || interaction.user.displayAvatarURL();
    const embed = new discord_js_1.EmbedBuilder()
        .setColor(0xffffff)
        .setDescription(messageContent);
    await interaction.reply({
        content: "✅ New redeems sent!",
        flags: 64,
    });
    (0, logger_custom_1.logger_custom)(username, "new-redeems modal submit", "New redeems sent successfully!");
    const channel = interaction.channel;
    if (channel) {
        await channel.send({ embeds: [embed] });
    }
}
