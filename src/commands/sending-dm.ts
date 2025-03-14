import {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder,
    ModalSubmitInteraction
} from "discord.js";

import { Command } from "../types/Command";
import { logger_NoDM_NoAdmin } from "../utility/logger-NoDM-NoAdmin";
import { logger_custom } from "../utility/logger-custom";
import { RolesPerms } from "../utility/rolePerms";

const adminId = RolesPerms[5].roleId;

const BroadcastYouTube: Command = {
    data: new SlashCommandBuilder()
        .setName("sending-dm")
        .setDescription("Sends a DM to all guild members with a custom message.") as SlashCommandBuilder,

    async execute(interaction: ChatInputCommandInteraction) {
        if (interaction.user.id !== adminId) {
            await interaction.reply({
                content: "🚫 You do not have permission to use this command!",
                flags: 64
            });
            logger_NoDM_NoAdmin(interaction);
            return;
        }

        const modal = new ModalBuilder()
            .setCustomId("broadcastYouTubeModal")
            .setTitle("Broadcast Message");

        const messageInput = new TextInputBuilder()
            .setCustomId("broadcastMessage")
            .setLabel("Enter the message to send:")
            .setStyle(TextInputStyle.Paragraph);

        const actionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(messageInput);
        modal.addComponents(actionRow);

        await interaction.showModal(modal);
    }
};

export default BroadcastYouTube;

export async function handleModalSubmit(interaction: ModalSubmitInteraction) {
    if (interaction.customId !== "broadcastYouTubeModal") return;

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
                console.log(`✅ Sent message to: ${member} | ${sentCount}`)
            } catch (error) {
                failedCount++;
                console.log(`❌ Failed to send: ${member} | ${failedCount}`)
            }
        }
    }

    await interaction.followUp({
        content: `✅ Sent messages: ${sentCount}\n❌ Failed to send: ${failedCount}`,
        flags: 64
    });

    logger_custom(interaction.user.username, "broadcast-youtube", `Sent messages: ${sentCount}, Failed: ${failedCount}`);
}