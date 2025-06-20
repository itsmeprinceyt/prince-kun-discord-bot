import { Message, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { ProfileAuthorPicture, GameUUID, HSR_UUID, WUWA_UUID, BGMI_UUID, ZZZ_UUID, GENSHIN_UUID } from "../utility/utils";
import { COLOR_PRIMARY } from "../utility/uuid/Colors";

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
            hsr: HSR_UUID,
            wuwa: WUWA_UUID,
            bgmi: BGMI_UUID,
            zzz: ZZZ_UUID,
            genshin: GENSHIN_UUID,
        };

        const embed = new EmbedBuilder()
            .setColor(COLOR_PRIMARY)
            .setAuthor({
                name: "Prince-Kun • Game UIDs",
                iconURL: ProfileAuthorPicture,
            })
            .setTitle("Here you can all my UIDs")
            .setDescription(
                `\`Genshin UID:  \` - ${UIDs.genshin} [Server: ASIA]\n` +
                `\`HSR UID:      \` - ${UIDs.hsr} [Server: ASIA]\n` +
                `\`Wuwa UID:     \` - ${UIDs.wuwa} [Server: SEA]\n` +
                `\`BGMI UID:     \` - ${UIDs.bgmi}\n` +
                `\`ZZZ UID:      \` - ${UIDs.zzz} [Server: ASIA]`)
            .setImage(GameUUID)
            .setFooter({ text: `${message.author.username}`, iconURL: message.author.displayAvatarURL() })
            .setTimestamp();

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