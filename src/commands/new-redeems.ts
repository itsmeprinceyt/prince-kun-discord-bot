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

const userCache = new Map<string, { username: string; avatarURL: string }>();

const botUpdatesCommand: Command = {
    data: new SlashCommandBuilder()
        .setName("new-redeems")
        .setDescription("Send an embed message to announce new redeems (admin only)."),

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

        userCache.set(interaction.user.id, {
            username: interaction.user.username,
            avatarURL: interaction.user.displayAvatarURL(),
        });

        logger_command_sent(interaction);

        const modal = new ModalBuilder()
            .setCustomId("newRedeemsModal")
            .setTitle("New Redeems Message");

        const messageInput = new TextInputBuilder()
            .setCustomId("newRedeemsMessage")
            .setLabel("Enter new redeems:")
            .setStyle(TextInputStyle.Paragraph);

        const actionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(messageInput);
        modal.addComponents(actionRow);

        await interaction.showModal(modal);
    },
};

export default botUpdatesCommand;

export async function handleRedeemModalSubmit(interaction: ModalSubmitInteraction) {
    if (interaction.customId !== "newRedeemsModal") return;

    const messageContent = interaction.fields.getTextInputValue("newRedeemsMessage");
    const userInfo = userCache.get(interaction.user.id);
    const username = userInfo?.username || "Unknown User";
    const avatarURL = userInfo?.avatarURL || interaction.user.displayAvatarURL();

    const embed = new EmbedBuilder()
        .setColor(0xffffff)
        .setDescription(messageContent)

    await interaction.reply({
        content: "✅ New redeems sent!",
        flags: 64,
    });

    logger_custom(username,"new-redeems modal submit","New redeems sent successfully!");

    const channel = interaction.channel as TextChannel;
    if (channel) {
        await channel.send({ embeds: [embed] });
    }
}