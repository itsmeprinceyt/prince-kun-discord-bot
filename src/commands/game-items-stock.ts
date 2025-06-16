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

import { PING_Roles } from "../utility/uuid/PingRoles";
import { RolesPerms } from "../utility/uuid/RolesPerms";
import { COLOR_TRUE } from "../utility/uuid/Colors";
import { ProfileAuthorPicture, BLESSING_OF_THE_WELKIN_MOON, EXPRESS_PASS, INTER_NOT_SUBSCRIPTION, LUNITE_SUBSCRIPTION } from "../utility/utils";
const StockUpdate = PING_Roles[5].roleId;
const MarketUpdate = PING_Roles[4].roleId;
const ShopManager = RolesPerms[1].roleId;
const Admin = RolesPerms[5].roleId;

const ShopItems: Command = {
    data: new SlashCommandBuilder()
        .setName("game-items-stock")
        .setDescription("Sends an embed about selected game stock item.")
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
        )
        .addNumberOption((option) =>
            option.setName("price")
                .setDescription("Enter the price")
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

        const member = interaction.member as GuildMember;
        const userName: string = member?.displayName || interaction.user.username;
        const userRoles = member.roles.cache.map(role => role.id);
        const ownerId = interaction.guild!.ownerId;
        const hasRequiredRole = userRoles.includes(ShopManager);

        if (interaction.user.id !== ownerId && !hasRequiredRole) {
            await interaction.reply({
                content: "🚫 Only the server owner or users with the required role can use this command!",
                flags: 64,
            });
            logger_NoDM_NoAdmin(interaction);
            return;
        }

        const item = interaction.options.getString("item", true);
        const price = interaction.options.getNumber("price", true);

        /*=================================================== WELKIN*/
        const welkin1 = new EmbedBuilder()
            .setColor(COLOR_TRUE)
            .setAuthor({
                name: "Prince-Kun • Genshin Impact",
                iconURL: ProfileAuthorPicture,
            })
            .setTitle("Blessing of the Welkin Moon is in Stock !")
            .setDescription(`\`\`\`GENSHIN IMPACT - BLESSING OF THE WELKIN MOON\`\`\`` +
                `\`\`\`PRICE: ${price} INR/-\`\`\``)
            .setImage(BLESSING_OF_THE_WELKIN_MOON)
            .setFooter({ text: `Price as of:`, iconURL: interaction.user.displayAvatarURL({ extension: "png", size: 512 }) })
            .setTimestamp();

        const welkin2 = new EmbedBuilder()
            .setColor(COLOR_TRUE)
            .setTitle("Read before purchasing")
            .setDescription(`Read <#1177928702114406481> before proceeding`);

        const welkin3 = new EmbedBuilder()
            .setColor(COLOR_TRUE)
            .setTitle("To Purchase")
            .setDescription(`Use <#1181972522900660264> to initiate an order or Message <@${Admin}>`);

        /*=================================================== EXPRESS PASS*/
        const express_pass1 = new EmbedBuilder()
            .setColor(COLOR_TRUE)
            .setAuthor({
                name: "Prince-Kun • Honkai Star Rail",
                iconURL: ProfileAuthorPicture,
            })
            .setTitle("Express Pass is in Stock !")
            .setDescription(`\`\`\`HONKAI STAR RAIL - EXPRESS PASS\`\`\`` +
                `\`\`\`PRICE: ${price} INR/-\`\`\``)
            .setImage(EXPRESS_PASS)
            .setFooter({ text: `Price as of:`, iconURL: interaction.user.displayAvatarURL({ extension: "png", size: 512 }) })
            .setTimestamp();

        const express_pass2 = new EmbedBuilder()
            .setColor(COLOR_TRUE)
            .setTitle("Read before purchasing")
            .setDescription(`Read <#1179353148482146404> before proceeding`);

        const express_pass3 = new EmbedBuilder()
            .setColor(COLOR_TRUE)
            .setTitle("To Purchase")
            .setDescription(`Use <#1181972522900660264> to initiate an order or Message <@${Admin}>`);

        /*=================================================== LUNITE SUBSCRIPTION*/
        const lunite_subscription1 = new EmbedBuilder()
            .setColor(COLOR_TRUE)
            .setAuthor({
                name: "Prince-Kun • Wuthering Waves",
                iconURL: ProfileAuthorPicture,
            })
            .setTitle("Lunite Subscription is in Stock !")
            .setDescription(`\`\`\`WUTHERING WAVES - LUNITE SUBSCRIPTION\`\`\`` +
                `\`\`\`PRICE: ${price} INR/-\`\`\``)
            .setImage(LUNITE_SUBSCRIPTION)
            .setFooter({ text: `Price as of:`, iconURL: interaction.user.displayAvatarURL({ extension: "png", size: 512 }) })
            .setTimestamp();

        const lunite_subscription2 = new EmbedBuilder()
            .setColor(0x00ff00)
            .setTitle("Read before purchasing")
            .setDescription(`Read <#1242938772493176973> before proceeding`);

        const lunite_subscription3 = new EmbedBuilder()
            .setColor(COLOR_TRUE)
            .setTitle("To Purchase")
            .setDescription(`Use <#1181972522900660264> to initiate an order or Message <@${Admin}>`);

        /*=================================================== INTER-KNOT-SUBSCRIPTION*/
        const inter_knot_membership1 = new EmbedBuilder()
            .setColor(COLOR_TRUE)
            .setAuthor({
                name: "Prince-Kun • Zenless Zone Zero",
                iconURL: ProfileAuthorPicture,
            })
            .setTitle("Inter-Knot Membership is in Stock !")
            .setDescription(`\`\`\`ZENLESS ZONE ZERO - INTER-KNOT-SUBSCRIPTION\`\`\`` +
                `\`\`\`PRICE: ${price} INR/-\`\`\``)
            .setImage(INTER_NOT_SUBSCRIPTION)
            .setFooter({ text: `Price as of:`, iconURL: interaction.user.displayAvatarURL({ extension: "png", size: 512 }) })
            .setTimestamp();

        const inter_knot_membership2 = new EmbedBuilder()
            .setColor(COLOR_TRUE)
            .setTitle("Read before purchasing")
            .setDescription(`Read <#1337326717169307682> before proceeding`);

        const inter_knot_membership3 = new EmbedBuilder()
            .setColor(COLOR_TRUE)
            .setTitle("To Purchase")

            .setDescription(`Use <#1181972522900660264> to initiate an order or Message <@310672946316181514>`);

        const embedsMap: Record<string, EmbedBuilder[]> = {
            "welkin": [welkin1, welkin2, welkin3],
            "express-pass": [express_pass1, express_pass2, express_pass3],
            "lunite-subscription": [lunite_subscription1, lunite_subscription2, lunite_subscription3],
            "inter-knot-membership": [inter_knot_membership1, inter_knot_membership2, inter_knot_membership3],
        };

        const embedsToSend = embedsMap[item];

        const channel = interaction.channel as TextChannel;
        if (embedsToSend) {
            await channel.send({
                content: `<@&${MarketUpdate}> <@&${StockUpdate}>`,
                embeds: embedsToSend,
            });
        }

        await interaction.reply({
            content: "✅ Stock information sent!",
            flags: 64,
        });
        const MessageString = `Command executed successfully! : "${item}" at price ${price} INR/-`;
        logger_custom(userName, "game-code", MessageString);

    },
}

export default ShopItems;