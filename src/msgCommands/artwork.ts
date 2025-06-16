import { Message, EmbedBuilder, AttachmentBuilder } from "discord.js";
import path from "path";
import fs from "fs";
import { ProfileAuthorPicture, DiscordBotProfilePictureLocal, DiscordBotProfilePictureLocalName } from "../utility/utils";
import { COLOR_PRIMARY } from "../utility/uuid/Colors";

export default {
    triggers: [".?artwork"],

    async execute(message: Message) {
        const logoPath = path.join(__dirname, DiscordBotProfilePictureLocal);
        if (!fs.existsSync(logoPath)) {
            return message.reply("The artwork image could not be found.");
        }
        const attachment = new AttachmentBuilder(logoPath, { name: DiscordBotProfilePictureLocalName });
        const embed = new EmbedBuilder()
            .setColor(COLOR_PRIMARY)
            .setAuthor({
                name: "Prince-Kun • Artwork",
                iconURL: ProfileAuthorPicture,
            })
            .setTitle("Artwork Credit")
            .setDescription(`A huge thank you to <@793154222806925333> for creating this amazing artwork for the Prince-Kun! If you're looking for fantastic artwork commissions, be it anime-related or chibi related then make sure to reach out to them!`)
            .setImage(`attachment://${DiscordBotProfilePictureLocalName}`)
            .setFooter({ text: `${message.author.username}`, iconURL: message.author.displayAvatarURL() })
            .setTimestamp();

        await message.reply({
            embeds: [embed],
            files: [attachment],
        });
    },
};
