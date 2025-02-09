"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const logger_NoDM_NoAdmin_1 = require("../utility/logger-NoDM-NoAdmin");
const logger_custom_1 = require("../utility/logger-custom");
const rolePerms_1 = require("../utility/rolePerms");
const ModeratorRole = rolePerms_1.RolesPerms[2].roleId;
const removeMod = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName("remove-mod")
        .setDescription("Removes the Moderator role from a specified user.")
        .addUserOption(option => option.setName("user")
        .setDescription("Select the user to remove the Moderator role.")
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
        const role = interaction.guild.roles.cache.get(ModeratorRole);
        if (!role) {
            await interaction.reply({
                content: "❌ Moderator role not found!",
                flags: 64,
            });
            return;
        }
        if (!targetUser.roles.cache.has(ModeratorRole)) {
            await interaction.reply({
                content: `⚠️ \`${targetUser.displayName}\` does not have the Moderator role!`,
                flags: 64,
            });
            return;
        }
        try {
            await targetUser.roles.remove(ModeratorRole);
            await interaction.reply({
                content: `✅ Removed the Moderator role from -> \`${targetUser.displayName}\`!`,
                flags: 64,
            });
            const logMessage = `${executor.displayName} removed the Moderator role from ${targetUser.displayName}`;
            (0, logger_custom_1.logger_custom)(logMessage, "remove-moderator-role", "Role successfully removed!");
        }
        catch (error) {
            console.error("❌ Error removing role:", error);
            await interaction.reply({ content: "❌ An error occurred while removing the role.", flags: 64 });
        }
    }
};
exports.default = removeMod;
