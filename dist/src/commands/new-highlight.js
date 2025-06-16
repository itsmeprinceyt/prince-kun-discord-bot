"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const logger_NoDM_NoAdmin_1 = require("../utility/loggers/logger-NoDM-NoAdmin");
const logger_custom_1 = require("../utility/loggers/logger-custom");
const TextChannels_1 = require("../utility/uuid/TextChannels");
const RolesPerms_1 = require("../utility/uuid/RolesPerms");
const PREDEFINED_SERVER_ID = "310675536340844544";
const HIGHLIGHT_CHANNEL_ID = TextChannels_1.TextChannels[0].roleId;
const adminId = RolesPerms_1.RolesPerms[5].roleId;
const newHighlight = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName("new-highlight")
        .setDescription("Sends a new highlight image.")
        .addStringOption(option => option.setName("image-url")
        .setDescription("Paste the image URL here.")
        .setRequired(true))
        .addStringOption(option => option.setName("text")
        .setDescription("Optional text message to send before the image.")
        .setRequired(false)),
    async execute(interaction) {
        const isDM = !interaction.guild;
        let guild = interaction.guild;
        if (isDM) {
            if (interaction.user.id !== adminId) {
                await interaction.reply({
                    content: "This is a Server-Only Command! 🖕",
                    flags: 64
                });
                (0, logger_NoDM_NoAdmin_1.logger_NoDM_NoAdmin)(interaction);
                return;
            }
            const client = interaction.client;
            guild = client.guilds.cache.get(PREDEFINED_SERVER_ID) || null;
            if (!guild) {
                await interaction.reply({
                    content: "❌ Could not find the predefined server!",
                    flags: 64,
                });
                return;
            }
        }
        else {
            if (interaction.user.id !== interaction.guild.ownerId) {
                await interaction.reply({
                    content: "🚫 You do not have permission to use this command!",
                    flags: 64
                });
                (0, logger_NoDM_NoAdmin_1.logger_NoDM_NoAdmin)(interaction);
                return;
            }
        }
        const highlightChannel = guild?.channels.cache.get(HIGHLIGHT_CHANNEL_ID);
        if (!highlightChannel) {
            await interaction.reply({
                content: "❌ Highlight channel not found!",
                flags: 64,
            });
            return;
        }
        const imageUrl = interaction.options.getString("image-url", true).trim();
        const sanitizedImageUrl = imageUrl.replace(/\?.*$/, "");
        const textMessage = interaction.options.getString("text")?.trim();
        if (textMessage) {
            await highlightChannel.send(textMessage);
        }
        await highlightChannel.send(sanitizedImageUrl);
        await interaction.reply({
            content: `✅ Image URL sent to the highlight channel! Check: <#${HIGHLIGHT_CHANNEL_ID}>`,
            flags: 64,
        });
        (0, logger_custom_1.logger_custom)(interaction.user.username, "image-url", `new highlight image sent to ${HIGHLIGHT_CHANNEL_ID}: ${sanitizedImageUrl}`);
    }
};
exports.default = newHighlight;
