"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const logger_NoDM_NoAdmin_1 = require("../utility/loggers/logger-NoDM-NoAdmin");
const logger_custom_1 = require("../utility/loggers/logger-custom");
const RolesPerms_1 = require("../utility/uuid/RolesPerms");
const utils_1 = require("../utility/utils");
const adminId = RolesPerms_1.RolesPerms[5].roleId;
const PurchaseDone = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName("purchase-done")
        .setDescription("Sends a thank-you message with an image to a user.")
        .addUserOption(option => option.setName("user")
        .setDescription("Mention the user who made the purchase.")
        .setRequired(true)),
    async execute(interaction) {
        if (interaction.user.id !== adminId) {
            await interaction.reply({
                content: "🚫 You do not have permission to use this command!",
                flags: 64
            });
            (0, logger_NoDM_NoAdmin_1.logger_NoDM_NoAdmin)(interaction);
            return;
        }
        const mentionedUser = interaction.options.getUser("user", true);
        try {
            await Promise.all([
                mentionedUser.send({
                    content: `Thank you for your purchase, ${mentionedUser}!\n`
                }),
                mentionedUser.send({
                    content: `-# Check your profile using \`/profile\` or register using \`/register\` if you haven't!`
                }),
                mentionedUser.send({
                    content: `${utils_1.ThankYouForPurchase}`
                })
            ]);
            await interaction.reply({
                content: `✅ Purchase confirmation sent to ${mentionedUser} via DM!`,
                flags: 64,
            });
            (0, logger_custom_1.logger_custom)(interaction.user.username, "purchase-done", `Purchase confirmation sent to ${mentionedUser.id} via DM.`);
        }
        catch (error) {
            await interaction.reply({
                content: "❌ Unable to send DM to the user. They might have DMs disabled.",
                flags: 64
            });
        }
    }
};
exports.default = PurchaseDone;
