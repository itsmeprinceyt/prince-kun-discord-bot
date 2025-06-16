"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const logger_NoDM_NoAdmin_1 = require("../utility/loggers/logger-NoDM-NoAdmin");
const logger_custom_1 = require("../utility/loggers/logger-custom");
const RolesPerms_1 = require("../utility/uuid/RolesPerms");
const Colors_1 = require("../utility/uuid/Colors");
const utils_1 = require("../utility/utils");
const ShopManager = RolesPerms_1.RolesPerms[1].roleId;
const Admin = RolesPerms_1.RolesPerms[5].roleId;
const ShopItemsNoStock = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName("game-items-no-stock")
        .setDescription("Sends an embed about selected game stock item being out of stock.")
        .addStringOption((option) => option.setName("item")
        .setDescription("Select the item")
        .setRequired(true)
        .addChoices({ name: "Welkin Moon", value: "welkin" }, { name: "Express Pass", value: "express-pass" }, { name: "Lunite Subscription", value: "lunite-subscription" }, { name: "Inter-Knot Membership", value: "inter-knot-membership" })),
    async execute(interaction) {
        const isDM = !interaction.guild;
        if (isDM) {
            await interaction.reply({
                content: "This is a Server-Only Command! 🖕",
            });
            (0, logger_NoDM_NoAdmin_1.logger_NoDM_NoAdmin)(interaction);
            return;
        }
        const ownerId = interaction.guild.ownerId;
        const member = interaction.member;
        if (interaction.user.id !== ownerId && !member.roles.cache.has(ShopManager)) {
            await interaction.reply({
                content: "🚫 You don't have permission to use this command!",
            });
            (0, logger_NoDM_NoAdmin_1.logger_NoDM_NoAdmin)(interaction);
            return;
        }
        const item = interaction.options.getString("item", true);
        const welkin = new discord_js_1.EmbedBuilder()
            .setColor(Colors_1.COLOR_FALSE)
            .setAuthor({
            name: "Prince-Kun • Genshin Impact",
            iconURL: utils_1.ProfileAuthorPicture,
        })
            .setTitle("Blessing of the Welkin Moon is out of Stock!")
            .setDescription("```GENSHIN IMPACT - BLESSING OF THE WELKIN MOON```")
            .setImage(utils_1.BLESSING_OF_THE_WELKIN_MOON)
            .setTimestamp();
        const express_pass = new discord_js_1.EmbedBuilder()
            .setColor(Colors_1.COLOR_FALSE)
            .setAuthor({
            name: "Prince-Kun • Honkai Star Rail",
            iconURL: utils_1.ProfileAuthorPicture,
        })
            .setTitle("Express Pass is out of Stock!")
            .setDescription("```HONKAI STAR RAIL - EXPRESS PASS```")
            .setImage(utils_1.EXPRESS_PASS)
            .setTimestamp();
        const lunite_subscription = new discord_js_1.EmbedBuilder()
            .setColor(Colors_1.COLOR_FALSE)
            .setAuthor({
            name: "Prince-Kun • Wuthering Waves",
            iconURL: utils_1.ProfileAuthorPicture,
        })
            .setTitle("Lunite Subscription is out of Stock!")
            .setDescription("```WUTHERING WAVES - LUNITE SUBSCRIPTION```")
            .setImage(utils_1.LUNITE_SUBSCRIPTION)
            .setTimestamp();
        const inter_knot_membership = new discord_js_1.EmbedBuilder()
            .setColor(Colors_1.COLOR_FALSE)
            .setAuthor({
            name: "Prince-Kun • Zenless Zone Zero",
            iconURL: utils_1.ProfileAuthorPicture,
        })
            .setTitle("Inter-Knot Membership is out of Stock!")
            .setDescription("```ZENLESS ZONE ZERO - INTER-KNOT MEMBERSHIP```")
            .setImage(utils_1.INTER_NOT_SUBSCRIPTION)
            .setTimestamp();
        const bottomEmbed = new discord_js_1.EmbedBuilder()
            .setColor(Colors_1.COLOR_FALSE)
            .setTitle("Note")
            .setDescription(`You can message <@${Admin}> to ask for more information!`);
        const embedsMap = {
            "welkin": [welkin, bottomEmbed],
            "express-pass": [express_pass, bottomEmbed],
            "lunite-subscription": [lunite_subscription, bottomEmbed],
            "inter-knot-membership": [inter_knot_membership, bottomEmbed],
        };
        const embedsToSend = embedsMap[item];
        const channel = interaction.channel;
        if (embedsToSend) {
            await channel.send({
                embeds: embedsToSend,
            });
        }
        const userName = member?.displayName || interaction.user.username;
        const MessageString = `Command executed successfully! : "${item}`;
        (0, logger_custom_1.logger_custom)(userName, "game-items-no-stock", MessageString);
        await interaction.reply({
            content: "✅ Stock information sent!",
            flags: 64,
        });
    },
};
exports.default = ShopItemsNoStock;
