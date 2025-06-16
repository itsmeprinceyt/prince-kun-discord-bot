import { Message, EmbedBuilder } from "discord.js";
import { GuideList } from "../utility/commands/sofi-guide-list";
import { ProfileAuthorPicture, SofiGuide } from "../utility/utils";
import { COLOR_PRIMARY } from "../utility/uuid/Colors";

export default {
    triggers: [".?sofiguide", ".?sofiguides", ".?sofi-guide", ".?sofi-guides", ".?sofi"],
    async execute(message: Message) {
        const embed = new EmbedBuilder()
            .setColor(COLOR_PRIMARY)
            .setAuthor({
                name: "Prince-Kun • Guide",
                iconURL: ProfileAuthorPicture,
            })
            .setTitle("ItsMe Prince • Sofi Guide")
            .setDescription(GuideList)
            .setImage(SofiGuide)
            .setFooter({ text: `${message.author.username}`, iconURL: message.author.displayAvatarURL() })
            .setTimestamp();

        await message.reply({ embeds: [embed] });
    },
};
