"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleModalSubmit = handleModalSubmit;
const discord_js_1 = require("discord.js");
const logger_NoDM_NoAdmin_1 = require("../utility/logger-NoDM-NoAdmin");
const logger_custom_1 = require("../utility/logger-custom");
const rolePerms_1 = require("../utility/rolePerms");
const adminId = rolePerms_1.RolesPerms[5].roleId;
const BroadcastYouTube = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName("sending-dm")
        .setDescription("Sends a DM to all guild members with a custom message."),
    async execute(interaction) {
        if (interaction.user.id !== adminId) {
            await interaction.reply({
                content: "🚫 You do not have permission to use this command!",
                flags: 64
            });
            (0, logger_NoDM_NoAdmin_1.logger_NoDM_NoAdmin)(interaction);
            return;
        }
        const modal = new discord_js_1.ModalBuilder()
            .setCustomId("broadcastYouTubeModal")
            .setTitle("Broadcast Message");
        const messageInput = new discord_js_1.TextInputBuilder()
            .setCustomId("broadcastMessage")
            .setLabel("Enter the message to send:")
            .setStyle(discord_js_1.TextInputStyle.Paragraph);
        const actionRow = new discord_js_1.ActionRowBuilder().addComponents(messageInput);
        modal.addComponents(actionRow);
        await interaction.showModal(modal);
    }
};
exports.default = BroadcastYouTube;
async function handleModalSubmit(interaction) {
    if (interaction.customId !== "broadcastYouTubeModal")
        return;
    const messageContent = interaction.fields.getTextInputValue("broadcastMessage");
    const guild = interaction.guild;
    if (!guild) {
        await interaction.reply({
            content: "❌ This command can only be used in a server!",
            flags: 64
        });
        return;
    }
    await interaction.reply({
        content: "⏳ Sending messages to all members...",
        flags: 64
    });
    let sentCount = 0;
    let failedCount = 0;
    const members = await guild.members.fetch();
    for (const [_, member] of members) {
        if (!member.user.bot) {
            try {
                await member.send(messageContent);
                sentCount++;
                console.log(`✅ Sent message to: ${member} | ${sentCount}`);
            }
            catch (error) {
                failedCount++;
                console.log(`❌ Failed to send: ${member} | ${failedCount}`);
            }
        }
    }
    await interaction.followUp({
        content: `✅ Sent messages: ${sentCount}\n❌ Failed to send: ${failedCount}`,
        flags: 64
    });
    (0, logger_custom_1.logger_custom)(interaction.user.username, "broadcast-youtube", `Sent messages: ${sentCount}, Failed: ${failedCount}`);
}
