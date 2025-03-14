"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const logger_NoDM_NoAdmin_1 = require("../utility/logger-NoDM-NoAdmin");
const logger_custom_1 = require("../utility/logger-custom");
const rolePerms_1 = require("../utility/rolePerms");
const adminId = rolePerms_1.RolesPerms[5].roleId;
const predefinedImage = "https://media.discordapp.net/attachments/1336322293437038602/1350143776999608390/Thank_You.png";
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
            await mentionedUser.send({
                content: `Thank you for your purchase, ${mentionedUser}!\n`
            });
            await mentionedUser.send({
                content: `-# Check your profile using \`/profile\` or reigster using \`/register\` if you haven't!`
            });
            await mentionedUser.send({
                content: `${predefinedImage}`
            });
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
