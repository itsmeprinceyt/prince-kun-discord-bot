"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleServerModalSubmit = handleServerModalSubmit;
const discord_js_1 = require("discord.js");
const logger_command_sent_1 = require("../utility/loggers/logger-command-sent");
const logger_NoDM_NoAdmin_1 = require("../utility/loggers/logger-NoDM-NoAdmin");
const logger_custom_1 = require("../utility/loggers/logger-custom");
const PingRoles_1 = require("../utility/uuid/PingRoles");
const Colors_1 = require("../utility/uuid/Colors");
const utils_1 = require("../utility/utils");
const changesRoleId = PingRoles_1.PING_Roles[0].roleId;
const userCache = new Map();
const serverUpdatesCommand = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName("server-updates")
        .setDescription("Send an embed message for server updates (admin only)."),
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
        (0, logger_command_sent_1.logger_command_sent)(interaction);
        const modal = new discord_js_1.ModalBuilder()
            .setCustomId("serverUpdatesModal")
            .setTitle("Server Update Message");
        const messageInput = new discord_js_1.TextInputBuilder()
            .setCustomId("serverUpdateMessage")
            .setLabel("Enter the update message:")
            .setStyle(discord_js_1.TextInputStyle.Paragraph);
        const actionRow = new discord_js_1.ActionRowBuilder().addComponents(messageInput);
        modal.addComponents(actionRow);
        await interaction.showModal(modal);
    },
};
exports.default = serverUpdatesCommand;
async function handleServerModalSubmit(interaction) {
    if (interaction.customId !== "serverUpdatesModal")
        return;
    const messageContent = interaction.fields.getTextInputValue("serverUpdateMessage");
    const userInfo = userCache.get(interaction.user.id);
    const username = userInfo?.username || "Unknown User";
    const avatarURL = userInfo?.avatarURL || interaction.user.displayAvatarURL();
    const embed = new discord_js_1.EmbedBuilder()
        .setColor(Colors_1.COLOR_PRIMARY)
        .setAuthor({
        name: "Prince-Kun • Server Update",
        iconURL: utils_1.ProfileAuthorPicture,
    })
        .setTitle("📢 Latest Server Changes & Improvements!")
        .setDescription(messageContent)
        .setImage(utils_1.ServerUpdates)
        .setTimestamp();
    await interaction.reply({
        content: "✅ Server update message sent!",
        flags: 64,
    });
    (0, logger_custom_1.logger_custom)(username, "server-updates modal submit", "Server update sent successfully!");
    const channel = interaction.channel;
    if (channel) {
        await channel.send({
            content: `<@&${changesRoleId}>`,
            embeds: [embed],
        });
    }
}
