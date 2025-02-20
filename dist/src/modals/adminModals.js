"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleSelectUser = handleSelectUser;
exports.handleSelectUserSubmit = handleSelectUserSubmit;
exports.handleRefresh = handleRefresh;
exports.handleModifyPP = handleModifyPP;
exports.handleModifyReferral = handleModifyReferral;
exports.handleModifyPurchases = handleModifyPurchases;
exports.handleModifyReferred = handleModifyReferred;
exports.handleModifySubmit = handleModifySubmit;
exports.handleDeleteUser = handleDeleteUser;
const discord_js_1 = require("discord.js");
const db_1 = __importDefault(require("../db"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const logger_custom_1 = require("../utility/logger-custom");
const spvCalculator_1 = require("../utility/spvCalculator");
const spvImage_1 = require("../utility/spvImage");
const emotes_1 = require("../utility/emotes");
const GC = emotes_1.EMOTES[0].roleId;
const YC = emotes_1.EMOTES[1].roleId;
const RC = emotes_1.EMOTES[2].roleId;
const BC = emotes_1.EMOTES[3].roleId;
const PC = emotes_1.EMOTES[4].roleId;
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
    const selectedUserId = selectedUser.user_id;
    const selectedDiscordUser = await interaction.client.users.fetch(selectedUserId).catch(() => null);
    let selectedUsername = "Unknown User";
    let selectedDisplayName = "Unknown Name";
    let selectedAvatar = interaction.client.user.displayAvatarURL();
    if (selectedDiscordUser) {
        selectedUsername = selectedDiscordUser.username;
        selectedDisplayName = selectedDiscordUser.globalName || selectedUsername;
        selectedAvatar = selectedDiscordUser.displayAvatarURL();
    }
    const [userData] = await db_1.default.query("SELECT pp_cash, refer_tickets, total_purchases, registration_date, total_referred FROM users WHERE user_id = ?", [selectedUser.user_id]);
    if (userData.length === 0) {
        await interaction.reply({ content: "❌ User data not found!", flags: 64 });
        return;
    }
    const { pp_cash, refer_tickets, total_purchases, registration_date, total_referred } = userData[0];
    const AA = String(pp_cash).padEnd(8, " ");
    const BB = String(refer_tickets).padEnd(8, " ");
    const CC = String(total_purchases).padEnd(8, " ");
    const DD = String(total_referred).padEnd(8, " ");
    const formattedDate = (0, moment_timezone_1.default)(registration_date)
        .tz("Asia/Kolkata", true)
        .format("DD MMM YYYY, hh:mm A");
    (0, logger_custom_1.logger_custom)("ADMIN", "admin", `Selected user: ${selectedUser.user_id}`);
    const spv = (0, spvCalculator_1.calculateSPV)(pp_cash, refer_tickets, total_purchases, total_referred);
    const spvRounded = Math.round(spv);
    const imageBuffer = await (0, spvImage_1.generateSPVImage)(spvRounded);
    const attachment = new discord_js_1.AttachmentBuilder(imageBuffer, { name: "spv.png" });
    const userEmbed = new discord_js_1.EmbedBuilder()
        .setColor(0xeeff00)
        .setAuthor({
        name: "Prince-Kun • Profile Info",
        iconURL: "https://media.discordapp.net/attachments/1336322293437038602/1336322635939975168/Profile_Pic_2.jpg",
    })
        .setThumbnail("attachment://spv.png")
        .setTitle("ItsMe Prince Shop")
        .setDescription(`${YC} **Name:** <@${selectedUser.user_id}>\n` +
        `${YC} **Username:** ${selectedUsername}\n` +
        `${YC} **UserID:** ${selectedUser.user_id}\n` +
        `${YC} **Registered on:** ${formattedDate}\n` +
        `${YC} **__SPV:__** ${spv}\n\n` +
        `**📦 Inventory & Stats**\n` +
        `${YC} \`PP Cash          \` • \`${AA}\`\n` +
        `${YC} \`Referral Tickets \` • \`${BB}\`\n` +
        `${YC} \`Total Purchases  \` • \`${CC}\`\n` +
        `${YC} \`Total Referred   \` • \`${DD}\`\n\n` +
        `**🍱 Extra**\n` +
        `${GC} \`1 PP Cash = 1₹\`\n` +
        `${GC} To know rules & information, type \`.?shoprules\``)
        .setFooter({ text: selectedUsername, iconURL: selectedAvatar })
        .setTimestamp();
    const userRow = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder().setCustomId(`modify_ppCash_${selectedUser.user_id}`).setLabel("💰 Modify PP Cash").setStyle(discord_js_1.ButtonStyle.Success), new discord_js_1.ButtonBuilder().setCustomId(`modify_referral_${selectedUser.user_id}`).setLabel("🎟 Modify Referral Tickets").setStyle(discord_js_1.ButtonStyle.Primary), new discord_js_1.ButtonBuilder().setCustomId(`modify_purchases_${selectedUser.user_id}`).setLabel("🛒 Modify Purchases").setStyle(discord_js_1.ButtonStyle.Success), new discord_js_1.ButtonBuilder().setCustomId(`modify_referred_${selectedUser.user_id}`).setLabel("👥 Modify Total Referred").setStyle(discord_js_1.ButtonStyle.Primary), new discord_js_1.ButtonBuilder().setCustomId(`delete_${selectedUser.user_id}`).setLabel("❌ Delete User").setStyle(discord_js_1.ButtonStyle.Danger));
    const navigationRow = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder().setCustomId(`refresh_${selectedUser.user_id}`).setLabel("🔄 Refresh").setStyle(discord_js_1.ButtonStyle.Secondary));
    await interaction.reply({ embeds: [userEmbed], files: [attachment], components: [userRow, navigationRow], flags: 64 });
}
async function handleRefresh(interaction) {
    (0, logger_custom_1.logger_custom)("ADMIN", "admin", "Admin clicked Refresh button");
    const userId = interaction.customId.split("_")[1];
    const [userData] = await db_1.default.query("SELECT pp_cash, refer_tickets, total_purchases, registration_date, total_referred FROM users WHERE user_id = ?", [userId]);
    if (userData.length === 0) {
        await interaction.reply({ content: "❌ User data not found!", ephemeral: true });
        return;
    }
    const { pp_cash, refer_tickets, total_purchases, registration_date, total_referred } = userData[0];
    const formattedDate = (0, moment_timezone_1.default)(registration_date).tz("Asia/Kolkata", true).format("DD MMM YYYY, hh:mm A");
    const selectedDiscordUser = await interaction.client.users.fetch(userId).catch(() => null);
    const selectedUsername = selectedDiscordUser?.username || "Unknown User";
    const selectedAvatar = selectedDiscordUser?.displayAvatarURL() || interaction.client.user.displayAvatarURL();
    const spv = (0, spvCalculator_1.calculateSPV)(pp_cash, refer_tickets, total_purchases, total_referred);
    const spvRounded = Math.round(spv);
    const imageBuffer = await (0, spvImage_1.generateSPVImage)(spvRounded);
    const attachment = new discord_js_1.AttachmentBuilder(imageBuffer, { name: "spv.png" });
    const userEmbed = new discord_js_1.EmbedBuilder()
        .setColor(0xeeff00)
        .setAuthor({
        name: "Prince-Kun • Profile Info",
        iconURL: "https://media.discordapp.net/attachments/1336322293437038602/1336322635939975168/Profile_Pic_2.jpg",
    })
        .setThumbnail("attachment://spv.png")
        .setTitle("ItsMe Prince Shop")
        .setDescription(`${YC} **Name:** <@${userId}>\n` +
        `${YC} **Username:** ${selectedUsername}\n` +
        `${YC} **UserID:** ${userId}\n` +
        `${YC} **Registered on:** ${formattedDate}\n` +
        `${YC} **__SPV:__** ${spv}\n\n` +
        `**📦 Inventory & Stats**\n` +
        `${YC} \`PP Cash          \` • \`${String(pp_cash).padEnd(8)}\`\n` +
        `${YC} \`Referral Tickets \` • \`${String(refer_tickets).padEnd(8)}\`\n` +
        `${YC} \`Total Purchases  \` • \`${String(total_purchases).padEnd(8)}\`\n` +
        `${YC} \`Total Referred   \` • \`${String(total_referred).padEnd(8)}\`\n\n` +
        `**🍱 Extra**\n` +
        `${GC} \`1 PP Cash = 1₹\`\n` +
        `${GC} To know rules & information, type \`.?shoprules\``)
        .setFooter({ text: selectedUsername, iconURL: selectedAvatar })
        .setTimestamp();
    const userRow = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder().setCustomId(`modify_ppCash_${userId}`).setLabel("💵 Modify PP Cash").setStyle(discord_js_1.ButtonStyle.Success), new discord_js_1.ButtonBuilder().setCustomId(`modify_referral_${userId}`).setLabel("🎟️ Modify Referral Tickets").setStyle(discord_js_1.ButtonStyle.Primary), new discord_js_1.ButtonBuilder().setCustomId(`modify_purchases_${userId}`).setLabel("🛒 Modify Purchases").setStyle(discord_js_1.ButtonStyle.Success), new discord_js_1.ButtonBuilder().setCustomId(`modify_referred_${userId}`).setLabel("👥 Modify Total Referred").setStyle(discord_js_1.ButtonStyle.Primary), new discord_js_1.ButtonBuilder().setCustomId(`delete_${userId}`).setLabel("Delete User").setStyle(discord_js_1.ButtonStyle.Danger));
    const controlRow = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder().setCustomId(`refresh_${userId}`).setLabel("🔄 Refresh").setStyle(discord_js_1.ButtonStyle.Secondary));
    await interaction.update({ embeds: [userEmbed], files: [attachment], components: [userRow, controlRow] });
}
async function handleModifyPP(interaction) {
    (0, logger_custom_1.logger_custom)("ADMIN", "admin", "Admin clicked modify PP cash button");
    const userId = interaction.customId.split("_")[2];
    const modal = new discord_js_1.ModalBuilder()
        .setCustomId(`modify_ppCash_${userId}`)
        .setTitle("Modify PP Cash")
        .addComponents(new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.TextInputBuilder()
        .setCustomId("new_ppCash")
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
async function handleModifyReferred(interaction) {
    (0, logger_custom_1.logger_custom)("ADMIN", "admin", "Admin clicked modify total referred button");
    const userId = interaction.customId.split("_")[2];
    const modal = new discord_js_1.ModalBuilder()
        .setCustomId(`modify_referred_${userId}`)
        .setTitle("Modify Total Referred")
        .addComponents(new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.TextInputBuilder()
        .setCustomId("new_total_referred")
        .setLabel("Enter new Total Referred:")
        .setStyle(discord_js_1.TextInputStyle.Short)));
    await interaction.showModal(modal);
}
async function handleModifySubmit(interaction) {
    (0, logger_custom_1.logger_custom)("ADMIN", "admin", "Admin submitted modify modal");
    const parts = interaction.customId.split("_");
    const type = parts[1];
    const userId = parts[2];
    let field, inputValue, updateField;
    if (type === "ppCash") {
        field = "new_ppCash";
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
    else if (type === "referred") {
        field = "new_total_referred";
        updateField = "total_referred";
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
