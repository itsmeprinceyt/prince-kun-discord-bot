"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const utils_1 = require("../utility/utils");
const Colors_1 = require("../utility/uuid/Colors");
exports.default = {
    triggers: [".?whatsapp"],
    async execute(message) {
        const embed = new discord_js_1.EmbedBuilder()
            .setColor(Colors_1.COLOR_PRIMARY)
            .setAuthor({
            name: "Prince-Kun • Whatsapp",
            iconURL: utils_1.ProfileAuthorPicture,
        })
            .setTitle("Broadcast Channel")
            .setDescription(`Find all the channel updates right from your Whatsapp App! Join my Broadcast channel from the link below or message me on my WhatsApp number and say "Hi!"\n\n` +
            `**WhatsApp Number:** \`${utils_1.phoneNumber}\`\n` +
            `[Click here to join my WhatsApp Broadcast Channel!](${utils_1.WhatsappBroadcast})`)
            .setImage(utils_1.Whatsapp)
            .setFooter({ text: `${message.author.username}`, iconURL: message.author.displayAvatarURL() })
            .setTimestamp();
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
                    content: `${utils_1.phoneNumber}`,
                    flags: 64,
                });
            }
        });
        collector.on("end", () => {
            sentMessage.edit({ components: [] }).catch(() => { });
        });
    },
};
