"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
exports.default = {
    triggers: [".?upi"],
    async execute(message) {
        const upiList = [
            "itsmeprinceyt@sliceaxis",
            "itsme.prince@axl",
            "itsmeprincekotak@yespop",
            "itsmeprinceyt@slice"
        ];
        const embed = new discord_js_1.EmbedBuilder()
            .setColor(0xc200ff)
            .setAuthor({
            name: "Prince-Kun • UPI",
            iconURL: "https://media.discordapp.net/attachments/1336322293437038602/1336322635939975168/Profile_Pic_2.jpg",
        })
            .setTitle("Support me through UPI")
            .setDescription(`As a streamer and developer, I am committed to delivering high-quality content for my audience to enjoy 
and creating cool projects for everyone to use. All donations will be reinvested to improve my overall quality of life, allowing me to provide better streams and coding projects.\n\n` +
            `I sincerely appreciate anyone who chooses to support me financially. Thank you for your generosity!\n\n` +
            `💳 **UPI ID**
1. \`itsmeprinceyt@sliceaxis\`
2. \`itsme.prince@axl\`
3. \`itsmeprincekotak@yespop\`
4. \`itsmeprinceyt@slice\`\n\n` +
            `**Use the button below to copy the corresponding UPI address.**`)
            .setImage("https://media.discordapp.net/attachments/1336322293437038602/1337036315648331817/UPI.png")
            .setFooter({ text: `${message.author.username}`, iconURL: message.author.displayAvatarURL() })
            .setTimestamp();
        const row = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder().setCustomId("upi_1").setLabel("1️⃣").setStyle(discord_js_1.ButtonStyle.Secondary), new discord_js_1.ButtonBuilder().setCustomId("upi_2").setLabel("2️⃣").setStyle(discord_js_1.ButtonStyle.Secondary), new discord_js_1.ButtonBuilder().setCustomId("upi_3").setLabel("3️⃣").setStyle(discord_js_1.ButtonStyle.Secondary), new discord_js_1.ButtonBuilder().setCustomId("upi_4").setLabel("4️⃣").setStyle(discord_js_1.ButtonStyle.Secondary));
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
                content: `${upiList[index]}`,
                flags: 64,
            });
        });
        collector.on("end", () => {
            sentMessage.edit({ components: [] }).catch(() => { });
        });
    },
};
