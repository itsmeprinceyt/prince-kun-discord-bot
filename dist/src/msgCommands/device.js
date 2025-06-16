"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const utils_1 = require("../utility/utils");
const Colors_1 = require("../utility/uuid/Colors");
exports.default = {
    triggers: [".?device", ".?mobile"],
    async execute(message) {
        const embed = new discord_js_1.EmbedBuilder()
            .setColor(Colors_1.COLOR_PRIMARY)
            .setAuthor({
            name: "Prince-Kun • Device",
            iconURL: utils_1.ProfileAuthorPicture,
        })
            .setTitle("Device")
            .setDescription(`I'm currently using \`IQOO NEO 7 ( 12+256 Variant) - Black\``)
            .setImage(utils_1.Device)
            .setFooter({ text: `${message.author.username}`, iconURL: message.author.displayAvatarURL() })
            .setTimestamp();
        await message.reply({ embeds: [embed] });
    },
};
