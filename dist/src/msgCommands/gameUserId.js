"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
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
            hsr: "802581646",
            wuwa: "900584281",
            bgmi: "5651014966",
            zzz: "1302186027",
            genshin: "889406482",
        };
        const embed = new discord_js_1.EmbedBuilder()
            .setColor(0xc200ff)
            .setAuthor({
            name: "Prince-Kun • Game UIDs",
            iconURL: "https://media.discordapp.net/attachments/1336322293437038602/1336322635939975168/Profile_Pic_2.jpg",
        })
            .setTitle("Here you can all my UIDs")
            .setDescription(`\`Genshin UID:  \` - ${UIDs.genshin} [Server: ASIA]\n` +
            `\`HSR UID:      \` - ${UIDs.hsr} [Server: ASIA]\n` +
            `\`Wuwa UID:     \` - ${UIDs.wuwa} [Server: SEA]\n` +
            `\`BGMI UID:     \` - ${UIDs.bgmi}\n` +
            `\`ZZZ UID:      \` - ${UIDs.zzz} [Server: ASIA]`)
            .setImage("https://media.discordapp.net/attachments/1336322293437038602/1337083370819162184/Game_User_Id.png")
            .setFooter({
            text: `${message.author.username} | ${new Date().toLocaleTimeString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
                timeZone: "Asia/Kolkata",
            })} ${new Date().getHours() >= 12 ? "PM" : "AM"}`,
            iconURL: message.author.displayAvatarURL(),
        });
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
