import { RolesPerms } from "../utility/rolePerms";
const CodePoster = RolesPerms[0].roleId;

import { 
    SlashCommandBuilder, 
    ChatInputCommandInteraction, 
    GuildMember 
} from "discord.js";
import chalk from "chalk";
import { Command } from "../types/Command";


const setCodePosterRole: Command = {
    data: new SlashCommandBuilder()
        .setName("set-code-poster-role")
        .setDescription("Assigns the Code Poster role to a specified user.")
        .addUserOption(option =>
            option.setName("user")
                .setDescription("Select the user to assign the Code posting role.")
                .setRequired(true)
        )as SlashCommandBuilder,

    async execute(interaction: ChatInputCommandInteraction) {
        if (!interaction.guild) {
            await interaction.reply({
                content: "This is a Server-Only Command! 🖕",
                flags: 64,
            });
            return;
        }

        const executor = interaction.member as GuildMember;
        const ownerId = interaction.guild.ownerId;

        if (executor.id !== ownerId && !executor.permissions.has("Administrator")) {
            await interaction.reply({
                content: "🚫 You don't have permission to use this command!",
                flags: 64,
            });
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

        const role = interaction.guild.roles.cache.get(CodePoster);
        if (!role) {
            await interaction.reply({
                content: "❌ Code Poster role not found!",
                flags: 64,
            });
            return;
        }

        if (targetUser.roles.cache.has(CodePoster)) {
            await interaction.reply({
                content: `⚠️ ${targetUser.displayName} already has this role!`,
                flags: 64,
            });
            return;
        }

        try {
            await targetUser.roles.add(CodePoster);
            await interaction.reply({
                content: `✅ Assigned the Code Poster role to -> ${targetUser.displayName}!`,
                flags: 64,
            });

            console.log(
                chalk.underline(`[ INFO ]`) +
                "\n" +
                chalk.green(`User: ${executor.displayName} -> assigned Code Poster role to -> ${targetUser.displayName}`) +
                "\n" +
                chalk.magenta(`Command: /set-shop-manager-role`) +
                "\n" +
                chalk.cyan(`Server: ${interaction.guild?.name}`) +
                "\n" +
                chalk.green(`Message: Role successfully assigned!\n`)
            );

        } catch (error) {
            console.error("Error assigning role:", error);
            await interaction.reply({ content: "❌ An error occurred while assigning the role.", ephemeral: true });
        }
    }
};

export default setCodePosterRole;
