import {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    EmbedBuilder,
    TextChannel,
    GuildMember
} from "discord.js";

import { Command } from "../types/Command.type";
import { logger_NoDM_NoAdmin } from "../utility/loggers/logger-NoDM-NoAdmin";
import { logger_custom } from "../utility/loggers/logger-custom";

import { RolesPerms } from "../utility/uuid/RolesPerms";
import { COLOR_FALSE } from '../utility/uuid/Colors';
import { ProfileAuthorPicture, BLESSING_OF_THE_WELKIN_MOON, EXPRESS_PASS, INTER_NOT_SUBSCRIPTION, LUNITE_SUBSCRIPTION } from "../utility/utils";

const ShopManager = RolesPerms[1].roleId;
const Admin = RolesPerms[5].roleId;

const ShopItemsNoStock: Command = {
    data: new SlashCommandBuilder()
        .setName("game-items-no-stock")
        .setDescription("Sends an embed about selected game stock item being out of stock.")
        .addStringOption((option) =>
            option.setName("item")
                .setDescription("Select the item")
                .setRequired(true)
                .addChoices(
                    { name: "Welkin Moon", value: "welkin" },
                    { name: "Express Pass", value: "express-pass" },
                    { name: "Lunite Subscription", value: "lunite-subscription" },
                    { name: "Inter-Knot Membership", value: "inter-knot-membership" }
                )
        ) as SlashCommandBuilder,

    async execute(interaction: ChatInputCommandInteraction) {
        const isDM = !interaction.guild;
        if (isDM) {
            await interaction.reply({
                content: "This is a Server-Only Command! 🖕",
            });
            logger_NoDM_NoAdmin(interaction);
            return;
        }

        const ownerId = interaction.guild!.ownerId;
        const member = interaction.member as GuildMember;

        if (interaction.user.id !== ownerId && !member.roles.cache.has(ShopManager)) {
            await interaction.reply({
                content: "🚫 You don't have permission to use this command!",
            });
            logger_NoDM_NoAdmin(interaction);
            return;
        }

        const item: string = interaction.options.getString("item", true);

        const welkin = new EmbedBuilder()
            .setColor(COLOR_FALSE)
            .setAuthor({
                name: "Prince-Kun • Genshin Impact",
                iconURL: ProfileAuthorPicture,
            })
            .setTitle("Blessing of the Welkin Moon is out of Stock!")
            .setDescription("```GENSHIN IMPACT - BLESSING OF THE WELKIN MOON```")
            .setImage(BLESSING_OF_THE_WELKIN_MOON)
            .setTimestamp();

        const express_pass = new EmbedBuilder()
            .setColor(COLOR_FALSE)
            .setAuthor({
                name: "Prince-Kun • Honkai Star Rail",
                iconURL: ProfileAuthorPicture,
            })
            .setTitle("Express Pass is out of Stock!")
            .setDescription("```HONKAI STAR RAIL - EXPRESS PASS```")
            .setImage(EXPRESS_PASS)
            .setTimestamp();

        const lunite_subscription = new EmbedBuilder()
            .setColor(COLOR_FALSE)
            .setAuthor({
                name: "Prince-Kun • Wuthering Waves",
                iconURL: ProfileAuthorPicture,
            })
            .setTitle("Lunite Subscription is out of Stock!")
            .setDescription("```WUTHERING WAVES - LUNITE SUBSCRIPTION```")
            .setImage(LUNITE_SUBSCRIPTION)
            .setTimestamp();

        const inter_knot_membership = new EmbedBuilder()
            .setColor(COLOR_FALSE)
            .setAuthor({
                name: "Prince-Kun • Zenless Zone Zero",
                iconURL: ProfileAuthorPicture,
            })
            .setTitle("Inter-Knot Membership is out of Stock!")
            .setDescription("```ZENLESS ZONE ZERO - INTER-KNOT MEMBERSHIP```")
            .setImage(INTER_NOT_SUBSCRIPTION)
            .setTimestamp();

        const bottomEmbed = new EmbedBuilder()
            .setColor(COLOR_FALSE)
            .setTitle("Note")
            .setDescription(`You can message <@${Admin}> to ask for more information!`);

        const embedsMap: Record<string, EmbedBuilder[]> = {
            "welkin": [welkin, bottomEmbed],
            "express-pass": [express_pass, bottomEmbed],
            "lunite-subscription": [lunite_subscription, bottomEmbed],
            "inter-knot-membership": [inter_knot_membership, bottomEmbed],
        };

        const embedsToSend = embedsMap[item];

        const channel = interaction.channel as TextChannel;
        if (embedsToSend) {
            await channel.send({
                embeds: embedsToSend,
            });
        }

        const userName: string = member?.displayName || interaction.user.username;

        const MessageString = `Command executed successfully! : "${item}`;
        logger_custom(userName, "game-items-no-stock", MessageString);

        await interaction.reply({
            content: "✅ Stock information sent!",
            flags: 64,
        });

    },
};

export default ShopItemsNoStock;
