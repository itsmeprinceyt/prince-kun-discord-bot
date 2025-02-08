"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const rolePerms_1 = require("../utility/rolePerms");
const ShopManager = rolePerms_1.RolesPerms[1].roleId;
const discord_js_1 = require("discord.js");
const chalk_1 = __importDefault(require("chalk"));
const setShopManagerRole = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName("set-shop-manager-role")
        .setDescription("Assigns the Shop Manager role to a specified user.")
        .addUserOption(option => option.setName("user")
        .setDescription("Select the user to assign the Shop Manager role.")
        .setRequired(true)),
    async execute(interaction) {
        if (!interaction.guild) {
            await interaction.reply({
                content: "This is a Server-Only Command! 🖕",
                flags: 64,
            });
            return;
        }
        const executor = interaction.member;
        const ownerId = interaction.guild.ownerId;
        if (executor.id !== ownerId && !executor.permissions.has("Administrator")) {
            await interaction.reply({
                content: "🚫 You don't have permission to use this command!",
                flags: 64,
            });
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
        const role = interaction.guild.roles.cache.get(ShopManager);
        if (!role) {
            await interaction.reply({
                content: "❌ Shop Manager role not found!",
                flags: 64,
            });
            return;
        }
        if (targetUser.roles.cache.has(ShopManager)) {
            await interaction.reply({
                content: `⚠️ ${targetUser.displayName} already has this role!`,
                flags: 64,
            });
            return;
        }
        try {
            await targetUser.roles.add(ShopManager);
            await interaction.reply({
                content: `✅ Assigned the Shop Manager role to -> ${targetUser.displayName}!`,
                flags: 64,
            });
            console.log(chalk_1.default.underline(`[ INFO ]`) +
                "\n" +
                chalk_1.default.green(`User: ${executor.displayName} -> assigned Shop Manager role to -> ${targetUser.displayName}`) +
                "\n" +
                chalk_1.default.magenta(`Command: /set-shop-manager-role`) +
                "\n" +
                chalk_1.default.cyan(`Server: ${interaction.guild?.name}`) +
                "\n" +
                chalk_1.default.green(`Message: Role successfully assigned!\n`));
        }
        catch (error) {
            console.error("Error assigning role:", error);
            await interaction.reply({ content: "❌ An error occurred while assigning the role.", ephemeral: true });
        }
    }
};
exports.default = setShopManagerRole;
