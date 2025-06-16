"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Colors_1 = require("../utility/uuid/Colors");
exports.default = {
    triggers: [".?av", ".?avatar"],
    async execute(message) {
        const target = message.mentions.users.first() || message.author;
        const embed = new discord_js_1.EmbedBuilder()
            .setColor(Colors_1.COLOR_PRIMARY)
            .setAuthor({ name: `${target.username}'s Avatar`, iconURL: target.displayAvatarURL({ size: 1024 }) })
            .setImage(target.displayAvatarURL({ size: 1024 }))
            .setFooter({ text: `Requested by ${message.author.username}`, iconURL: message.author.displayAvatarURL({ size: 1024 }) });
        await message.reply({ embeds: [embed] });
    },
};
