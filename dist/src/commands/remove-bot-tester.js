"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const logger_NoDM_NoAdmin_1 = require("../utility/loggers/logger-NoDM-NoAdmin");
const logger_custom_1 = require("../utility/loggers/logger-custom");
const RolesPerms_1 = require("../utility/uuid/RolesPerms");
const BotTester = RolesPerms_1.RolesPerms[6].roleId;
const removeBotTester = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName("remove-bot-tester")
        .setDescription("Removes the Bot Tester role from a specified user.")
        .addUserOption(option => option.setName("user")
        .setDescription("Select the user to remove the Bot Tester role.")
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
        const role = interaction.guild.roles.cache.get(BotTester);
        if (!role) {
            await interaction.reply({
                content: "❌ Bot Tester role not found!",
                flags: 64,
            });
            return;
        }
        if (!targetUser.roles.cache.has(BotTester)) {
            await interaction.reply({
                content: `⚠️ \`${targetUser.displayName}\` does not have the Bot Tester role!`,
                flags: 64,
            });
            return;
        }
        try {
            await targetUser.roles.remove(BotTester);
            await interaction.reply({
                content: `✅ Removed the Bot Tester role from -> \`${targetUser.displayName}\`!`,
                flags: 64,
            });
            const logMessage = `${executor.displayName} removed the Bot Tester role to ${targetUser.displayName}`;
            (0, logger_custom_1.logger_custom)(logMessage, "remove-bot-tester", "Role successfully removed!");
        }
        catch (error) {
            console.error("❌ Error assigning role:", error);
            await interaction.reply({ content: "❌ An error occurred while assigning the role.", flags: 64 });
        }
    }
};
exports.default = removeBotTester;
