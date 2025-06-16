import {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    User
} from "discord.js";

import { Command } from "../types/Command.type";
import { logger_NoDM_NoAdmin } from "../utility/loggers/logger-NoDM-NoAdmin";
import { logger_custom } from "../utility/loggers/logger-custom";
import { RolesPerms } from "../utility/uuid/RolesPerms";

import { ThankYouForPurchase } from "../utility/utils";

const adminId = RolesPerms[5].roleId;

const PurchaseDone: Command = {
    data: new SlashCommandBuilder()
        .setName("purchase-done")
        .setDescription("Sends a thank-you message with an image to a user.")
        .addUserOption(option =>
            option.setName("user")
                .setDescription("Mention the user who made the purchase.")
                .setRequired(true)
        ) as SlashCommandBuilder,

    async execute(interaction: ChatInputCommandInteraction) {
        if (interaction.user.id !== adminId) {
            await interaction.reply({
                content: "🚫 You do not have permission to use this command!",
                flags: 64
            });
            logger_NoDM_NoAdmin(interaction);
            return;
        }

        const mentionedUser: User = interaction.options.getUser("user", true);

        try {
            await Promise.all([
                mentionedUser.send({
                    content: `Thank you for your purchase, ${mentionedUser}!\n`
                }),
                mentionedUser.send({
                    content: `-# Check your profile using \`/profile\` or register using \`/register\` if you haven't!`
                }),
                mentionedUser.send({
                    content: `${ThankYouForPurchase}`
                })
            ]);

            await interaction.reply({
                content: `✅ Purchase confirmation sent to ${mentionedUser} via DM!`,
                flags: 64,
            });

            logger_custom(interaction.user.username, "purchase-done", `Purchase confirmation sent to ${mentionedUser.id} via DM.`);
        } catch (error) {
            await interaction.reply({
                content: "❌ Unable to send DM to the user. They might have DMs disabled.",
                flags: 64
            });
        }
    }
}

export default PurchaseDone;
