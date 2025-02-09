"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const logger_NoDM_NoAdmin_1 = require("../utility/logger-NoDM-NoAdmin");
const logger_custom_1 = require("../utility/logger-custom");
const rolePerms_1 = require("../utility/rolePerms");
const CodePoster = rolePerms_1.RolesPerms[0].roleId;
const removeCodePosterRole = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName("remove-code-poster-role")
        .setDescription("Removes the Code Poster role from a specified user.")
        .addUserOption(option => option.setName("user")
        .setDescription("Select the user to remove the Code posting role from.")
        .setRequired(true)),
    async execute(interaction) {
        const isDM = !interaction.guild;
        if (isDM) {
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
        const role = interaction.guild.roles.cache.get(CodePoster);
        if (!role) {
            await interaction.reply({
                content: "❌ Code Poster role not found!",
                flags: 64,
            });
            return;
        }
        if (!targetUser.roles.cache.has(CodePoster)) {
            await interaction.reply({
                content: `⚠️ ${targetUser.displayName} doesn't have this role!`,
                flags: 64,
            });
            return;
        }
        try {
            await targetUser.roles.remove(CodePoster);
            await interaction.reply({
                content: `✅ Removed the Code Poster role from -> ${targetUser.displayName}!`,
                flags: 64,
            });
            const UserMessage = `${executor.displayName} -> removed Code Poster role from -> ${targetUser.displayName}`;
            (0, logger_custom_1.logger_custom)(UserMessage, "/remove-code-poster-role", "Role successfully removed!");
        }
        catch (error) {
            console.error("Error removing role:", error);
            await interaction.reply({ content: "❌ An error occurred while removing the role.", flags: 64 });
        }
    }
};
exports.default = removeCodePosterRole;
