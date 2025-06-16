import { Message, EmbedBuilder } from "discord.js";
import { HelpDescriptionAdmin } from "../utility/commands/help/help-command-admin";
import { RolesPerms } from "../utility/uuid/RolesPerms";
import { ProfileAuthorPicture, Help } from "../utility/utils";
import { COLOR_PRIMARY } from "../utility/uuid/Colors";

export default {
    triggers: [".?help-admin", ".?admin"],
    async execute(message: Message) {
        const embed = new EmbedBuilder()
            .setColor(COLOR_PRIMARY)
            .setAuthor({
                name: "Prince-Kun • Commands",
                iconURL: ProfileAuthorPicture,
            })
            .setTitle("All Admin Commands!")
            .setDescription(HelpDescriptionAdmin)
            .setImage(Help)
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
