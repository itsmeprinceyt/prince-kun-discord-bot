import { Message, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { ProfileAuthorPicture, YouTubeChannel, YouTubeChannelLink } from "../utility/utils";
import { COLOR_PRIMARY } from "../utility/uuid/Colors";

export default {
    triggers: [".?youtube", ".?yt"],
    async execute(message: Message) {
        
        const embed = new EmbedBuilder()
            .setColor(COLOR_PRIMARY)
            .setAuthor({
                name: "Prince-Kun • Subscribe to my YouTube Channel",
                iconURL: ProfileAuthorPicture})
            .setTitle("ItsMe Prince")
            .setDescription(`Hello, I'm Prince! I love diving into PC games and sharing my adventures with you. My channel features a mix of content: exciting gaming sessions, IRL drawing streams, and fun coding projects. Sometimes, I also chat about various topics that pique my interest. If you enjoy what you see,  then make sure to subscribe 🌟🌻\n\n` +
                `A friendly reminder: I upload content based on my mood.\n\n` +
                `[Click Here To Subscribe or Visit !](${YouTubeChannelLink})`)
            .setImage(YouTubeChannel)
            .setFooter({ text: `${message.author.username}`, iconURL: message.author.displayAvatarURL() })
            .setTimestamp();
            const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
                new ButtonBuilder()
                    .setCustomId("show_youTube_Channel")
                    .setLabel("Copy Link")
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji("📋")
            );
    
            const sentMessage = await message.reply({ embeds: [embed], components: [row] });
            const collector = sentMessage.createMessageComponentCollector({
                time: 60000,
            });
    
            collector.on("collect", async (interaction) => {
                if (interaction.customId === "show_youTube_Channel") {
                    if (interaction.user.id !== message.author.id) {
                        return interaction.reply({
                            content: "❌ Only the command sender can use this button!",
                            flags: 64,
                        });
                    }
    
                    await interaction.reply({
                        content: `${YouTubeChannelLink}`,
                        flags: 64,
                    });
                }
            });
    
            collector.on("end", () => {
                sentMessage.edit({ components: [] }).catch(() => { });
            });
        },
    };
    