"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const logger_NoDM_NoAdmin_1 = require("../utility/loggers/logger-NoDM-NoAdmin");
const Colors_1 = require("../utility/uuid/Colors");
const utils_1 = require("../utility/utils");
const DonationBot = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName("donation-bot")
        .setDescription("Log a donation for a bot.")
        .addUserOption(option => option.setName("user")
        .setDescription("Select the sponsor user.")
        .setRequired(true))
        .addStringOption(option => option.setName("bot-name")
        .setDescription("Enter the bot's name.")
        .setRequired(true))
        .addStringOption(option => option.setName("card-code")
        .setDescription("Enter the card code.")
        .setRequired(true))
        .addStringOption(option => option.setName("reason")
        .setDescription("Enter the reason for donation.")
        .setRequired(true))
        .addStringOption(option => option.setName("image")
        .setDescription("Optional image URL to attach to the embed.")
        .setRequired(false)),
    async execute(interaction) {
        try {
            const isDM = !interaction.guild;
            const location = isDM ? "DM" : `Server: ${interaction.guild?.name}`;
            if (isDM) {
                await interaction.reply({
                    content: "🚫 This is a **Server-Only** command!",
                    flags: 64,
                });
                (0, logger_NoDM_NoAdmin_1.logger_NoDM_NoAdmin)(interaction);
                return;
            }
            const ownerId = interaction.guild.ownerId;
            if (interaction.user.id !== ownerId) {
                await interaction.reply({
                    content: "🚫 Only the **server owner** can use this command.",
                    flags: 64,
                });
                (0, logger_NoDM_NoAdmin_1.logger_NoDM_NoAdmin)(interaction);
                return;
            }
            const user = interaction.options.getUser("user", true);
            const botName = interaction.options.getString("bot-name", true);
            const cardCode = interaction.options.getString("card-code", true);
            const reason = interaction.options.getString("reason", true);
            const imageUrl = interaction.options.getString("image");
            const donationEmbed = new discord_js_1.EmbedBuilder()
                .setColor(Colors_1.COLOR_PRIMARY)
                .setAuthor({
                name: "Prince-Kun • Donation Ping",
                iconURL: utils_1.ProfileAuthorPicture,
            })
                .setThumbnail(user.displayAvatarURL() || utils_1.DiscordBotProfilePicture)
                .setDescription(`**Sponsor:** ${user}\n` +
                `**Bot:** ${botName}\n` +
                `**Item:** ${cardCode}\n` +
                `**Reason:** ${reason}`)
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
        }
        catch (error) {
            console.error("Donation Command Error:", error);
            await interaction.reply({
                content: "⚠️ An unexpected error occurred while logging the donation. Please try again later or contact the developer.",
                ephemeral: true
            });
        }
    }
};
exports.default = DonationBot;
