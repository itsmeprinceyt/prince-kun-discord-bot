"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const logger_NoDM_NoAdmin_1 = require("../utility/loggers/logger-NoDM-NoAdmin");
const logger_custom_1 = require("../utility/loggers/logger-custom");
const RolesPerms_1 = require("../utility/uuid/RolesPerms");
const LeakerRole = RolesPerms_1.RolesPerms[4].roleId;
const removeLeaker = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName("remove-leaker")
        .setDescription("Removes the Leaker role from a specified user.")
        .addUserOption(option => option.setName("user")
        .setDescription("Select the user to remove the Leaker role from.")
        .setRequired(true)),
    async execute(interaction) {
        if (!interaction.guild) {
            await interaction.reply({
                content: "This is a Server-Only Command! 🖕",
                flags: 64,
            });
            (0, logger_NoDM_NoAdmin_1.logger_NoDM_NoAdmin)(interaction);
            return;
        }
        const executor = interaction.member;
        const ownerId = interaction.guild.ownerId;
        if (executor.id !== ownerId && !executor.permissions.has("Administrator")) {
            await interaction.reply({
                content: "🚫 You don't have permission to use this command!",
                flags: 64,
            });
            (0, logger_NoDM_NoAdmin_1.logger_NoDM_NoAdmin)(interaction);
            return;
        }
        const targetUser = interaction.options.getMember("user");
        if (!targetUser) {
            await interaction.reply({
                content: "❌ Invalid user! Please mention a valid member.",
                flags: 64,
            });
            return;
        }
        const role = interaction.guild.roles.cache.get(LeakerRole);
        if (!role) {
            await interaction.reply({
                content: "❌ Leaker role not found!",
                flags: 64,
            });
            return;
        }
        if (!targetUser.roles.cache.has(LeakerRole)) {
            await interaction.reply({
                content: `⚠️ \`${targetUser.displayName}\` doesn't have the Leaker role!`,
                flags: 64,
            });
            return;
        }
        try {
            await targetUser.roles.remove(LeakerRole);
            await interaction.reply({
                content: `✅ Removed the Leaker role from -> \`${targetUser.displayName}\`!`,
                flags: 64,
            });
            const logMessage = `${executor.displayName} removed the Leaker role from ${targetUser.displayName}`;
            (0, logger_custom_1.logger_custom)(logMessage, "remove-leaker-role", "Role successfully removed!");
        }
        catch (error) {
            console.error("❌ Error removing role:", error);
            await interaction.reply({
                content: "❌ An error occurred while removing the role.",
                flags: 64
            });
        }
    }
};
exports.default = removeLeaker;
