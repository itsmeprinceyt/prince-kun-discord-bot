import {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    EmbedBuilder
} from "discord.js";

import { Command } from "../types/Command.type";
import { logger_NoDM_NoAdmin } from "../utility/loggers/logger-NoDM-NoAdmin";
import { COLOR_PRIMARY } from '../utility/uuid/Colors';
import { ProfileAuthorPicture, DiscordBotProfilePicture } from '../utility/utils';

const DonationBot: Command = {
    data: new SlashCommandBuilder()
        .setName("donation-bot")
        .setDescription("Log a donation for a bot.")
        .addUserOption(option =>
            option.setName("user")
                .setDescription("Select the sponsor user.")
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("bot-name")
                .setDescription("Enter the bot's name.")
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("card-code")
                .setDescription("Enter the card code.")
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("reason")
                .setDescription("Enter the reason for donation.")
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("image")
                .setDescription("Optional image URL to attach to the embed.")
                .setRequired(false)
        ) as SlashCommandBuilder,

    async execute(interaction: ChatInputCommandInteraction) {
        try {
            const isDM = !interaction.guild;
            const location = isDM ? "DM" : `Server: ${interaction.guild?.name}`;

            if (isDM) {
                await interaction.reply({
                    content: "🚫 This is a **Server-Only** command!",
                    flags: 64,
                });
                logger_NoDM_NoAdmin(interaction);
                return;
            }

            const ownerId = interaction.guild!.ownerId;
            if (interaction.user.id !== ownerId) {
                await interaction.reply({
                    content: "🚫 Only the **server owner** can use this command.",
                    flags: 64,
                });
                logger_NoDM_NoAdmin(interaction);
                return;
            }

            const user = interaction.options.getUser("user", true);
            const botName: string = interaction.options.getString("bot-name", true);
            const cardCode: string = interaction.options.getString("card-code", true);
            const reason: string = interaction.options.getString("reason", true);
            const imageUrl: string | null = interaction.options.getString("image");

            const donationEmbed = new EmbedBuilder()
                .setColor(COLOR_PRIMARY)
                .setAuthor({
                    name: "Prince-Kun • Donation Ping",
                    iconURL: ProfileAuthorPicture,
                })
                .setThumbnail(user.displayAvatarURL() || DiscordBotProfilePicture)
                .setDescription(
                    `**Sponsor:** ${user}\n` +
                    `**Bot:** ${botName}\n` +
                    `**Item:** ${cardCode}\n` +
                    `**Reason:** ${reason}`
                )
                .setTimestamp()
                .setFooter({
                    text: "Thanks for supporting!",
                    iconURL: interaction.user.displayAvatarURL()
                });

            if (imageUrl) {
                donationEmbed.setImage(imageUrl);
            }

            await interaction.reply({
                embeds: [donationEmbed]
            });

        } catch (error: any) {
            console.error("Donation Command Error:", error);
            await interaction.reply({
                content: "⚠️ An unexpected error occurred while logging the donation. Please try again later or contact the developer.",
                ephemeral: true
            });
        }
    }
};

export default DonationBot;
