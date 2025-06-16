import { Message, EmbedBuilder } from "discord.js";
import { SPECS } from "../utility/commands/pc-specs";
import { COLOR_PRIMARY } from "../utility/uuid/Colors";
import { PCSpecs, ProfileAuthorPicture } from "../utility/utils";

export default {
    triggers: [".?pcspecs", ".?specs",".?specifications",".?pc",".?pppc"],
    async execute(message: Message) {
        const embed = new EmbedBuilder()
            .setColor(COLOR_PRIMARY)
            .setAuthor({
                name: "Prince-Kun • PC Specs",
                iconURL: ProfileAuthorPicture,
            })
            .setTitle("Setup Specifications")
            .setDescription(SPECS)
            .setImage(PCSpecs)
            .setFooter({ text: `${message.author.username}`, iconURL: message.author.displayAvatarURL() })
            .setTimestamp();

        await message.reply({ embeds: [embed] });
    },
};
