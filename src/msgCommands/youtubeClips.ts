import { Message, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { ProfileAuthorPicture, YouTubeClips, YouTubeClipsImage } from "../utility/utils";
import { COLOR_PRIMARY } from "../utility/uuid/Colors";

export default {
    triggers: [".?youtubeclips", ".?ytclips",".?clips"],
    async execute(message: Message) {
        const embed = new EmbedBuilder()
            .setColor(COLOR_PRIMARY)
            .setAuthor({
                name: "Prince-Kun • YouTube Clips/Highlights",
                iconURL: ProfileAuthorPicture,
            })
            .setTitle("ItsMe Prince • Clips/Highlights")
            .setDescription(`Find all the amazing community-made clips or stream highlights right here!🌟🌻\n\n`+
                `[Check out my Clips/Highlights !](${YouTubeClips})`
            )
            .setImage(YouTubeClipsImage)
            .setFooter({ text: `${message.author.username}`, iconURL: message.author.displayAvatarURL() })
            .setTimestamp();
                    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
                        new ButtonBuilder()
                            .setCustomId("show_youtubeClips_link")
                            .setLabel("Copy Link")
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji("📋")
                    );
            
                    const sentMessage = await message.reply({ embeds: [embed], components: [row] });
                    const collector = sentMessage.createMessageComponentCollector({
                        time: 60000,
                    });
            
                    collector.on("collect", async (interaction) => {
                        if (interaction.customId === "show_youtubeClips_link") {
                            if (interaction.user.id !== message.author.id) {
                                return interaction.reply({
                                    content: "❌ Only the command sender can use this button!",
                                    flags: 64,
                                });
                            }
            
                            await interaction.reply({
                                content: `${YouTubeClips}`,
                                flags: 64,
                            });
                        }
                    });
            
                    collector.on("end", () => {
                        sentMessage.edit({ components: [] }).catch(() => { });
                    });
                },
            };
            