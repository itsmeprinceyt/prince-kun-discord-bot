import {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    EmbedBuilder,
    PermissionFlagsBits,
    User,
} from "discord.js";
import pool from "../db";
import { Command } from "../types/Command";
import { logger_custom } from "../utility/logger-custom";
import { logger_NoDM_NoAdmin } from "../utility/logger-NoDM-NoAdmin";
import { RolesPerms } from "../utility/rolePerms";

const adminId = RolesPerms[5].roleId;

const deleteUserCommand: Command = {
    data: new SlashCommandBuilder()
        .setName("delete-user")
        .setDescription("Delete a registered user from the database.")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addUserOption(option =>
            option.setName("user")
                .setDescription("The user to delete")
                .setRequired(true)
        ) as SlashCommandBuilder,

    async execute(interaction: ChatInputCommandInteraction) {
        if (!interaction.guild && interaction.user.id !== adminId) {
            await interaction.reply("This is a Server-Only Command! 🖕");
            return;
        }

        if (interaction.guild && !interaction.memberPermissions?.has(PermissionFlagsBits.Administrator)) {
            await interaction.reply({
                content: "❌ Only administrators can use this command!",
                flags: 64,
            });
            logger_NoDM_NoAdmin(interaction);
            return;
        }

        const selectedUser = interaction.options.getUser("user") as User;

        const [rows]: any = await pool.query("SELECT user_id FROM users WHERE user_id = ?", [selectedUser.id]);

        if (rows.length === 0) {
            await interaction.reply({
                content: `❌ ${selectedUser.username} is not registered!`,
                flags: 64,
            });
            logger_NoDM_NoAdmin(interaction);
            return;
        }

        await pool.query("DELETE FROM users WHERE user_id = ?", [selectedUser.id]);

        const logMessage = `[ DATABASE ] User ${selectedUser.username} (${selectedUser.id}) deleted by Admin ${interaction.user.username}`;
        logger_custom(selectedUser.username, "delete-user", logMessage);

        const embed = new EmbedBuilder()
            .setColor(0xff0000)
            .setTitle("User Deleted")
            .setThumbnail(selectedUser.displayAvatarURL())
            .setDescription(`User <@${selectedUser.id}> has been removed from the database.`)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};

export default deleteUserCommand;
