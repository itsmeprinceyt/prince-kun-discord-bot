import { Message, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField } from "discord.js";

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

        const inviteLink = "https://discord.com/oauth2/authorize?client_id=1335342572758892615&permissions=1927098263638&integration_type=0&scope=bot";

        const embed = new EmbedBuilder()
            .setColor(0xc200ff)
            .setAuthor({
                name: "Prince-Kun • Prince-Kun",
                iconURL:
                    "https://media.discordapp.net/attachments/1336322293437038602/1336322635939975168/Profile_Pic_2.jpg",
            })
            .setTitle("Invite 'Prince-kun' Bot in your Server")
            .setDescription(
                `You can invite my bot in your server! 🌟🌻\n\n` +
                `**Shareable Link:** https://rebrand.ly/discord-prince-kun\n\n` +
                `[Click Here To Invite!](https://discord.com/oauth2/authorize?client_id=1335342572758892615&permissions=1927098263638&integration_type=0&scope=bot)`
            )
            .setImage(
                "https://media.discordapp.net/attachments/1336322293437038602/1337038357565276160/Discord.png"
            )
            .setFooter({
                text: `${message.author.username} | ${new Date().toLocaleTimeString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                    timeZone: "Asia/Kolkata",
                })} ${new Date().getHours() >= 12 ? "PM" : "AM"}`,
                iconURL: message.author.displayAvatarURL(),
            });

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
                    content: `${inviteLink}`,
                    flags: 64,
                });
            }
        });

        collector.on("end", () => {
            sentMessage.edit({ components: [] }).catch(() => {});
        });
    },
};
