"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const utils_1 = require("../utility/utils");
const Colors_1 = require("../utility/uuid/Colors");
exports.default = {
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
        ".?genshin"
    ],
    async execute(message) {
        const UIDs = {
            hsr: utils_1.HSR_UUID,
            wuwa: utils_1.WUWA_UUID,
            bgmi: utils_1.BGMI_UUID,
            zzz: utils_1.ZZZ_UUID,
            genshin: utils_1.GENSHIN_UUID,
        };
        const embed = new discord_js_1.EmbedBuilder()
            .setColor(Colors_1.COLOR_PRIMARY)
            .setAuthor({
            name: "Prince-Kun • Game UIDs",
            iconURL: utils_1.ProfileAuthorPicture,
        })
            .setTitle("Here you can all my UIDs")
            .setDescription(`\`Genshin UID:  \` - ${UIDs.genshin} [Server: ASIA]\n` +
            `\`HSR UID:      \` - ${UIDs.hsr} [Server: ASIA]\n` +
            `\`Wuwa UID:     \` - ${UIDs.wuwa} [Server: SEA]\n` +
            `\`BGMI UID:     \` - ${UIDs.bgmi}\n` +
            `\`ZZZ UID:      \` - ${UIDs.zzz} [Server: ASIA]`)
            .setImage(utils_1.GameUUID)
            .setFooter({ text: `${message.author.username}`, iconURL: message.author.displayAvatarURL() })
            .setTimestamp();
        const row = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder().setCustomId("copy_genshin").setLabel("Copy Genshin UID").setStyle(discord_js_1.ButtonStyle.Secondary).setEmoji("📋"), new discord_js_1.ButtonBuilder().setCustomId("copy_hsr").setLabel("Copy HSR UID").setStyle(discord_js_1.ButtonStyle.Secondary).setEmoji("📋"), new discord_js_1.ButtonBuilder().setCustomId("copy_wuwa").setLabel("Copy Wuwa UID").setStyle(discord_js_1.ButtonStyle.Secondary).setEmoji("📋"), new discord_js_1.ButtonBuilder().setCustomId("copy_bgmi").setLabel("Copy BGMI UID").setStyle(discord_js_1.ButtonStyle.Secondary).setEmoji("📋"), new discord_js_1.ButtonBuilder().setCustomId("copy_zzz").setLabel("Copy ZZZ UID").setStyle(discord_js_1.ButtonStyle.Secondary).setEmoji("📋"));
        const sentMessage = await message.reply({ embeds: [embed], components: [row] });
        const collector = sentMessage.createMessageComponentCollector({ time: 60000 });
        collector.on("collect", async (interaction) => {
            const game = interaction.customId.split("_")[1];
            if (interaction.user.id !== message.author.id) {
                return interaction.reply({
                    content: "❌ Only the command sender can use this button!",
                    flags: 64
                });
            }
            if (UIDs[game]) {
                await interaction.reply({
                    content: `${UIDs[game]}`,
                    flags: 64
                });
            }
            else {
                await interaction.reply({
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
