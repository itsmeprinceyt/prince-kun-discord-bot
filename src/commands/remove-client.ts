import { 
    SlashCommandBuilder, 
    ChatInputCommandInteraction, 
    GuildMember,
} from "discord.js";

import { Command } from "../types/Command.type";
import { logger_NoDM_NoAdmin } from "../utility/loggers/logger-NoDM-NoAdmin";
import { logger_custom } from "../utility/loggers/logger-custom";

import { RolesPerms } from "../utility/uuid/RolesPerms";
const ClientRole = RolesPerms[3].roleId;

const removeClient: Command = {
    data: new SlashCommandBuilder()
        .setName("remove-client")
        .setDescription("Removes the Client role from a specified user.")
        .addUserOption(option =>
            option.setName("user")
                .setDescription("Select the user to remove the Client role.")
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
        const ownerId: string = interaction.guild.ownerId;

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

        const role = interaction.guild.roles.cache.get(ClientRole);
        if (!role) {
            await interaction.reply({
                content: "❌ Client role not found!",
                flags: 64,
            });
            return;
        }

        if (!targetUser.roles.cache.has(ClientRole)) {
            await interaction.reply({
                content: `⚠️ \`${targetUser.displayName}\` does not have the Client role!`,
                flags: 64,
            });
            return;
        }

        try {
            await targetUser.roles.remove(ClientRole);
            await interaction.reply({
                content: `✅ Removed the Client role from -> \`${targetUser.displayName}\`!`,
                flags: 64,
            });

            const logMessage = `${executor.displayName} removed the Client role from ${targetUser.displayName}`;
            logger_custom(logMessage, "remove-client-role", "Role successfully removed!");

        } catch (error) {
            console.error("❌ Error removing role:", error);
            await interaction.reply({ content: "❌ An error occurred while removing the role.", flags: 64 });
        }
    }
};

export default removeClient;
