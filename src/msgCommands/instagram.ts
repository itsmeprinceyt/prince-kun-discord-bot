import { Message, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { COLOR_PRIMARY } from "../utility/uuid/Colors";
import { ProfileAuthorPicture } from "../utility/utils";

export default {
    triggers: [".?instagram", ".?insta"],
    async execute(message: Message) {
        const Instagram = "https://www.instagram.com/itsmeprinceyt";
        const embed = new EmbedBuilder()
            .setColor(COLOR_PRIMARY)
            .setAuthor({
                name: "Prince-Kun • Instagram",
                iconURL: ProfileAuthorPicture})
            .setTitle("@itsmeprinceyt")
            .setDescription(`You can follow me on Instagram 🌟🌻 \n\n` +
                `[Click Here To Follow !](${Instagram})`)
            .setImage(Instagram)
            .setFooter({ text: `${message.author.username}`, iconURL: message.author.displayAvatarURL() })
            .setTimestamp();
        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setCustomId("show_instagram_link")
                .setLabel("Copy Link")
                .setStyle(ButtonStyle.Secondary)
                .setEmoji("📋")
        );

        const sentMessage = await message.reply({ embeds: [embed], components: [row] });
        const collector = sentMessage.createMessageComponentCollector({
            time: 60000,
        });

        collector.on("collect", async (interaction) => {
            if (interaction.customId === "show_instagram_link") {
                if (interaction.user.id !== message.author.id) {
                    return interaction.reply({
                        content: "❌ Only the command sender can use this button!",
                        flags: 64,
                    });
                }

                await interaction.reply({
                    content: `${Instagram}`,
                    flags: 64,
                });
            }
        });

        collector.on("end", () => {
            sentMessage.edit({ components: [] }).catch(() => { });
        });
    },
};
