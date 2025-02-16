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

import { Command } from "../types/Command";
import { logger_NoDM_NoAdmin } from "../utility/logger-NoDM-NoAdmin";
import { logger_command_sent } from "../utility/logger-command-sent";
import { logger_custom } from "../utility/logger-custom";

import { Roles } from "../utility/roles";
const changesRoleId = Roles[0].roleId;

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
        .setColor(0xffffff)
        .setAuthor({
            name: "Prince-Kun • Server Update",
            iconURL: "https://media.discordapp.net/attachments/1336322293437038602/1336322635939975168/Profile_Pic_2.jpg",
        })
        .setTitle("📢 Latest Server Changes & Improvements!")
        .setDescription(messageContent)
        .setImage("https://media.discordapp.net/attachments/1336322293437038602/1337156724628525127/Server_Changes.png")
        .setFooter({ text: `${username}`, iconURL: avatarURL })
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
