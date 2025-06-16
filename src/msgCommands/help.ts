import { Message, EmbedBuilder } from "discord.js";
import { HelpDescription } from "../utility/commands/help/help-commands";
import { Help, ProfileAuthorPicture } from "../utility/utils";

export default {
    triggers: [".?help"],
    async execute(message: Message) {
        const embed = new EmbedBuilder()
            .setColor(0xc200ff)
            .setAuthor({
                name: "Prince-Kun • Commands",
                iconURL: ProfileAuthorPicture,
            })
            .setTitle("Here are all the available commands which you can use!")
            .setDescription(HelpDescription)
            .setImage(Help)
            .setFooter({ text: `${message.author.username}`, iconURL: message.author.displayAvatarURL() })
            .setTimestamp();

        try {
            await message.author.send({ embeds: [embed] });
            if (message.guild) {
                await message.reply({
                    content: "📩 I've sent you a DM with all the available commands!",
                });
            }
        } catch (error) {
            console.error("Failed to send DM:", error);
            if (message.guild) {
                await message.reply({
                    content: "⚠️ I couldn't send you a DM! Please check your privacy settings.",
                });
            }
        }
    },
};
