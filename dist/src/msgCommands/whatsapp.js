"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
exports.default = {
    triggers: [".?whatsapp"],
    async execute(message) {
        const phoneNumber = "+919793798778";
        const embed = new discord_js_1.EmbedBuilder()
            .setColor(0xc200ff)
            .setAuthor({
            name: "Prince-Kun • Whatsapp",
            iconURL: "https://media.discordapp.net/attachments/1336322293437038602/1336322635939975168/Profile_Pic_2.jpg",
        })
            .setTitle("Broadcast Channel")
            .setDescription(`Find all the channel updates right from your Whatsapp App! Join my Broadcast channel from the link below or message me on my WhatsApp number and say "Hi!"\n\n` +
            `**WhatsApp Number:** \`${phoneNumber}\`\n` +
            `[Click here to join my WhatsApp Broadcast Channel!](https://www.whatsapp.com/channel/0029Va5MEeX2UPBIHUMyQY2z)`)
            .setImage("https://media.discordapp.net/attachments/1336322293437038602/1337051063504867398/Whatsapp.png")
            .setFooter({
            text: `${message.author.username} | ${new Date().toLocaleTimeString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
            })} ${new Date().getHours() >= 12 ? "PM" : "AM"}`,
            iconURL: message.author.displayAvatarURL(),
        });
        const row = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder()
            .setCustomId("show_number")
            .setLabel("Copy Number")
            .setStyle(discord_js_1.ButtonStyle.Secondary)
            .setEmoji("📞"));
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
