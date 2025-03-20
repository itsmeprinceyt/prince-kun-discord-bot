import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { Command } from "../types/Command";
import { HelpDescription } from "../utility/help-commands";

const HelpCommand: Command = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Get a list of all available commands."),
    
    async execute(interaction: ChatInputCommandInteraction) {
        const embed = new EmbedBuilder()
            .setColor(0xc200ff)
            .setAuthor({
                name: "Prince-Kun • Commands",
                iconURL: "https://media.discordapp.net/attachments/1336322293437038602/1336322635939975168/Profile_Pic_2.jpg",
            })
            .setTitle("Here are all the available commands you can use!")
            .setDescription(HelpDescription)
            .setImage("https://media.discordapp.net/attachments/1336322293437038602/1336708310904340572/Help.png")
            .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp();

        try {
            await interaction.deferReply({ flags:64 }); // Prevents interaction timeout
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
