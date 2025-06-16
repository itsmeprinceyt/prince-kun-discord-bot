"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const sofi_guide_list_1 = require("../utility/commands/sofi-guide-list");
const utils_1 = require("../utility/utils");
const Colors_1 = require("../utility/uuid/Colors");
exports.default = {
    triggers: [".?sofiguide", ".?sofiguides", ".?sofi-guide", ".?sofi-guides", ".?sofi"],
    async execute(message) {
        const embed = new discord_js_1.EmbedBuilder()
            .setColor(Colors_1.COLOR_PRIMARY)
            .setAuthor({
            name: "Prince-Kun • Guide",
            iconURL: utils_1.ProfileAuthorPicture,
        })
            .setTitle("ItsMe Prince • Sofi Guide")
            .setDescription(sofi_guide_list_1.GuideList)
            .setImage(utils_1.SofiGuide)
            .setFooter({ text: `${message.author.username}`, iconURL: message.author.displayAvatarURL() })
            .setTimestamp();
        await message.reply({ embeds: [embed] });
    },
};
