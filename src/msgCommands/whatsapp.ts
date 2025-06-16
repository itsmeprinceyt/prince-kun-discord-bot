import { Message, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { phoneNumber, ProfileAuthorPicture, Whatsapp, WhatsappBroadcast } from "../utility/utils";
import { COLOR_PRIMARY } from "../utility/uuid/Colors";

export default {
    triggers: [".?whatsapp"],
    async execute(message: Message) {
        const embed = new EmbedBuilder()
            .setColor(COLOR_PRIMARY)
            .setAuthor({
                name: "Prince-Kun • Whatsapp",
                iconURL: ProfileAuthorPicture,
            })
            .setTitle("Broadcast Channel")
            .setDescription(`Find all the channel updates right from your Whatsapp App! Join my Broadcast channel from the link below or message me on my WhatsApp number and say "Hi!"\n\n` +
                `**WhatsApp Number:** \`${phoneNumber}\`\n` +
                `[Click here to join my WhatsApp Broadcast Channel!](${WhatsappBroadcast})`
            )
            .setImage(Whatsapp)
            .setFooter({ text: `${message.author.username}`, iconURL: message.author.displayAvatarURL() })
            .setTimestamp();

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setCustomId("show_number")
                .setLabel("Copy Number")
                .setStyle(ButtonStyle.Secondary)
                .setEmoji("📞")
        );

        const sentMessage = await message.reply({ embeds: [embed], components: [row] });
        const collector = sentMessage.createMessageComponentCollector({
            time: 60000,
        });

        collector.on("collect", async (interaction) => {
            if (interaction.customId === "show_number") {
                if (interaction.user.id !== message.author.id) {
                    return interaction.reply({
                        content: "❌ Only the command sender can use this button!",
                        flags: 64,
                    });
                }

                await interaction.reply({
                    content: `${phoneNumber}`,
                    flags: 64,
                });
            }
        });

        collector.on("end", () => {
            sentMessage.edit({ components: [] }).catch(() => { });
        });
    },
};
