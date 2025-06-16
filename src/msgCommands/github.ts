import { Message, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { ProfileAuthorPicture, GitHubProfileLink,GitHubLink } from "../utility/utils";
import { COLOR_PRIMARY } from "../utility/uuid/Colors";

export default {
    triggers: [".?github"],
    async execute(message: Message) {
        const embed = new EmbedBuilder()
            .setColor(COLOR_PRIMARY)
            .setAuthor({
                name: "Prince-Kun • GitHub",
                iconURL: ProfileAuthorPicture,
            })
            .setTitle("@itsmeprinceyt")
            .setDescription(`I am a passionate developer from India learning new things and on my way to becoming a Full Stack Developer!😊\n\n` +
                `[Connect with me on GitHub !](${GitHubProfileLink})`)
            .setImage(GitHubLink)
            .setFooter({ text: `${message.author.username}`, iconURL: message.author.displayAvatarURL() })
            .setTimestamp();
        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setCustomId("show_github_link")
                .setLabel("Copy Link")
                .setStyle(ButtonStyle.Secondary)
                .setEmoji("📋")
        );
        const sentMessage = await message.reply({ embeds: [embed], components: [row] });
        const collector = sentMessage.createMessageComponentCollector({
            time: 60000,
        });

        collector.on("collect", async (interaction) => {
            if (interaction.customId === "show_github_link") {
                if (interaction.user.id !== message.author.id) {
                    return interaction.reply({
                        content: "❌ Only the command sender can use this button!",
                        flags: 64,
                    });
                }

                await interaction.reply({
                    content: `${GitHubProfileLink}`,
                    flags: 64,
                });
            }
        });

        collector.on("end", () => {
            sentMessage.edit({ components: [] }).catch(() => { });
        });
    },
};
