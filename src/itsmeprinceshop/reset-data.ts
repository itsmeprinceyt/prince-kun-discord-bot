import { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits } from "discord.js";
import pool from "../db";
import { Command } from "../types/Command";
import { logger_custom } from "../utility/logger-custom";
import { logger_NoDM_NoAdmin } from "../utility/logger-NoDM-NoAdmin";
import { RolesPerms } from "../utility/rolePerms";
const adminId = RolesPerms[5].roleId;

export const ResetData: Command = {
    data: new SlashCommandBuilder()
        .setName("reset-data")
        .setDescription("Reset all user data fields to 0, including SPV.")
        .addUserOption(option =>
            option.setName("user").setDescription("Select the user").setRequired(true)
        ) as SlashCommandBuilder,

    execute: async function (interaction: ChatInputCommandInteraction) {
        if (!interaction.guild && interaction.user.id !== adminId) {
            await interaction.reply("This is a Server-Only Command! 🖕");
            logger_NoDM_NoAdmin(interaction);
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

        const user = interaction.options.getUser("user", true);

        const [userData]: any = await pool.query(
            "SELECT user_id FROM users WHERE user_id = ?",
            [user.id]
        );

        if (!userData.length) {
            await interaction.reply({ content: "❌ User is not registered!", flags: 64 });
            return;
        }

        await pool.query(
            "UPDATE users SET pp_cash = 0, refer_tickets = 0, total_purchases = 0, total_referred = 0, spv = 0.00 WHERE user_id = ?",
            [user.id]
        );
        
        logger_custom("ADMIN", "reset-data", `Reset all stats for user ${user.id} to 0 (SPV included)`);
        const responseMessage = `✅ Successfully reset all stats for <@${user.id}> to 0, including SPV.`;
        
        await interaction.reply({
            content: responseMessage,
            flags: 64
        });
    }
};

export default ResetData;
