import {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    TextChannel,
} from "discord.js";

import { Command } from "../types/Command";
import { logger_NoDM_NoAdmin } from "../utility/logger-NoDM-NoAdmin";

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
        ) as SlashCommandBuilder,

    async execute(interaction: ChatInputCommandInteraction) {
        const isDM = !interaction.guild;
        const location = isDM ? "DM" : `Server: ${interaction.guild?.name}`;
        if (isDM) {
            await interaction.reply({
                content: "This is a Server-Only Command! 🖕",
                flags: 64,
            });
            logger_NoDM_NoAdmin(interaction);
            return;
        }

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

export default DonationBot;