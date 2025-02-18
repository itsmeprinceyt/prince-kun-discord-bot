"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const db_1 = __importDefault(require("../db"));
const logger_custom_1 = require("../utility/logger-custom");
const rolePerms_1 = require("../utility/rolePerms");
const adminId = rolePerms_1.RolesPerms[5].roleId;
const registerUserCommand = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName("register-user")
        .setDescription("Register a user in the database.")
        .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.Administrator)
        .addUserOption(option => option.setName("user")
        .setDescription("The user to register")
        .setRequired(true)),
    async execute(interaction) {
        if (!interaction.guild && interaction.user.id !== adminId) {
            await interaction.reply("This is a Server-Only Command! 🖕");
            return;
        }
        if (interaction.guild && !interaction.memberPermissions?.has(discord_js_1.PermissionFlagsBits.Administrator)) {
            await interaction.reply({
                content: "❌ Only administrators can use this command!",
                flags: 64,
            });
            return;
        }
        const selectedUser = interaction.options.getUser("user");
        const selectedMember = interaction.guild?.members.cache.get(selectedUser.id);
        const userName = selectedMember?.displayName || selectedUser.username;
        const [rows] = await db_1.default.query("SELECT user_id FROM users WHERE user_id = ?", [selectedUser.id]);
        if (rows.length > 0) {
            await interaction.reply({
                content: `❌ ${userName} is already registered!`,
                flags: 64,
            });
            return;
        }
        const istTime = moment_timezone_1.default.tz("Europe/Paris").tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");
        await db_1.default.query("INSERT INTO users (user_id, pp_cash, refer_tickets, total_purchases, registration_date, total_referred) VALUES (?, ?, ?, ?, ?, ?)", [selectedUser.id, 0, 0, 0, istTime, 0]);
        const logMessage = `[ DATABASE ] User ${userName} (${selectedUser.id}) registered by Admin ${interaction.user.username}`;
        (0, logger_custom_1.logger_custom)(userName, "register", logMessage);
        const embed = new discord_js_1.EmbedBuilder()
            .setColor(0x00ff00)
            .setTitle("Registration Successful !")
            .setThumbnail(selectedUser.displayAvatarURL())
            .setDescription(`Well then, <@${selectedUser.id}>, you're registered!\n Use \`/profile\` to check your inventory!\n\n**Current Marketplace:** https://discord.com/channels/310675536340844544/1177928471951966339/1179354261365211218`)
            .setTimestamp();
        await interaction.reply({ embeds: [embed] });
    }
};
exports.default = registerUserCommand;
