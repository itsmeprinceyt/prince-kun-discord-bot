"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const db_1 = __importDefault(require("../db"));
const logger_custom_1 = require("../utility/logger-custom");
const logger_NoDM_NoAdmin_1 = require("../utility/logger-NoDM-NoAdmin");
const rolePerms_1 = require("../utility/rolePerms");
const adminId = rolePerms_1.RolesPerms[5].roleId;
const deleteUserCommand = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName("delete-user")
        .setDescription("Delete a registered user from the database.")
        .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.Administrator)
        .addUserOption(option => option.setName("user")
        .setDescription("The user to delete")
        .setRequired(true)),
    async execute(interaction) {
        if (!interaction.guild && interaction.user.id !== adminId) {
            await interaction.reply("This is a Server-Only Command! 🖕");
            return;
        }
        if (interaction.guild && !interaction.memberPermissions?.has(discord_js_1.PermissionFlagsBits.Administrator)) {
            await interaction.reply({
                content: "❌ Only administrators can use this command!",
                flags: 64,
            });
            (0, logger_NoDM_NoAdmin_1.logger_NoDM_NoAdmin)(interaction);
            return;
        }
        const selectedUser = interaction.options.getUser("user");
        const [rows] = await db_1.default.query("SELECT user_id FROM users WHERE user_id = ?", [selectedUser.id]);
        if (rows.length === 0) {
            await interaction.reply({
                content: `❌ ${selectedUser.username} is not registered!`,
                flags: 64,
            });
            (0, logger_NoDM_NoAdmin_1.logger_NoDM_NoAdmin)(interaction);
            return;
        }
        await db_1.default.query("DELETE FROM users WHERE user_id = ?", [selectedUser.id]);
        const logMessage = `[ DATABASE ] User ${selectedUser.username} (${selectedUser.id}) deleted by Admin ${interaction.user.username}`;
        (0, logger_custom_1.logger_custom)(selectedUser.username, "delete-user", logMessage);
        const embed = new discord_js_1.EmbedBuilder()
            .setColor(0xff0000)
            .setTitle("User Deleted")
            .setThumbnail(selectedUser.displayAvatarURL())
            .setDescription(`User <@${selectedUser.id}> has been removed from the database.`)
            .setTimestamp();
        await interaction.reply({ embeds: [embed] });
    }
};
exports.default = deleteUserCommand;
