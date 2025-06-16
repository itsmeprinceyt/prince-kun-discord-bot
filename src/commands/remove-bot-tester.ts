import { 
    SlashCommandBuilder, 
    ChatInputCommandInteraction, 
    GuildMember,
} from "discord.js";

import { Command } from "../types/Command.type";
import { logger_NoDM_NoAdmin } from "../utility/loggers/logger-NoDM-NoAdmin";
import { logger_custom } from "../utility/loggers/logger-custom";

import { RolesPerms } from "../utility/uuid/RolesPerms";
const BotTester = RolesPerms[6].roleId;

const removeBotTester: Command = {
    data: new SlashCommandBuilder()
        .setName("remove-bot-tester")
        .setDescription("Removes the Bot Tester role from a specified user.")
        .addUserOption(option =>
            option.setName("user")
                .setDescription("Select the user to remove the Bot Tester role.")
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

        const role = interaction.guild.roles.cache.get(BotTester);
        if (!role) {
            await interaction.reply({
                content: "❌ Bot Tester role not found!",
                flags: 64,
            });
            return;
        }
        if (!targetUser.roles.cache.has(BotTester)) {
            await interaction.reply({
                content: `⚠️ \`${targetUser.displayName}\` does not have the Bot Tester role!`,
                flags: 64,
            });
            return;
        }

        try {
            await targetUser.roles.remove(BotTester);
            await interaction.reply({
                content: `✅ Removed the Bot Tester role from -> \`${targetUser.displayName}\`!`,
                flags: 64,
            });

            const logMessage = `${executor.displayName} removed the Bot Tester role to ${targetUser.displayName}`;
            logger_custom(logMessage, "remove-bot-tester", "Role successfully removed!");

        } catch (error) {
            console.error("❌ Error assigning role:", error);
            await interaction.reply({ content: "❌ An error occurred while assigning the role.", flags: 64 });
        }
    }
};

export default removeBotTester;
