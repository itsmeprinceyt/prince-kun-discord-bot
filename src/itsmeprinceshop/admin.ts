import {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
    ComponentType,
} from "discord.js";
import pool from "../db";
import { Command } from "../types/Command.type";
import { handleSelectUser } from "../modals/adminModals";
import { logger_NoDM_NoAdmin } from "../utility/loggers/logger-NoDM-NoAdmin";
import { logger_custom } from "../utility/loggers/logger-custom";
import { RolesPerms } from "../utility/uuid/RolesPerms";

import { ADMIN_USERS_PER_PAGE, ProfileAuthorPicture } from "../utility/utils";

const adminCommand: Command = {
    data: new SlashCommandBuilder()
        .setName("admin")
        .setDescription("Manage registered users (Admins only)."),

    async execute(interaction: ChatInputCommandInteraction) {
        const adminId = RolesPerms[5].roleId;

        if (!interaction.guild) {
            if (interaction.user.id !== adminId) {
                await interaction.reply({
                    content: "This is a Server-Only Command! 🖕",
                    flags: 64
                });
                logger_NoDM_NoAdmin(interaction);
                return;
            }
        } else {
            if (interaction.user.id !== interaction.guild.ownerId) {
                await interaction.reply({
                    content: "🚫 You do not have permission to use this command!",
                    flags: 64
                });
                logger_NoDM_NoAdmin(interaction);
                return;
            }
        }

        let page = 0;
        const [users]: any = await pool.query("SELECT user_id FROM users");
        logger_custom("ADMIN", "admin", "Fetched all registered users");

        if (users.length === 0) {
            await interaction.reply({
                content: "No registered users found!",
                flags: 64,
            });
            return;
        }

        const generateEmbed = () => {
            const start = page * ADMIN_USERS_PER_PAGE;
            const end = start + ADMIN_USERS_PER_PAGE;
            const pageUsers = users.slice(start, end);

            return new EmbedBuilder()
                .setColor(0xeeff00)
                .setAuthor({
                    name: "Prince-Kun • User Database",
                    iconURL: ProfileAuthorPicture,
                })
                .setTitle("Registered Users")
                .setDescription(
                    `\`ID  \` \`Users\`\n` +
                    pageUsers
                        .map((user: any, index: number) => `\`${(start + index + 1).toString().padEnd(4,' ')}\` <@${user.user_id}>`)
                        .join("\n")

                )
                .setFooter({ text: `Page ${page + 1} of ${Math.ceil(users.length / ADMIN_USERS_PER_PAGE)}` })
                .setColor("Blue")
                .setTimestamp();
        };

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder().setCustomId("prev").setLabel("⬅️ Previous").setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId("select").setLabel("🔍 Select User").setStyle(ButtonStyle.Success),
            new ButtonBuilder().setCustomId("next").setLabel("➡️ Next").setStyle(ButtonStyle.Primary)
        );

        const reply = await interaction.reply({
            embeds: [generateEmbed()],
            components: [row],
            flags: 64,
        });

        const collector = reply.createMessageComponentCollector({
            componentType: ComponentType.Button,
            time: 60000
        });

        collector.on("collect", async (buttonInteraction) => {
            if (buttonInteraction.user.id !== adminId) {
                await buttonInteraction.reply({ content: "You cannot use this!", flags: 64 });
                return;
            }

            if (buttonInteraction.customId === "prev" && page > 0) {
                page--;
                logger_custom("ADMIN", "admin", "Admin clicked previous button");
            } else if (buttonInteraction.customId === "next" && (page + 1) * ADMIN_USERS_PER_PAGE < users.length) {
                page++;
                logger_custom("ADMIN", "admin", "Admin clicked next button");
            } else if (buttonInteraction.customId === "select") {
                await handleSelectUser(buttonInteraction);
                return;
            }

            await buttonInteraction.update({ embeds: [generateEmbed()], components: [row] });
        });
    },
};

export default adminCommand;
