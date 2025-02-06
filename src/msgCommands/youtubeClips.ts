import { Message, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";

export default {
    triggers: [".?youtubeclips", ".?ytclips",".?clips"],
    async execute(message: Message) {
        const YouTubeClips = "https://www.youtube.com/watch?v=U9CD1tFw1mg&list=PLiFooJ43_R5R2usnfqq4D1JkG2Bz1A8VB&index=1";
        const embed = new EmbedBuilder()
            .setColor(0xc200ff)
            .setAuthor({
                name: "Prince-Kun • YouTube Clips/Highlights",
                iconURL:
                    "https://media.discordapp.net/attachments/1336322293437038602/1336322635939975168/Profile_Pic_2.jpg",
            })
            .setTitle("ItsMe Prince • Clips/Highlights")
            .setDescription(`Find all the amazing community-made clips or stream highlights right here!🌟🌻\n\n`+
                `[Check out my Clips/Highlights !](${YouTubeClips})`
            )
            .setImage(
                "https://media.discordapp.net/attachments/1336322293437038602/1337031725762482278/YouTubeClips.png"
            )
            .setFooter({
                text: `${message.author.username} | ${new Date().toLocaleTimeString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                })} ${new Date().getHours() >= 12 ? "PM" : "AM"}`,
                iconURL: message.author.displayAvatarURL(),
            });
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
            