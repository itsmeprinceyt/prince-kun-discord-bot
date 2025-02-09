import {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    GuildMember,
} from "discord.js";

import { Command } from "../types/Command";
import { logger_NoDM_NoAdmin } from "../utility/logger-NoDM-NoAdmin";
import { logger_custom } from "../utility/logger-custom";
import { RolesPerms } from "../utility/rolePerms";
const Moderator = RolesPerms[2].roleId;

const BanCommand: Command = {
    data: new SlashCommandBuilder()
        .setName("ban")
        .setDescription("Bans a user from the server.")
        .addUserOption(option =>
            option.setName("target")
                .setDescription("Select the user to ban")
                .setRequired(true)
        ) as SlashCommandBuilder,

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
        const userRoles = member.roles.cache.map(role => role.id);
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

        const targetMember = interaction.options.getMember("target") as GuildMember;
        if (!targetMember) {
            await interaction.reply({
                content: "❌ The specified user is not in the server!",
                flags: 64,
            });
            return;
        }

        if (!targetMember.bannable) {
            await interaction.reply({
                content: "❌ I cannot ban this user. They may have a higher role or special permissions!",
                flags: 64,
            });
            return;
        }

        await targetMember.ban();
        await interaction.reply({
            content: `✅ Successfully banned ${targetMember.user.tag}!`,
            flags: 64,
        });
        const userName = member?.displayName || interaction.user.username;
        logger_custom(userName, "ban", `Command executed successfully! \`${targetMember.user.tag}\` has been banned from the server`);
    },
};

export default BanCommand;
