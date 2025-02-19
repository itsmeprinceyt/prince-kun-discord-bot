"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Modifydata = void 0;
const discord_js_1 = require("discord.js");
const db_1 = __importDefault(require("../db"));
const logger_custom_1 = require("../utility/logger-custom");
const logger_NoDM_NoAdmin_1 = require("../utility/logger-NoDM-NoAdmin");
const rolePerms_1 = require("../utility/rolePerms");
const adminId = rolePerms_1.RolesPerms[5].roleId;
exports.Modifydata = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName("modify-data")
        .setDescription("Modify user data fields like PP Cash, Referral Tickets, etc.")
        .addUserOption(option => option.setName("user").setDescription("Select the user").setRequired(true))
        .addStringOption(option => option.setName("option")
        .setDescription("Select the field to modify")
        .setRequired(true)
        .addChoices({ name: "PP Cash", value: "pp_cash" }, { name: "Referral Tickets", value: "refer_tickets" }, { name: "Total Purchases", value: "total_purchases" }, { name: "Total Referred", value: "total_referred" }))
        .addIntegerOption(option => option.setName("amount")
        .setDescription("Enter the amount (positive or negative integers only)")
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
        const amount = interaction.options.getInteger("amount", true);
        if (!Number.isInteger(amount)) {
            await interaction.reply({ content: "❌ Amount must be an integer!", flags: 64, });
            return;
        }
        const [userData] = await db_1.default.query("SELECT user_id, ?? AS field_value FROM users WHERE user_id = ?", [field, user.id]);
        if (!userData.length) {
            await interaction.reply({ content: "❌ User is not registered!", flags: 64, });
            return;
        }
        const currentValue = userData[0].field_value || 0;
        const newValue = currentValue + amount;
        await db_1.default.query("UPDATE users SET ?? = ? WHERE user_id = ?", [field, newValue, user.id]);
        (0, logger_custom_1.logger_custom)("ADMIN", "modify-user", `Modified ${field} for user ${user.id} to ${newValue}`);
        const action = amount > 0 ? "added" : "removed";
        const formattedField = field.replace("_", " ").toUpperCase();
        const responseMessage = `✅ Successfully ${action} **${Math.abs(amount)} ${formattedField}** ${amount > 0 ? "to" : "from"} <@${user.id}>'s inventory. \`New Value: ${newValue}\``;
        await interaction.reply({
            content: `${responseMessage}`,
            flags: 64
        });
    }
};
exports.default = exports.Modifydata;
