import { Message, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { COLOR_PRIMARY } from "../utility/uuid/Colors";
import { KoFi, KofiImage, ProfileAuthorPicture } from "../utility/utils";

export default {
    triggers: [".?kofi"],
    async execute(message: Message) {
        const embed = new EmbedBuilder()
            .setColor(COLOR_PRIMARY)
            .setAuthor({
                name: "Prince-Kun • Ko-Fi",
                iconURL: ProfileAuthorPicture,
            })
            .setTitle("Support Me on Ko-Fi")
            .setDescription(`As a streamer and developer, I am committed to delivering high-quality content for my audience to enjoy and creating cool projects for everyone to use. All donations will be reinvested to improve my overall quality of life, allowing me to provide better streams and coding projects.\n\n` +
                `I sincerely appreciate anyone who chooses to support me financially. Thank you for your generosity! 😊\n\n` +
                `[Click here to support me on Ko-Fi !](${KoFi})`
            )
            .setImage(KofiImage)
            .setFooter({ text: `${message.author.username}`, iconURL: message.author.displayAvatarURL() })
            .setTimestamp();
            const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
                new ButtonBuilder()
                    .setCustomId("show_kofi_link")
                    .setLabel("Copy Link")
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji("📋")
            );
    
            const sentMessage = await message.reply({ embeds: [embed], components: [row] });
            const collector = sentMessage.createMessageComponentCollector({
                time: 60000,
            });
    
            collector.on("collect", async (interaction) => {
                if (interaction.customId === "show_kofi_link") {
                    if (interaction.user.id !== message.author.id) {
                        return interaction.reply({
                            content: "❌ Only the command sender can use this button!",
                            flags: 64,
                        });
                    }
    
                    await interaction.reply({
                        content: `${KoFi}`,
                        flags: 64,
                    });
                }
            });
    
            collector.on("end", () => {
                sentMessage.edit({ components: [] }).catch(() => { });
            });
        },
    };