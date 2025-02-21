"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResetData = void 0;
const discord_js_1 = require("discord.js");
const db_1 = __importDefault(require("../db"));
const logger_custom_1 = require("../utility/logger-custom");
const logger_NoDM_NoAdmin_1 = require("../utility/logger-NoDM-NoAdmin");
const rolePerms_1 = require("../utility/rolePerms");
const adminId = rolePerms_1.RolesPerms[5].roleId;
exports.ResetData = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName("reset-data")
        .setDescription("Reset all user data fields to 0, including SPV.")
        .addUserOption(option => option.setName("user").setDescription("Select the user").setRequired(true)),
    execute: async function (interaction) {
        if (!interaction.guild && interaction.user.id !== adminId) {
            await interaction.reply("This is a Server-Only Command! 🖕");
            (0, logger_NoDM_NoAdmin_1.logger_NoDM_NoAdmin)(interaction);
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
        const user = interaction.options.getUser("user", true);
        const [userData] = await db_1.default.query("SELECT user_id FROM users WHERE user_id = ?", [user.id]);
        if (!userData.length) {
            await interaction.reply({ content: "❌ User is not registered!", flags: 64 });
            return;
        }
        await db_1.default.query("UPDATE users SET pp_cash = 0, refer_tickets = 0, total_purchases = 0, total_referred = 0, spv = 0.00 WHERE user_id = ?", [user.id]);
        (0, logger_custom_1.logger_custom)("ADMIN", "reset-data", `Reset all stats for user ${user.id} to 0 (SPV included)`);
        const responseMessage = `✅ Successfully reset all stats for <@${user.id}> to 0, including SPV.`;
        await interaction.reply({
            content: responseMessage,
            flags: 64
        });
    }
};
exports.default = exports.ResetData;
