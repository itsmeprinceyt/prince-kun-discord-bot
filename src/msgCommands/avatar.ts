import { Message, EmbedBuilder } from "discord.js";
import { COLOR_PRIMARY } from "../utility/uuid/Colors";

export default {
    triggers: [".?av", ".?avatar"],
    async execute(message: Message) {
        const target = message.mentions.users.first() || message.author;
        
        const embed = new EmbedBuilder()
            .setColor(COLOR_PRIMARY)
            .setAuthor({ name: `${target.username}'s Avatar`, iconURL: target.displayAvatarURL({ size: 1024}) })
            .setImage(target.displayAvatarURL({ size: 1024 }))
            .setFooter({ text: `Requested by ${message.author.username}`, iconURL: message.author.displayAvatarURL({ size: 1024}) });

        await message.reply({ embeds: [embed] });
    },
};
