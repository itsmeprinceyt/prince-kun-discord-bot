import {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    GuildMember,
} from "discord.js";

import { Command } from "../types/Command.type";
import { logger_NoDM_NoAdmin } from "../utility/loggers/logger-NoDM-NoAdmin";
import { logger_custom } from "../utility/loggers/logger-custom";
import { RolesPerms } from "../utility/uuid/RolesPerms";
const Moderator = RolesPerms[2].roleId;

const KickCommand: Command = {
    data: new SlashCommandBuilder()
        .setName("kick")
        .setDescription("Kicks a user from the server.")
        .addUserOption(option =>
            option.setName("target")
                .setDescription("Select the user to kick")
                .setRequired(true)
        ) as SlashCommandBuilder,

    async execute(interaction: ChatInputCommandInteraction) {
        const isDM = !interaction.guild;
        if (isDM) {
            await interaction.reply({
                content: "This is a Server-Only Command! 🖕",
                flags: 64,
            });
            logger_NoDM_NoAdmin(interaction);
            return;
        }

        const member = interaction.member as GuildMember;
        const userRoles = member.roles.cache.map(role => role.id);
        const ownerId: string = interaction.guild!.ownerId;
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

        if (!targetMember.kickable) {
            await interaction.reply({
                content: "❌ I cannot kick this user. They may have a higher role or special permissions!",
                flags: 64,
            });
            return;
        }

        await targetMember.kick();
        await interaction.reply({
            content: `✅ Successfully kicked ${targetMember.user.tag}!`,
            flags: 64,
        });
        const userName = member?.displayName || interaction.user.username;
        logger_custom(userName, "kick", `Command executed successfully! \`${targetMember.user.tag}\` has been kicked out of the server`);
    },
};

export default KickCommand;
