import { Message, EmbedBuilder } from "discord.js";
import { HelpDescriptionAdmin } from "../utility/help-command-admin";
import { RolesPerms } from "../utility/rolePerms";

export default {
    triggers: [".?help-admin", ".?admin"],
    async execute(message: Message) {
        const embed = new EmbedBuilder()
            .setColor(0xc200ff)
            .setAuthor({
                name: "Prince-Kun • Commands",
                iconURL: "https://media.discordapp.net/attachments/1336322293437038602/1336322635939975168/Profile_Pic_2.jpg",
            })
            .setTitle("All Admin Commands!")
            .setDescription(HelpDescriptionAdmin)
            .setImage("https://media.discordapp.net/attachments/1336322293437038602/1336708310904340572/Help.png")
            .setFooter({ text: `${message.author.username}`, iconURL: message.author.displayAvatarURL() })
            .setTimestamp();

        const adminId = RolesPerms[5].roleId;
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
        const allowedRoles = RolesPerms.map(role => role.roleId);

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
