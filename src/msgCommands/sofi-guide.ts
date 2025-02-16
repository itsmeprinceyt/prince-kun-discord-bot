import { Message, EmbedBuilder } from "discord.js";
import { GuideList } from "../utility/sofi-guide-list";

export default {
    triggers: [".?sofiguide",".?sofiguides",".?sofi-guide",".?sofi-guides",".?sofi"],
    async execute(message: Message) {
        const embed = new EmbedBuilder()
            .setColor(0xc200ff)
            .setAuthor({
                name: "Prince-Kun • Guide",
                iconURL:
                    "https://media.discordapp.net/attachments/1336322293437038602/1336322635939975168/Profile_Pic_2.jpg",
            })
            .setTitle("ItsMe Prince • Sofi Guide")
            .setDescription(GuideList)
            .setImage(
                "https://media.discordapp.net/attachments/1336322293437038602/1337039143854669865/SofiGuide.png"
            )
            .setFooter({ text: `${message.author.username}`, iconURL: message.author.displayAvatarURL() })
            .setTimestamp();

        await message.reply({ embeds: [embed] });
    },
};
