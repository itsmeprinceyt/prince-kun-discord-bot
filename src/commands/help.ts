import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { Command } from "../types/Command.type";
import { HelpDescription } from "../utility/commands/help/help-commands";
import { COLOR_PRIMARY } from "../utility/uuid/Colors";
import { ProfileAuthorPicture, Help } from "../utility/utils";

const HelpCommand: Command = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Get a list of all available commands."),
    
    async execute(interaction: ChatInputCommandInteraction) {
        const embed = new EmbedBuilder()
            .setColor(COLOR_PRIMARY)
            .setAuthor({
                name: "Prince-Kun • Commands",
                iconURL: ProfileAuthorPicture,
            })
            .setTitle("Here are all the available commands you can use!")
            .setDescription(HelpDescription)
            .setImage(Help)
            .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp();

        try {
            await interaction.deferReply({ flags:64 });
            await interaction.user.send({ embeds: [embed] });

            await interaction.editReply({
                content: "📩 I've sent you a DM with all the available commands!",
            });
        } catch (error) {
            console.error("Failed to send DM:", error);
            await interaction.editReply({
                content: "⚠️ I couldn't send you a DM! Please check your privacy settings.",
            });
        }
    }
};

export default HelpCommand;
