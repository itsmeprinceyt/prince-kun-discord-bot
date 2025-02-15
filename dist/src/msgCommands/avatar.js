"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
exports.default = {
    triggers: [".?av", ".?avatar"],
    async execute(message) {
        const target = message.mentions.users.first() || message.author;
        const embed = new discord_js_1.EmbedBuilder()
            .setColor(0xc200ff)
            .setAuthor({ name: `${target.username}'s Avatar`, iconURL: target.displayAvatarURL({ size: 1024 }) })
            .setImage(target.displayAvatarURL({ size: 1024 }))
            .setFooter({ text: `Requested by ${message.author.username}`, iconURL: message.author.displayAvatarURL({ size: 1024 }) });
        await message.reply({ embeds: [embed] });
    },
};
