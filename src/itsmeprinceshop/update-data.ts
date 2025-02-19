import { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits } from "discord.js";
import pool from "../db";
import { Command } from "../types/Command";
import { logger_custom } from "../utility/logger-custom";
import { logger_NoDM_NoAdmin } from "../utility/logger-NoDM-NoAdmin";
import { RolesPerms } from "../utility/rolePerms";
const adminId = RolesPerms[5].roleId;

export const UpdateData: Command = {
    data: new SlashCommandBuilder()
        .setName("update-data")
        .setDescription("Overwrite user data fields like PP Cash, Referral Tickets, etc.")
        .addUserOption(option =>
            option.setName("user").setDescription("Select the user").setRequired(true)
        )
        .addStringOption(option =>
            option.setName("option")
                .setDescription("Select the field to update")
                .setRequired(true)
                .addChoices(
                    { name: "PP Cash", value: "pp_cash" },
                    { name: "Referral Tickets", value: "refer_tickets" },
                    { name: "Total Purchases", value: "total_purchases" },
                    { name: "Total Referred", value: "total_referred" }
                )
        )
        .addIntegerOption(option =>
            option.setName("amount")
                .setDescription("Enter the new amount")
                .setRequired(true)
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
        const field = interaction.options.getString("option", true);
        const newValue = interaction.options.getInteger("amount", true);

        if (!Number.isInteger(newValue) || newValue < 0) {
            await interaction.reply({ content: "❌ Amount must be an integer and 0 or above!", flags: 64, });
            return;
        }

        const [userData]: any = await pool.query(
            "SELECT user_id FROM users WHERE user_id = ?",
            [user.id]
        );

        if (!userData.length) {
            await interaction.reply({ content: "❌ User is not registered!", flags: 64, });
            return;
        }

        await pool.query("UPDATE users SET ?? = ? WHERE user_id = ?", [field, newValue, user.id]);
        logger_custom("ADMIN", "update-data", `Set ${field} for user ${user.id} to ${newValue}`);

        const formattedField = field.replace("_", " ").toUpperCase();
        const responseMessage = `✅ Successfully set **${formattedField}** to **${newValue}** for <@${user.id}>.`;

        await interaction.reply({
            content: responseMessage,
            flags: 64
        });
    }
};

export default UpdateData;
