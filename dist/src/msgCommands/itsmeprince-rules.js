"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const itsmeprince_rules_1 = require("../utility/itsmeprince-rules");
exports.default = {
    triggers: [".?shoprules", ".?rulesshop", ".?itsmeprinceshoprules"],
    async execute(message) {
        const embed = new discord_js_1.EmbedBuilder()
            .setColor(0x006eff)
            .setTitle("ItsMe Prince Shop - Rules")
            .setThumbnail(message.author.displayAvatarURL())
            .setDescription(itsmeprince_rules_1.ItsMePrinceRules + 'Use `/register` to begin.')
            .setFooter({
            text: `${message.author.username} | ${new Date().toLocaleTimeString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
                timeZone: "Asia/Kolkata",
            })} ${new Date().getHours() >= 12 ? "PM" : "AM"}`,
            iconURL: message.author.displayAvatarURL(),
        });
        await message.reply({ embeds: [embed] });
    },
};
