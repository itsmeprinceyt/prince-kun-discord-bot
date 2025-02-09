import {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    TextChannel,
    GuildMember,
} from "discord.js";

import { Command } from "../types/Command";
import { logger_NoDM_NoAdmin } from "../utility/logger-NoDM-NoAdmin";
import { logger_custom } from "../utility/logger-custom";
import { RolesPerms } from "../utility/rolePerms";
const Moderator = RolesPerms[2].roleId;

const PurgeCommand: Command = {
    data: new SlashCommandBuilder()
        .setName("purge")
        .setDescription("Deletes all messages in the current channel."),

    async execute(interaction: ChatInputCommandInteraction) {
        const isDM = !interaction.guild;
        if (isDM) {
            await interaction.reply({
                content: "This command can only be used in a server!",
                flags: 64,
            });
            logger_NoDM_NoAdmin(interaction);
            return;
        }

        const member = interaction.member as GuildMember;
        const userRoles = (member as any).roles.cache.map((role: any) => role.id);
        const ownerId = interaction.guild!.ownerId;
        const hasModeratorRole = userRoles.includes(Moderator!);

        if (interaction.user.id !== ownerId && !hasModeratorRole) {
            await interaction.reply({
                content: "🚫 You do not have permission to use this command!",
                flags: 64,
            });
            logger_NoDM_NoAdmin(interaction);
            return;
        }

        const channel = interaction.channel as TextChannel;
        let messagesDeleted = 0;

        try {
            await interaction.deferReply({ flags: 64, });
            let fetched;
            do {
                fetched = await channel.messages.fetch({ limit: 100 });
                await channel.bulkDelete(fetched, true);
                messagesDeleted += fetched.size;
            } while (fetched.size >= 2);

            await interaction.editReply({
                content: `✅ Successfully deleted ${messagesDeleted} messages!`,
            });
            const userName = member?.displayName || interaction.user.username;
            logger_custom(userName, "purge", `Command executed successfully! Deleted ${messagesDeleted} messages in ${channel.name}`);
        } catch (error) {
            console.error(error);
            await interaction.editReply({
                content: "❌ An error occurred while deleting messages!",
            });
        }
    },
};

export default PurgeCommand;