import {
    GuildMember,
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    EmbedBuilder,
    TextInputBuilder,
    ModalBuilder,
    TextInputStyle,
    ActionRowBuilder,
    ModalSubmitInteraction,
    TextChannel,
} from "discord.js";

import { Command } from "../types/Command.type";
import { logger_command_sent } from "../utility/loggers/logger-command-sent";
import { logger_NoDM_NoAdmin } from "../utility/loggers/logger-NoDM-NoAdmin";
import { logger_custom } from "../utility/loggers/logger-custom";

import { PING_Roles } from "../utility/uuid/PingRoles";
import { RolesPerms } from "../utility/uuid/RolesPerms";
const StockUpdate = PING_Roles[5].roleId;
const MarketUpdate = PING_Roles[4].roleId;
const ShopManager = RolesPerms[1].roleId;

import { PEACE_EMBED } from "../utility/uuid/Colors";
import { ItsMePrinceShopProfile } from "../utility/utils";

const userCache = new Map<string, { username: string; avatarURL: string }>();

const ShopUpdateCommand: Command = {
    data: new SlashCommandBuilder()
        .setName("shop-updates")
        .setDescription("Send an embed message for server updates (admin only)."),

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

        const ownerId: string = interaction.guild!.ownerId;
        const member = interaction.member as GuildMember;
        const userRoles = member.roles.cache.map((role) => role.id);
        const hasRequiredRole = userRoles.includes(ShopManager);

        if (interaction.user.id !== ownerId && !hasRequiredRole) {
            await interaction.reply({
                content: "🚫 Only the server owner or users with the required role can use this command!",
                flags: 64,
            });
            logger_NoDM_NoAdmin(interaction);
            return;
        }

        userCache.set(interaction.user.id, {
            username: interaction.user.username,
            avatarURL: interaction.user.displayAvatarURL(),
        });

        logger_command_sent(interaction);

        const modal = new ModalBuilder()
            .setCustomId("shopUpdateModal")
            .setTitle("Shop Update Message");

        const messageInput = new TextInputBuilder()
            .setCustomId("shopUpdateMessage")
            .setLabel("Enter the update message:")
            .setStyle(TextInputStyle.Paragraph);

        const actionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(messageInput);
        modal.addComponents(actionRow);

        await interaction.showModal(modal);
    },
};

export default ShopUpdateCommand;

export async function handleShopModalSubmit(
    interaction: ModalSubmitInteraction
) {
    if (interaction.customId !== "shopUpdateModal") return;

    const messageContent = interaction.fields.getTextInputValue(
        "shopUpdateMessage"
    );
    const userInfo = userCache.get(interaction.user.id);
    const username: string = userInfo?.username || "Unknown User";

    const embed = new EmbedBuilder()
    .setColor(PEACE_EMBED)
        .setTitle("📢 LATEST SHOP UPDATES")
        .setThumbnail(ItsMePrinceShopProfile)
        .setDescription(messageContent)
        .setTimestamp();

    await interaction.reply({
        content: "✅ Shop update message sent!",
        flags: 64,
    });

    logger_custom(username,"shop-updates modal submit","Shop update sent successfully!");

    const channel = interaction.channel as TextChannel;
    if (channel) {
        await channel.send({
            content: `<@&${StockUpdate}> <@&${MarketUpdate}>`,
            embeds: [embed],
        });
    }
}
