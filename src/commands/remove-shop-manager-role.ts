import { 
    SlashCommandBuilder, 
    ChatInputCommandInteraction, 
    GuildMember 
} from "discord.js";

import { Command } from "../types/Command.type";
import { logger_NoDM_NoAdmin } from "../utility/loggers/logger-NoDM-NoAdmin";
import { logger_custom } from "../utility/loggers/logger-custom";

import { RolesPerms } from "../utility/uuid/RolesPerms";
const ShopManager = RolesPerms[1].roleId;

const removeShopManagerRole: Command = {
    data: new SlashCommandBuilder()
        .setName("remove-shop-manager-role")
        .setDescription("Removes the Shop Manager role from a specified user.")
        .addUserOption(option =>
            option.setName("user")
                .setDescription("Select the user to remove the Shop Manager role from.")
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

        const role = interaction.guild.roles.cache.get(ShopManager);
        if (!role) {
            await interaction.reply({
                content: "❌ Shop Manager role not found!",
                flags: 64,
            });
            return;
        }

        if (!targetUser.roles.cache.has(ShopManager)) {
            await interaction.reply({
                content: `⚠️ ${targetUser.displayName} doesn't have this role!`,
                flags: 64,
            });
            return;
        }

        try {
            await targetUser.roles.remove(ShopManager);
            await interaction.reply({
                content: `✅ Removed the Shop Manager role from -> ${targetUser.displayName}!`,
                flags: 64,
            });

            const UserMessage =`${executor.displayName} -> removed Shop Manager role from -> ${targetUser.displayName}`;
            logger_custom(UserMessage,"/remove-shop-manager-role","Role successfully removed!");

        } catch (error) {
            console.error("Error removing role:", error);
            await interaction.reply({ content: "❌ An error occurred while removing the role.", flags: 64 });
        }
    }
};

export default removeShopManagerRole;
