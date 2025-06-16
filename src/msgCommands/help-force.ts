import { Message, EmbedBuilder } from "discord.js";
import { HelpDescription } from "../utility/commands/help/help-commands";
import { ProfileAuthorPicture, Help } from "../utility/utils";
import { COLOR_PRIMARY } from "../utility/uuid/Colors";

export default {
    triggers: [".?help-force"],
    async execute(message: Message) {
        const embed = new EmbedBuilder()
            .setColor(COLOR_PRIMARY)
            .setAuthor({
                name: "Prince-Kun • Commands",
                iconURL: ProfileAuthorPicture,
            })
            .setTitle("Here are all the available commands which you can use!")
            .setDescription(HelpDescription)
            .setImage(Help)
            .setFooter({ text: `${message.author.username}`, iconURL: message.author.displayAvatarURL() })
            .setTimestamp();
        if (!message.guild) {
            await message.reply({ embeds: [embed] });
            return;
        }
        if (message.author.id !== message.guild.ownerId) {
            await message
                .reply("⛔ You must be the server owner to use this command!")
                .then((msg) => {
                    setTimeout(() => msg.delete().catch(() => { }), 5000);
                });
            return;
        }
        await message.reply({ embeds: [embed] });
    },
};
