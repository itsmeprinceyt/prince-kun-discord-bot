"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
exports.default = {
    triggers: [".?x", ".?twitter"],
    async execute(message) {
        const X = "https://x.com/itsmeprinceyt";
        const embed = new discord_js_1.EmbedBuilder()
            .setColor(0xc200ff)
            .setAuthor({
            name: "Prince-Kun • X",
            iconURL: "https://media.discordapp.net/attachments/1336322293437038602/1336322635939975168/Profile_Pic_2.jpg",
        })
            .setTitle("@itsmeprinceyt")
            .setDescription(`You can follow me on X 🌟🌻\n\n` +
            `[Click Here To Follow !](${X})`)
            .setImage("https://media.discordapp.net/attachments/1336322293437038602/1337027227598196778/X.png")
            .setFooter({
            text: `${message.author.username} | ${new Date().toLocaleTimeString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
                timeZone: "Asia/Kolkata",
            })} ${new Date().getHours() >= 12 ? "PM" : "AM"}`,
            iconURL: message.author.displayAvatarURL(),
        });
        const row = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder()
            .setCustomId("show_x_link")
            .setLabel("Copy Link")
            .setStyle(discord_js_1.ButtonStyle.Secondary)
            .setEmoji("📋"));
        const sentMessage = await message.reply({ embeds: [embed], components: [row] });
        const collector = sentMessage.createMessageComponentCollector({
            time: 60000,
        });
        collector.on("collect", async (interaction) => {
            if (interaction.customId === "show_x_link") {
                if (interaction.user.id !== message.author.id) {
                    return interaction.reply({
                        content: "❌ Only the command sender can use this button!",
                        flags: 64,
                    });
                }
                await interaction.reply({
                    content: `${X}`,
                    flags: 64,
                });
            }
        });
        collector.on("end", () => {
            sentMessage.edit({ components: [] }).catch(() => { });
        });
    },
};
