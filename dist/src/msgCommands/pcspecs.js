"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const pc_specs_1 = require("../utility/commands/pc-specs");
const Colors_1 = require("../utility/uuid/Colors");
const utils_1 = require("../utility/utils");
exports.default = {
    triggers: [".?pcspecs", ".?specs", ".?specifications", ".?pc", ".?pppc"],
    async execute(message) {
        const embed = new discord_js_1.EmbedBuilder()
            .setColor(Colors_1.COLOR_PRIMARY)
            .setAuthor({
            name: "Prince-Kun • PC Specs",
            iconURL: utils_1.ProfileAuthorPicture,
        })
            .setTitle("Setup Specifications")
            .setDescription(pc_specs_1.SPECS)
            .setImage(utils_1.PCSpecs)
            .setFooter({ text: `${message.author.username}`, iconURL: message.author.displayAvatarURL() })
            .setTimestamp();
        await message.reply({ embeds: [embed] });
    },
};
