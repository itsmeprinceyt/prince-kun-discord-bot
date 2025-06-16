"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const utils_1 = require("../utility/utils");
const Colors_1 = require("../utility/uuid/Colors");
exports.default = {
    triggers: [".?upi"],
    async execute(message) {
        const embed = new discord_js_1.EmbedBuilder()
            .setColor(Colors_1.COLOR_PRIMARY)
            .setAuthor({
            name: "Prince-Kun • UPI",
            iconURL: utils_1.ProfileAuthorPicture,
        })
            .setTitle("Support me through UPI")
            .setDescription(`As a streamer and developer, I am committed to delivering high-quality content for my audience to enjoy 
and creating cool projects for everyone to use. All donations will be reinvested to improve my overall quality of life, allowing me to provide better streams and coding projects.\n\n` +
            `I sincerely appreciate anyone who chooses to support me financially. Thank you for your generosity!\n\n` +
            `💳 **UPI ID**
1. \`${utils_1.upiList[0]}\`
2. \`${utils_1.upiList[1]}\`
3. \`${utils_1.upiList[2]}\`\n\n` +
            `**Use the button below to copy the corresponding UPI address.**`)
            .setImage(utils_1.UPIImage)
            .setFooter({ text: `${message.author.username}`, iconURL: message.author.displayAvatarURL() })
            .setTimestamp();
        const row = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder().setCustomId("upi_1").setLabel("1️⃣").setStyle(discord_js_1.ButtonStyle.Secondary), new discord_js_1.ButtonBuilder().setCustomId("upi_2").setLabel("2️⃣").setStyle(discord_js_1.ButtonStyle.Secondary), new discord_js_1.ButtonBuilder().setCustomId("upi_3").setLabel("3️⃣").setStyle(discord_js_1.ButtonStyle.Secondary));
        const sentMessage = await message.reply({ embeds: [embed], components: [row] });
        const collector = sentMessage.createMessageComponentCollector({
            time: 60000,
        });
        collector.on("collect", async (interaction) => {
            if (!interaction.customId.startsWith("upi_"))
                return;
            const index = parseInt(interaction.customId.split("_")[1]) - 1;
            if (interaction.user.id !== message.author.id) {
                return interaction.reply({
                    content: "❌ Only the command sender can use this button!",
                    flags: 64,
                });
            }
            await interaction.reply({
                content: `${utils_1.upiList[index]}`,
                flags: 64,
            });
        });
        collector.on("end", () => {
            sentMessage.edit({ components: [] }).catch(() => { });
        });
    },
};
