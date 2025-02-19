"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateData = void 0;
const discord_js_1 = require("discord.js");
const db_1 = __importDefault(require("../db"));
const logger_custom_1 = require("../utility/logger-custom");
const logger_NoDM_NoAdmin_1 = require("../utility/logger-NoDM-NoAdmin");
const rolePerms_1 = require("../utility/rolePerms");
const adminId = rolePerms_1.RolesPerms[5].roleId;
exports.UpdateData = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName("update-data")
        .setDescription("Overwrite user data fields like PP Cash, Referral Tickets, etc.")
        .addUserOption(option => option.setName("user").setDescription("Select the user").setRequired(true))
        .addStringOption(option => option.setName("option")
        .setDescription("Select the field to update")
        .setRequired(true)
        .addChoices({ name: "PP Cash", value: "pp_cash" }, { name: "Referral Tickets", value: "refer_tickets" }, { name: "Total Purchases", value: "total_purchases" }, { name: "Total Referred", value: "total_referred" }))
        .addIntegerOption(option => option.setName("amount")
        .setDescription("Enter the new amount")
        .setRequired(true)),
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
        const field = interaction.options.getString("option", true);
        const newValue = interaction.options.getInteger("amount", true);
        if (!Number.isInteger(newValue) || newValue < 0) {
            await interaction.reply({ content: "❌ Amount must be an integer and 0 or above!", flags: 64, });
            return;
        }
        const [userData] = await db_1.default.query("SELECT user_id FROM users WHERE user_id = ?", [user.id]);
        if (!userData.length) {
            await interaction.reply({ content: "❌ User is not registered!", flags: 64, });
            return;
        }
        await db_1.default.query("UPDATE users SET ?? = ? WHERE user_id = ?", [field, newValue, user.id]);
        (0, logger_custom_1.logger_custom)("ADMIN", "update-data", `Set ${field} for user ${user.id} to ${newValue}`);
        const formattedField = field.replace("_", " ").toUpperCase();
        const responseMessage = `✅ Successfully set **${formattedField}** to **${newValue}** for <@${user.id}>.`;
        await interaction.reply({
            content: responseMessage,
            flags: 64
        });
    }
};
exports.default = exports.UpdateData;
