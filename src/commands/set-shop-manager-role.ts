import { 
    SlashCommandBuilder, 
    ChatInputCommandInteraction, 
    GuildMember 
} from "discord.js";

import { Command } from "../types/Command";
import { logger_NoDM_NoAdmin } from "../utility/logger-NoDM-NoAdmin";
import { logger_custom } from "../utility/logger-custom";

import { RolesPerms } from "../utility/rolePerms";
const ShopManager = RolesPerms[1].roleId;

const setShopManagerRole: Command = {
    data: new SlashCommandBuilder()
        .setName("set-shop-manager-role")
        .setDescription("Assigns the Shop Manager role to a specified user.")
        .addUserOption(option =>
            option.setName("user")
                .setDescription("Select the user to assign the Shop Manager role.")
                .setRequired(true)
        )as SlashCommandBuilder,

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
        const ownerId = interaction.guild.ownerId;

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

        const role = interaction.guild.roles.cache.get(ShopManager);
        if (!role) {
            await interaction.reply({
                content: "❌ Shop Manager role not found!",
                flags: 64,
            });
            return;
        }

        if (targetUser.roles.cache.has(ShopManager)) {
            await interaction.reply({
                content: `⚠️ \`${targetUser.displayName}\` already has this role!`,
                flags: 64,
            });
            return;
        }

        try {
            await targetUser.roles.add(ShopManager);
            await interaction.reply({
                content: `✅ Assigned the Code Poster role to -> \`${targetUser.displayName}\` !`,
                flags: 64,
            });

            const USerMessage = `${executor.displayName} -> assigned Shop Manager role to -> ${targetUser.displayName}`;
            logger_custom(USerMessage,"set-shop-manager-role","Role successfully assigned!");

        } catch (error) {
            console.error("Error assigning role:", error);
            await interaction.reply({ content: "❌ An error occurred while assigning the role.", ephemeral: true });
        }
    }
};

export default setShopManagerRole;
