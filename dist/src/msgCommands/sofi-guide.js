"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const sofi_guide_list_1 = require("../utility/sofi-guide-list");
exports.default = {
    triggers: [".?sofiguide", ".?sofiguides", ".?sofi-guide", ".?sofi-guides", ".?sofi"],
    async execute(message) {
        const embed = new discord_js_1.EmbedBuilder()
            .setColor(0xc200ff)
            .setAuthor({
            name: "Prince-Kun • Guide",
            iconURL: "https://media.discordapp.net/attachments/1336322293437038602/1336322635939975168/Profile_Pic_2.jpg",
        })
            .setTitle("ItsMe Prince • Sofi Guide")
            .setDescription(sofi_guide_list_1.GuideList)
            .setImage("https://media.discordapp.net/attachments/1336322293437038602/1337039143854669865/SofiGuide.png")
            .setFooter({
            text: `${message.author.username} | ${new Date().toLocaleTimeString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
            })} ${new Date().getHours() >= 12 ? "PM" : "AM"}`,
            iconURL: message.author.displayAvatarURL(),
        });
        await message.reply({ embeds: [embed] });
    },
};
