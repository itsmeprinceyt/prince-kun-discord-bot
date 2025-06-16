import { Message, EmbedBuilder } from "discord.js";
import { ProfileAuthorPicture, Device } from "../utility/utils";
import { COLOR_PRIMARY } from "../utility/uuid/Colors";

export default {
    triggers: [".?device", ".?mobile"],
    async execute(message: Message) {
        const embed = new EmbedBuilder()
            .setColor(COLOR_PRIMARY)
            .setAuthor({
                name: "Prince-Kun • Device",
                iconURL: ProfileAuthorPicture,
            })
            .setTitle("Device")
            .setDescription(`I'm currently using \`IQOO NEO 7 ( 12+256 Variant) - Black\``)
            .setImage(Device)
            .setFooter({ text: `${message.author.username}`, iconURL: message.author.displayAvatarURL() })
            .setTimestamp();

        await message.reply({ embeds: [embed] });
    },
};
