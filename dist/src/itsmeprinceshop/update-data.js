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
const spvCalculator_1 = require("../utility/spvCalculator");
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
            await interaction.reply({ content: "❌ Amount must be an integer and 0 or above!", flags: 64 });
            return;
        }
        const [rows] = await db_1.default.query("SELECT * FROM users WHERE user_id = ?", [user.id]);
        if (rows.length === 0) {
            await interaction.reply({ content: "❌ User is not registered!", flags: 64 });
            return;
        }
        let { pp_cash, refer_tickets, total_purchases, total_referred } = rows[0];
        let spv = parseFloat(rows[0].spv) || 0.00;
        switch (field) {
            case "pp_cash":
                pp_cash = newValue;
                break;
            case "refer_tickets":
                refer_tickets = newValue;
                break;
            case "total_purchases":
                total_purchases = newValue;
                break;
            case "total_referred":
                total_referred = newValue;
                break;
        }
        spv = (0, spvCalculator_1.calculateSPV)(pp_cash, refer_tickets, total_purchases, total_referred);
        await db_1.default.query("UPDATE users SET pp_cash = ?, refer_tickets = ?, total_purchases = ?, total_referred = ?, spv = ? WHERE user_id = ?", [pp_cash, refer_tickets, total_purchases, total_referred, parseFloat(spv.toFixed(2)), user.id]);
        (0, logger_custom_1.logger_custom)("ADMIN", "update-data", `Updated ${field} for user ${user.id} to ${newValue}, recalculated SPV: ${spv.toFixed(2)}`);
        const formattedField = field.replace("_", " ").toUpperCase();
        const responseMessage = `✅ Successfully set **${formattedField}** to **${newValue}** for <@${user.id}>. \`New SPV: ${spv.toFixed(2)}\``;
        await interaction.reply({
            content: responseMessage,
            flags: 64
        });
    }
};
exports.default = exports.UpdateData;
