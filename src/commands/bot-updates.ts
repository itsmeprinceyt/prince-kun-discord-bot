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
        .setName("bot-updates")
        .setDescription("Send an embed message for bot updates (admin only)."),

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
            .setCustomId("botUpdatesModal")
            .setTitle("Bot Update Message");

        const messageInput = new TextInputBuilder()
            .setCustomId("botUpdateMessage")
            .setLabel("Enter the update message:")
            .setStyle(TextInputStyle.Paragraph);

        const actionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(messageInput);
        modal.addComponents(actionRow);

        await interaction.showModal(modal);
    },
};

export default botUpdatesCommand;

export async function handleModalSubmit(interaction: ModalSubmitInteraction) {
    if (interaction.customId !== "botUpdatesModal") return;

    const messageContent = interaction.fields.getTextInputValue("botUpdateMessage");
    const userInfo = userCache.get(interaction.user.id);
    const username = userInfo?.username || "Unknown User";
    const avatarURL = userInfo?.avatarURL || interaction.user.displayAvatarURL();

    const embed = new EmbedBuilder()
        .setColor(0xffffff)
        .setAuthor({
            name: "Prince-Kun • Bot Update",
            iconURL: "https://media.discordapp.net/attachments/1336322293437038602/1336322635939975168/Profile_Pic_2.jpg",
        })
        .setTitle("🛠️ Changelog: Latest Updates & Improvements!")
        .setDescription(messageContent)
        .setImage("https://media.discordapp.net/attachments/1336322293437038602/1336814350249365554/Bot_Updates.png")
        .setFooter({ text: `${username}`, iconURL: avatarURL })
        .setTimestamp();

        

    await interaction.reply({
        content: "✅ Update message sent!",
        flags: 64,
    });

    logger_custom(username,"bot-updates modal submit","Update sent successfully!");

    const channel = interaction.channel as TextChannel;
    if (channel) {
        await channel.send({ embeds: [embed] });
    }
}