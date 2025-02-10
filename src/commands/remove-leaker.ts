import { 
    SlashCommandBuilder, 
    ChatInputCommandInteraction, 
    GuildMember,
} from "discord.js";

import { Command } from "../types/Command";
import { logger_NoDM_NoAdmin } from "../utility/logger-NoDM-NoAdmin";
import { logger_custom } from "../utility/logger-custom";

import { RolesPerms } from "../utility/rolePerms";
const LeakerRole = RolesPerms[4].roleId;

const removeLeaker: Command = {
    data: new SlashCommandBuilder()
        .setName("remove-leaker")
        .setDescription("Removes the Leaker role from a specified user.")
        .addUserOption(option =>
            option.setName("user")
                .setDescription("Select the user to remove the Leaker role from.")
                .setRequired(true)
        ) as SlashCommandBuilder,

    async execute(interaction: ChatInputCommandInteraction) {
        if (!interaction.guild) {
            await interaction.reply({
                content: "This is a Server-Only Command! 🖕",
                flags: 64,
            });
            logger_NoDM_NoAdmin(interaction);
            return;
        }

        const executor = interaction.member as GuildMember;
        const ownerId = interaction.guild.ownerId;

        if (executor.id !== ownerId && !executor.permissions.has("Administrator")) {
            await interaction.reply({
                content: "🚫 You don't have permission to use this command!",
                flags: 64,
            });
            logger_NoDM_NoAdmin(interaction);
            return;
        }

        const targetUser = interaction.options.getMember("user") as GuildMember;
        if (!targetUser) {
            await interaction.reply({
                content: "❌ Invalid user! Please mention a valid member.",
                flags: 64,
            });
            return;
        }

        const role = interaction.guild.roles.cache.get(LeakerRole);
        if (!role) {
            await interaction.reply({
                content: "❌ Leaker role not found!",
                flags: 64,
            });
            return;
        }

        if (!targetUser.roles.cache.has(LeakerRole)) {
            await interaction.reply({
                content: `⚠️ \`${targetUser.displayName}\` doesn't have the Leaker role!`,
                flags: 64,
            });
            return;
        }

        try {
            await targetUser.roles.remove(LeakerRole);
            await interaction.reply({
                content: `✅ Removed the Leaker role from -> \`${targetUser.displayName}\`!`,
                flags: 64,
            });

            const logMessage = `${executor.displayName} removed the Leaker role from ${targetUser.displayName}`;
            logger_custom(logMessage, "remove-leaker-role", "Role successfully removed!");

        } catch (error) {
            console.error("❌ Error removing role:", error);
            await interaction.reply({ 
                content: "❌ An error occurred while removing the role.", 
                flags: 64 
            });
        }
    }
};

export default removeLeaker;
