"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const help_command_admin_1 = require("../utility/commands/help/help-command-admin");
const RolesPerms_1 = require("../utility/uuid/RolesPerms");
const utils_1 = require("../utility/utils");
const Colors_1 = require("../utility/uuid/Colors");
exports.default = {
    triggers: [".?help-admin", ".?admin"],
    async execute(message) {
        const embed = new discord_js_1.EmbedBuilder()
            .setColor(Colors_1.COLOR_PRIMARY)
            .setAuthor({
            name: "Prince-Kun • Commands",
            iconURL: utils_1.ProfileAuthorPicture,
        })
            .setTitle("All Admin Commands!")
            .setDescription(help_command_admin_1.HelpDescriptionAdmin)
            .setImage(utils_1.Help)
            .setFooter({ text: `${message.author.username}`, iconURL: message.author.displayAvatarURL() })
            .setTimestamp();
        const adminId = RolesPerms_1.RolesPerms[5].roleId;
        if (!message.guild) {
            if (message.id !== adminId) {
                await message.reply({ embeds: [embed] });
                return;
            }
            else {
                await message.reply("This is a Server-Only Command! 🖕");
            }
            return;
        }
        const userRoles = message.member?.roles.cache.map(role => role.id) || [];
        const allowedRoles = RolesPerms_1.RolesPerms.map(role => role.roleId);
        const hasPermission = userRoles.some(roleId => allowedRoles.includes(roleId)) || message.author.id === message.guild.ownerId;
        if (!hasPermission) {
            await message
                .reply("⛔ You must be the server owner or have an admin role to use this command!")
                .then((msg) => setTimeout(() => msg.delete().catch(() => { }), 5000));
            return;
        }
        await message.reply({ embeds: [embed] });
    },
};
