import {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    EmbedBuilder,
    TextInputBuilder,
    ModalBuilder,
    TextInputStyle,
    ActionRowBuilder,
    ModalSubmitInteraction,
    TextChannel
} from "discord.js";

import { Command } from "../types/Command.type";
import { logger_command_sent } from "../utility/loggers/logger-command-sent";
import { logger_NoDM_NoAdmin } from "../utility/loggers/logger-NoDM-NoAdmin";
import { logger_custom } from "../utility/loggers/logger-custom";
import { PING_Roles } from "../utility/uuid/PingRoles";
import { COLOR_PRIMARY } from "../utility/uuid/Colors";
import { ProfileAuthorPicture, ServerUpdates } from "../utility/utils";
const changesRoleId = PING_Roles[0].roleId;

const userCache = new Map<string, { username: string; avatarURL: string }>();

const serverUpdatesCommand: Command = {
    data: new SlashCommandBuilder()
        .setName("server-updates")
        .setDescription("Send an embed message for server updates (admin only)."),

    async execute(interaction: ChatInputCommandInteraction) {
        const isDM = !interaction.guild;
        if (isDM) {
            await interaction.reply({
                content: "This is a Server-Only Command! 🖕",
                flags: 64,
            });
            logger_NoDM_NoAdmin(interaction);
            return;
        }

        const ownerId = interaction.guild!.ownerId;
        if (interaction.user.id !== ownerId) {
            await interaction.reply({
                content: "🚫 Only the server owner can use this command!",
                flags: 64,
            });
            logger_NoDM_NoAdmin(interaction);
            return;
        }

        logger_command_sent(interaction);

        const modal = new ModalBuilder()
            .setCustomId("serverUpdatesModal")
            .setTitle("Server Update Message");

        const messageInput = new TextInputBuilder()
            .setCustomId("serverUpdateMessage")
            .setLabel("Enter the update message:")
            .setStyle(TextInputStyle.Paragraph);

        const actionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(messageInput);
        modal.addComponents(actionRow);

        await interaction.showModal(modal);
    },
};

export default serverUpdatesCommand;

export async function handleServerModalSubmit(interaction: ModalSubmitInteraction) {
    if (interaction.customId !== "serverUpdatesModal") return;

    const messageContent = interaction.fields.getTextInputValue("serverUpdateMessage");
    const userInfo = userCache.get(interaction.user.id);
    const username = userInfo?.username || "Unknown User";
    const avatarURL = userInfo?.avatarURL || interaction.user.displayAvatarURL();

    const embed = new EmbedBuilder()
        .setColor(COLOR_PRIMARY)
        .setAuthor({
            name: "Prince-Kun • Server Update",
            iconURL: ProfileAuthorPicture,
        })
        .setTitle("📢 Latest Server Changes & Improvements!")
        .setDescription(messageContent)
        .setImage(ServerUpdates)
        .setTimestamp();

    await interaction.reply({
        content: "✅ Server update message sent!",
        flags: 64,
    });

    logger_custom(username, "server-updates modal submit", "Server update sent successfully!");

    const channel = interaction.channel as TextChannel;
    if (channel) {
        await channel.send({
            content: `<@&${changesRoleId}>`,
            embeds: [embed],
        });
    }
}
