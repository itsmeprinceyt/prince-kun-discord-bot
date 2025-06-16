import { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits } from "discord.js";
import pool from "../db";
import { Command } from "../types/Command.type";
import { logger_NoDM_NoAdmin } from "../utility/loggers/logger-NoDM-NoAdmin";
import { logger_custom } from "../utility/loggers/logger-custom";
import { RolesPerms } from "../utility/uuid/RolesPerms";
import { calculateSPV } from "../utility/spv/spvCalculator";
const adminId = RolesPerms[5].roleId;

export const Modifydata: Command = {
    data: new SlashCommandBuilder()
        .setName("modify-data")
        .setDescription("Modify user data fields like PP Cash, Referral Tickets, etc.")
        .addUserOption(option =>
            option.setName("user").setDescription("Select the user").setRequired(true)
        )
        .addStringOption(option =>
            option.setName("option")
                .setDescription("Select the field to modify")
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
                .setDescription("Enter the amount (positive or negative integers only)")
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
        const field: string = interaction.options.getString("option", true);
        const amount: number = interaction.options.getInteger("amount", true);

        if (!Number.isInteger(amount)) {
            await interaction.reply({ content: "❌ Amount must be an integer!", flags: 64, });
            return;
        }

        const [rows]: any = await pool.query("SELECT * FROM users WHERE user_id = ?", [user.id]);

        if (rows.length === 0) {
            await interaction.reply({ content: "❌ User is not registered!", flags: 64, });
            return;
        }

        let { pp_cash, refer_tickets, total_purchases, total_referred } = rows[0];
        let spv = parseFloat(rows[0].spv) || 0.00;
        let newValue = 0;
        switch (field) {
            case "pp_cash":
                pp_cash += amount;
                newValue = pp_cash;
                break;
            case "refer_tickets":
                refer_tickets += amount;
                newValue = refer_tickets;
                break;
            case "total_purchases":
                total_purchases += amount;
                newValue = refer_tickets;
                break;
            case "total_referred":
                total_referred += amount;
                newValue = refer_tickets;
                break;
        }
        spv = calculateSPV(pp_cash, refer_tickets, total_purchases, total_referred);

        await pool.query(
            "UPDATE users SET pp_cash = ?, refer_tickets = ?, total_purchases = ?, total_referred = ?, spv = ? WHERE user_id = ?",
            [pp_cash, refer_tickets, total_purchases, total_referred, parseFloat(spv.toFixed(2)), user.id]
        );

        const action: string = amount > 0 ? "added" : "removed";
        const formattedField: string = field.replace("_", " ").toUpperCase();
        const responseMessage: string = `✅ Successfully ${action} **${Math.abs(amount)} ${formattedField}** ${amount > 0 ? "to" : "from"
            } <@${user.id}>'s inventory. \`New Value: ${newValue}\``;

        logger_custom("ADMIN", "modify-data", `Modified ${field} for user ${user.id} by ${amount}, new value: ${newValue}, recalculated SPV: ${spv.toFixed(2)}`);
        await interaction.reply({
            content: `${responseMessage}`,
            flags: 64
        });
    }
};

export default Modifydata;
