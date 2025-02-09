"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const help_command_admin_1 = require("../utility/help-command-admin");
const rolePerms_1 = require("../utility/rolePerms");
exports.default = {
    triggers: [".?help-admin", ".?admin"],
    async execute(message) {
        const embed = new discord_js_1.EmbedBuilder()
            .setColor(0xc200ff)
            .setAuthor({
            name: "Prince-Kun • Commands",
            iconURL: "https://media.discordapp.net/attachments/1336322293437038602/1336322635939975168/Profile_Pic_2.jpg",
        })
            .setTitle("All Admin Commands!")
            .setDescription(help_command_admin_1.HelpDescriptionAdmin)
            .setImage("https://media.discordapp.net/attachments/1336322293437038602/1336708310904340572/Help.png")
            .setFooter({
            text: `${message.author.username} | ${new Date().toLocaleTimeString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
                timeZone: "Asia/Kolkata",
            })} ${new Date().getHours() >= 12 ? "PM" : "AM"}`,
            iconURL: message.author.displayAvatarURL(),
        });
        if (!message.guild) {
            await message.reply("This is a Server-Only Command! 🖕");
            return;
        }
        const userRoles = message.member?.roles.cache.map(role => role.id) || [];
        const allowedRoles = rolePerms_1.RolesPerms.map(role => role.roleId);
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
