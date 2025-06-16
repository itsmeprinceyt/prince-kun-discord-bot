"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllCardsHealthyEmbed = AllCardsHealthyEmbed;
exports.JobBoardSummary = JobBoardSummary;
exports.NotTriggeredByYou = NotTriggeredByYou;
exports.NoJobBoardFound = NoJobBoardFound;
exports.EmptyJobBoard = EmptyJobBoard;
exports.NoCardsFound = NoCardsFound;
const discord_js_1 = require("discord.js");
const Colors_1 = require("../uuid/Colors");
function AllCardsHealthyEmbed() {
    return new discord_js_1.EmbedBuilder()
        .setColor(Colors_1.COLOR_TRUE)
        .setDescription("✅ All cards are already healthy in your Job Board.");
}
function JobBoardSummary(healthyCount, injuredCount) {
    return new discord_js_1.EmbedBuilder()
        .setColor(Colors_1.COLOR_TRUE)
        .setDescription(`Hey, so I've learned that you currently have ...\n\n✅ **Healthy ${healthyCount >= 2 ? 'Cards' : 'Card'}:** ${healthyCount}\n❌ **Injured ${injuredCount >= 2 ? 'Cards' : 'Card'}:** ${injuredCount}\n\nType \`kc o:eff\` and reply your collection with \`.?work\`\n\n-# This will not work with the cards you have alias.`)
        .setTimestamp();
}
function NotTriggeredByYou() {
    return new discord_js_1.EmbedBuilder()
        .setColor(Colors_1.GOLDEN_EMBED)
        .setDescription("⚠️ You can only use the command on the embed message triggered by you.");
}
function NoJobBoardFound() {
    return new discord_js_1.EmbedBuilder()
        .setColor(Colors_1.GOLDEN_EMBED)
        .setDescription("⚠️ No Job Board found. Make sure you're replying to the correct embed.");
}
function EmptyJobBoard() {
    return new discord_js_1.EmbedBuilder()
        .setColor(Colors_1.GOLDEN_EMBED)
        .setDescription("⚠️ The Job Board appears to be empty or no valid cards were found.");
}
function NoCardsFound() {
    return new discord_js_1.EmbedBuilder()
        .setColor(Colors_1.GOLDEN_EMBED)
        .setDescription("⚠️ No card codes found in kc o:eff.");
}
