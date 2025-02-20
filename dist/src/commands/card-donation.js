"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
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
        .setRequired(true)),
    async execute(interaction) {
        const user = interaction.options.getUser("user", true);
        const botName = interaction.options.getString("bot-name", true);
        const cardCode = interaction.options.getString("card-code", true);
        const reason = interaction.options.getString("reason", true);
        const donationMessage = `**Sponsor:** ${user}\n**Bot:** ${botName}\n**Item:** ${cardCode}\n**Reason:** ${reason}`;
        await interaction.reply({
            content: donationMessage
        });
    }
};
exports.default = DonationBot;
