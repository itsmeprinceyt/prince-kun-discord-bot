"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const logger_NoDM_NoAdmin_1 = require("../utility/loggers/logger-NoDM-NoAdmin");
const logger_custom_1 = require("../utility/loggers/logger-custom");
const RolesPerms_1 = require("../utility/uuid/RolesPerms");
const BotTester = RolesPerms_1.RolesPerms[6].roleId;
const setBotTester = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName("set-bot-tester")
        .setDescription("Assigns the Bot Tester role to a specified user.")
        .addUserOption(option => option.setName("user")
        .setDescription("Select the user to assign the Bot Tester role.")
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
        if (targetUser.roles.cache.has(BotTester)) {
            await interaction.reply({
                content: `⚠️ \`${targetUser.displayName}\` already has the Bot Tester role!`,
                flags: 64,
            });
            return;
        }
        try {
            await targetUser.roles.add(BotTester);
            await interaction.reply({
                content: `✅ Assigned the Bot Tester role to -> \`${targetUser.displayName}\`!`,
                flags: 64,
            });
            const logMessage = `${executor.displayName} assigned the Bot Tester role to ${targetUser.displayName}`;
            (0, logger_custom_1.logger_custom)(logMessage, "set-bot-tester", "Role successfully assigned!");
        }
        catch (error) {
            console.error("❌ Error assigning role:", error);
            await interaction.reply({ content: "❌ An error occurred while assigning the role.", flags: 64 });
        }
    }
};
exports.default = setBotTester;
