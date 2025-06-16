"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const logger_NoDM_NoAdmin_1 = require("../utility/loggers/logger-NoDM-NoAdmin");
const logger_custom_1 = require("../utility/loggers/logger-custom");
const RolesPerms_1 = require("../utility/uuid/RolesPerms");
const Moderator = RolesPerms_1.RolesPerms[2].roleId;
const KickCommand = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName("kick")
        .setDescription("Kicks a user from the server.")
        .addUserOption(option => option.setName("target")
        .setDescription("Select the user to kick")
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
        if (!targetMember.kickable) {
            await interaction.reply({
                content: "❌ I cannot kick this user. They may have a higher role or special permissions!",
                flags: 64,
            });
            return;
        }
        await targetMember.kick();
        await interaction.reply({
            content: `✅ Successfully kicked ${targetMember.user.tag}!`,
            flags: 64,
        });
        const userName = member?.displayName || interaction.user.username;
        (0, logger_custom_1.logger_custom)(userName, "kick", `Command executed successfully! \`${targetMember.user.tag}\` has been kicked out of the server`);
    },
};
exports.default = KickCommand;
