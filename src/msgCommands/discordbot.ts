import { Message, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField } from "discord.js";
import { ProfileAuthorPicture, DiscordBotInviteLink, DiscordBotInvite, DiscordBotInviteLinkShort } from "../utility/utils";
import { COLOR_PRIMARY } from "../utility/uuid/Colors";

export default {
    triggers: [".?prince-kun", ".?bot"],
    async execute(message: Message) {
        if (!message.member?.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return message
            .reply("⛔ You must be the server owner to use this command!")
            .then((msg) => {
                setTimeout(() => msg.delete().catch(() => { }), 5000);
            });
        }

        ;

        const embed = new EmbedBuilder()
            .setColor(COLOR_PRIMARY)
            .setAuthor({
                name: "Prince-Kun • Prince-Kun",
                iconURL: ProfileAuthorPicture})
            .setTitle("Invite 'Prince-kun' Bot in your Server")
            .setDescription(
                `You can invite my bot in your server! 🌟🌻\n\n` +
                `**Shareable Link:** ${DiscordBotInviteLinkShort}\n\n` +
                `[Click Here To Invite!](${DiscordBotInviteLink})`
            )
            .setImage(DiscordBotInvite)
            .setFooter({ text: `${message.author.username}`, iconURL: message.author.displayAvatarURL() })
            .setTimestamp();

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setCustomId("copy_link")
                .setLabel("Copy Link")
                .setStyle(ButtonStyle.Secondary)
                .setEmoji("📋")
        );

        const sentMessage = await message.reply({ embeds: [embed], components: [row] });
        const collector = sentMessage.createMessageComponentCollector({
            time: 60000,
        });

        collector.on("collect", async (interaction) => {
            if (interaction.customId === "copy_link") {
                if (interaction.user.id !== message.author.id) {
                    return interaction.reply({
                        content: "❌ Only the command sender can use this button!",
                        flags: 64,
                    });
                }

                await interaction.reply({
                    content: `${DiscordBotInviteLink}`,
                    flags: 64,
                });
            }
        });

        collector.on("end", () => {
            sentMessage.edit({ components: [] }).catch(() => {});
        });
    },
};
