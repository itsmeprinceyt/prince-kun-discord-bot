"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleSelectUser = handleSelectUser;
exports.handleSelectUserSubmit = handleSelectUserSubmit;
exports.handleModifyPP = handleModifyPP;
exports.handleModifyReferral = handleModifyReferral;
exports.handleModifyPurchases = handleModifyPurchases;
exports.handleModifySubmit = handleModifySubmit;
exports.handleDeleteUser = handleDeleteUser;
const discord_js_1 = require("discord.js");
const db_1 = __importDefault(require("../db"));
const logger_custom_1 = require("../utility/logger-custom");
async function handleSelectUser(interaction) {
    (0, logger_custom_1.logger_custom)("ADMIN", "admin", "Admin clicked select user button");
    const modal = new discord_js_1.ModalBuilder().setCustomId("select_user").setTitle("Select User")
        .addComponents(new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.TextInputBuilder().setCustomId("user_index").setLabel("Enter user serial number:").setStyle(discord_js_1.TextInputStyle.Short)));
    await interaction.showModal(modal);
}
async function handleSelectUserSubmit(interaction) {
    (0, logger_custom_1.logger_custom)("ADMIN", "admin", "Admin submitted select user modal");
    const [users] = await db_1.default.query("SELECT user_id FROM users");
    const userIndex = parseInt(interaction.fields.getTextInputValue("user_index")) - 1;
    if (isNaN(userIndex) || userIndex < 0 || userIndex >= users.length) {
        await interaction.reply({ content: "❌ Invalid serial number!", flags: 64 });
        return;
    }
    const selectedUser = users[userIndex];
    const [userData] = await db_1.default.query("SELECT pp_cash, refer_tickets, total_purchases FROM users WHERE user_id = ?", [selectedUser.user_id]);
    if (userData.length === 0) {
        await interaction.reply({ content: "❌ User data not found!", flags: 64 });
        return;
    }
    const { pp_cash, refer_tickets, total_purchases } = userData[0];
    (0, logger_custom_1.logger_custom)("ADMIN", "admin", `Selected user: ${selectedUser.user_id}`);
    const userEmbed = new discord_js_1.EmbedBuilder()
        .setTitle(`User Details: <@${selectedUser.user_id}>`)
        .setDescription(`💰 **PP CASH:** ${pp_cash}\n` +
        `🎟 **Referral Tickets:** ${refer_tickets}\n` +
        `🛒 **Total Purchases:** ${total_purchases}`)
        .setColor("Green");
    const userRow = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder().setCustomId(`modify_pp_cash_${selectedUser.user_id}`).setLabel("💰 Modify PP Cash").setStyle(discord_js_1.ButtonStyle.Primary), new discord_js_1.ButtonBuilder().setCustomId(`modify_referral_${selectedUser.user_id}`).setLabel("🎟 Modify Referral Tickets").setStyle(discord_js_1.ButtonStyle.Secondary), new discord_js_1.ButtonBuilder().setCustomId(`modify_purchases_${selectedUser.user_id}`).setLabel("🛒 Modify Purchases").setStyle(discord_js_1.ButtonStyle.Success), new discord_js_1.ButtonBuilder().setCustomId(`delete_${selectedUser.user_id}`).setLabel("❌ Delete User").setStyle(discord_js_1.ButtonStyle.Danger));
    await interaction.reply({ embeds: [userEmbed], components: [userRow], flags: 64 });
}
async function handleModifyPP(interaction) {
    (0, logger_custom_1.logger_custom)("ADMIN", "admin", "Admin clicked modify PP cash button");
    const userId = interaction.customId.split("_")[2];
    const modal = new discord_js_1.ModalBuilder()
        .setCustomId(`modify_pp_cash_${userId}`)
        .setTitle("Modify PP Cash")
        .addComponents(new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.TextInputBuilder()
        .setCustomId("new_pp_cash")
        .setLabel("Enter new PP Cash:")
        .setStyle(discord_js_1.TextInputStyle.Short)));
    await interaction.showModal(modal);
}
async function handleModifyReferral(interaction) {
    (0, logger_custom_1.logger_custom)("ADMIN", "admin", "Admin clicked modify referral tickets button");
    const userId = interaction.customId.split("_")[2];
    const modal = new discord_js_1.ModalBuilder()
        .setCustomId(`modify_referral_${userId}`)
        .setTitle("Modify Referral Tickets")
        .addComponents(new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.TextInputBuilder()
        .setCustomId("new_referral_tickets")
        .setLabel("Enter new referral tickets:")
        .setStyle(discord_js_1.TextInputStyle.Short)));
    await interaction.showModal(modal);
}
async function handleModifyPurchases(interaction) {
    (0, logger_custom_1.logger_custom)("ADMIN", "admin", "Admin clicked modify total purchases button");
    const userId = interaction.customId.split("_")[2];
    const modal = new discord_js_1.ModalBuilder()
        .setCustomId(`modify_purchases_${userId}`)
        .setTitle("Modify Total Purchases")
        .addComponents(new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.TextInputBuilder()
        .setCustomId("new_total_purchases")
        .setLabel("Enter new total purchases:")
        .setStyle(discord_js_1.TextInputStyle.Short)));
    await interaction.showModal(modal);
}
async function handleModifySubmit(interaction) {
    (0, logger_custom_1.logger_custom)("ADMIN", "admin", "Admin submitted modify modal");
    const parts = interaction.customId.split("_");
    const type = parts[1];
    const userId = parts[2];
    let field, inputValue, updateField;
    if (type === "pp") {
        field = "new_pp_cash";
        updateField = "pp_cash";
    }
    else if (type === "referral") {
        field = "new_referral_tickets";
        updateField = "refer_tickets";
    }
    else if (type === "purchases") {
        field = "new_total_purchases";
        updateField = "total_purchases";
    }
    else {
        await interaction.reply({ content: "❌ Invalid action!", flags: 64 });
        return;
    }
    inputValue = interaction.fields.getTextInputValue(field).trim();
    const newValue = Number(inputValue);
    if (isNaN(newValue)) {
        await interaction.reply({ content: "❌ Invalid value entered!", flags: 64 });
        return;
    }
    const [result] = await db_1.default.query(`UPDATE users SET ${updateField} = ? WHERE user_id = ?`, [newValue, userId]);
    console.log("[DEBUG] Database Update Result:", result);
    (0, logger_custom_1.logger_custom)("ADMIN", "admin", `Updated ${updateField} for user ${userId} to ${newValue}`);
    await interaction.reply({ content: `✅ **${updateField.replace("_", " ").toUpperCase()}** updated to **${newValue}**!`, flags: 64 });
}
async function handleDeleteUser(interaction) {
    (0, logger_custom_1.logger_custom)("ADMIN", "admin", "Admin clicked delete user button");
    const userId = interaction.customId.split("_")[1];
    await db_1.default.query("DELETE FROM users WHERE user_id = ?", [userId]);
    (0, logger_custom_1.logger_custom)("ADMIN", "admin", `Deleted user ${userId}`);
    await interaction.reply({ content: `🗑️ User <@${userId}> has been deleted.`, flags: 64 });
}
