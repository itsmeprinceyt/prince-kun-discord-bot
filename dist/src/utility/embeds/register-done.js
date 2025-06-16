"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRegistrationSuccessEmbed = getRegistrationSuccessEmbed;
const discord_js_1 = require("discord.js");
const Colors_1 = require("../uuid/Colors");
function getRegistrationSuccessEmbed(user) {
    return new discord_js_1.EmbedBuilder()
        .setColor(Colors_1.COLOR_TRUE)
        .setTitle("Registration Successful !")
        .setThumbnail(user.displayAvatarURL())
        .setDescription(`Well then, <@${user.id}>, you're registered!\nUse \`/profile\` or \`.?profile\` to check your inventory!\n\n**Current Marketplace:** [Join Server](https://discord.gg/spHgh4PGzF) • https://discord.com/channels/310675536340844544/1177928471951966339/1179354261365211218`)
        .setTimestamp();
}
