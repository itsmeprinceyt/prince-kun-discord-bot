import { Message, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";

export default {
    triggers: [
        ".?hsr",
        ".?honkaistarrail",
        ".?wuwa",
        ".?ww",
        ".?wutheringwaves",
        ".?bgmi",
        ".?zzz",
        ".?zenlesszonezero",
        ".?gi",
        ".?genshin"],
    async execute(message: Message) {
        const UIDs = {
            hsr: "802581646",
            wuwa: "900584281",
            bgmi: "5651014966",
            zzz: "1302186027",
            genshin: "889406482",
        };

        const embed = new EmbedBuilder()
            .setColor(0xc200ff)
            .setAuthor({
                name: "Prince-Kun • Game UIDs",
                iconURL: "https://media.discordapp.net/attachments/1336322293437038602/1336322635939975168/Profile_Pic_2.jpg",
            })
            .setTitle("Here you can all my UIDs")
            .setDescription(
                `\`Genshin UID:  \` - ${UIDs.genshin} [Server: ASIA]\n` +
                `\`HSR UID:      \` - ${UIDs.hsr} [Server: ASIA]\n` +
                `\`Wuwa UID:     \` - ${UIDs.wuwa} [Server: SEA]\n` +
                `\`BGMI UID:     \` - ${UIDs.bgmi}\n` +
                `\`ZZZ UID:      \` - ${UIDs.zzz} [Server: ASIA]`)
            .setImage("https://media.discordapp.net/attachments/1336322293437038602/1337083370819162184/Game_User_Id.png")
            .setFooter({
                text: `${message.author.username} | ${new Date().toLocaleTimeString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                })} ${new Date().getHours() >= 12 ? "PM" : "AM"}`,
                iconURL: message.author.displayAvatarURL(),
            });

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder().setCustomId("copy_genshin").setLabel("Copy Genshin UID").setStyle(ButtonStyle.Secondary).setEmoji("📋"),
            new ButtonBuilder().setCustomId("copy_hsr").setLabel("Copy HSR UID").setStyle(ButtonStyle.Secondary).setEmoji("📋"),
            new ButtonBuilder().setCustomId("copy_wuwa").setLabel("Copy Wuwa UID").setStyle(ButtonStyle.Secondary).setEmoji("📋"),
            new ButtonBuilder().setCustomId("copy_bgmi").setLabel("Copy BGMI UID").setStyle(ButtonStyle.Secondary).setEmoji("📋"),
            new ButtonBuilder().setCustomId("copy_zzz").setLabel("Copy ZZZ UID").setStyle(ButtonStyle.Secondary).setEmoji("📋")
        );

        const sentMessage = await message.reply({ embeds: [embed], components: [row] });
        const collector = sentMessage.createMessageComponentCollector({ time: 60000 });

        collector.on("collect", async (interaction) => {
            const game = interaction.customId.split("_")[1] as keyof typeof UIDs;
            if (interaction.user.id !== message.author.id) {
                return interaction.reply(
                    {
                        content: "❌ Only the command sender can use this button!",
                        flags: 64
                    });
            }
            if (UIDs[game]) {
                await interaction.reply(
                    {
                        content: `${UIDs[game]}`,
                        flags: 64
                    });
            } else {
                await interaction.reply(
                    {
                        content: "❌ Game not recognized!",
                        flags: 64
                    });
            }
        });

        collector.on("end", () => {
            sentMessage.edit({ components: [] }).catch(() => { });
        });
    },
};