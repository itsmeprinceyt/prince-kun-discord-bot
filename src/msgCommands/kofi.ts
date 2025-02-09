import { Message, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";

export default {
    triggers: [".?kofi"],
    async execute(message: Message) {
        const KoFiLink = "https://ko-fi.com/itsmeprinceyt";
        const embed = new EmbedBuilder()
            .setColor(0xc200ff)
            .setAuthor({
                name: "Prince-Kun • Ko-Fi",
                iconURL:
                    "https://media.discordapp.net/attachments/1336322293437038602/1336322635939975168/Profile_Pic_2.jpg",
            })
            .setTitle("Support Me on Ko-Fi")
            .setDescription(`As a streamer and developer, I am committed to delivering high-quality content for my audience to enjoy and creating cool projects for everyone to use. All donations will be reinvested to improve my overall quality of life, allowing me to provide better streams and coding projects.\n\n` +
                `I sincerely appreciate anyone who chooses to support me financially. Thank you for your generosity! 😊\n\n` +
                `[Click here to support me on Ko-Fi !](${KoFiLink})`
            )
            .setImage(
                "https://media.discordapp.net/attachments/1336322293437038602/1337027679886774272/KoFi.png"
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
                        content: `${KoFiLink}`,
                        flags: 64,
                    });
                }
            });
    
            collector.on("end", () => {
                sentMessage.edit({ components: [] }).catch(() => { });
            });
        },
    };