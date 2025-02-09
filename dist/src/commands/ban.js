"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const logger_NoDM_NoAdmin_1 = require("../utility/logger-NoDM-NoAdmin");
const logger_custom_1 = require("../utility/logger-custom");
const rolePerms_1 = require("../utility/rolePerms");
const Moderator = rolePerms_1.RolesPerms[2].roleId;
const BanCommand = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName("ban")
        .setDescription("Bans a user from the server.")
        .addUserOption(option => option.setName("target")
        .setDescription("Select the user to ban")
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
        const member = interaction.member;
        const userRoles = member.roles.cache.map(role => role.id);
        const ownerId = interaction.guild.ownerId;
        const hasModeratorRole = userRoles.includes(Moderator);
        if (interaction.user.id !== ownerId && !hasModeratorRole) {
            await interaction.reply({
                content: "🚫 You do not have permission to use this command!",
                flags: 64,
            });
            (0, logger_NoDM_NoAdmin_1.logger_NoDM_NoAdmin)(interaction);
            return;
        }
        const targetMember = interaction.options.getMember("target");
        if (!targetMember) {
            await interaction.reply({
                content: "❌ The specified user is not in the server!",
                flags: 64,
            });
            return;
        }
        if (!targetMember.bannable) {
            await interaction.reply({
                content: "❌ I cannot ban this user. They may have a higher role or special permissions!",
                flags: 64,
            });
            return;
        }
        await targetMember.ban({ reason: "Banned via command" });
        await interaction.reply({
            content: `✅ Successfully banned ${targetMember.user.tag}!`,
            flags: 64,
        });
        const userName = member?.displayName || interaction.user.username;
        (0, logger_custom_1.logger_custom)(userName, "ban", `Command executed successfully! \`${targetMember.user.tag}\` has been banned from the server`);
    },
};
exports.default = BanCommand;
