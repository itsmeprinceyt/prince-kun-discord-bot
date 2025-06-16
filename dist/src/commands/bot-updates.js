"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleModalSubmit = handleModalSubmit;
const discord_js_1 = require("discord.js");
const logger_NoDM_NoAdmin_1 = require("../utility/loggers/logger-NoDM-NoAdmin");
const logger_command_sent_1 = require("../utility/loggers/logger-command-sent");
const logger_custom_1 = require("../utility/loggers/logger-custom");
const utils_1 = require("../utility/utils");
const userCache = new Map();
const botUpdatesCommand = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName("bot-updates")
        .setDescription("Send an embed message for bot updates (admin only)."),
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
            .setCustomId("botUpdatesModal")
            .setTitle("Bot Update Message");
        const messageInput = new discord_js_1.TextInputBuilder()
            .setCustomId("botUpdateMessage")
            .setLabel("Enter the update message:")
            .setStyle(discord_js_1.TextInputStyle.Paragraph);
        const actionRow = new discord_js_1.ActionRowBuilder().addComponents(messageInput);
        modal.addComponents(actionRow);
        await interaction.showModal(modal);
    },
};
exports.default = botUpdatesCommand;
async function handleModalSubmit(interaction) {
    if (interaction.customId !== "botUpdatesModal")
        return;
    const messageContent = interaction.fields.getTextInputValue("botUpdateMessage");
    const userInfo = userCache.get(interaction.user.id);
    const username = userInfo?.username || "Unknown User";
    const avatarURL = userInfo?.avatarURL || interaction.user.displayAvatarURL();
    const embed = new discord_js_1.EmbedBuilder()
        .setColor(0xffffff)
        .setAuthor({
        name: "Prince-Kun • Bot Update",
        iconURL: utils_1.ProfileAuthorPicture,
    })
        .setTitle("🛠️ Changelog: Latest Updates & Improvements!")
        .setDescription(messageContent)
        .setImage(utils_1.BotUpdates)
        .setFooter({ text: `${username}`, iconURL: avatarURL })
        .setTimestamp();
    await interaction.reply({
        content: "✅ Update message sent!",
        flags: 64,
    });
    (0, logger_custom_1.logger_custom)(username, "bot-updates modal submit", "Update sent successfully!");
    const channel = interaction.channel;
    if (channel) {
        await channel.send({ embeds: [embed] });
    }
}
